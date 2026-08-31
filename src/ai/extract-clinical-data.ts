import Anthropic from '@anthropic-ai/sdk'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { DocumentType, ExtractedClinicalData } from '@/types'
import { EXTRACTION_SYSTEM_PROMPT } from './prompts/extraction'
import { query } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit-log'

export interface ExtractClinicalDataParams {
  documentS3Keys: string[]
  patientId: string
  agencyId: string
  documentTypes: DocumentType[]
  /** Optional inline contents for direct testing/mocking without S3 */
  documentContents?: { key: string; content: string | Buffer; mimeType?: string }[]
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
})

/**
 * Normalizes raw ICD-10 code string to uppercase standard decimal format.
 * Example: "m7940" → "M79.40", "M79.7" → "M79.7"
 */
export function normalizeICD10(code: string): string {
  if (!code) return code
  const clean = code.toUpperCase().trim()
  if (clean.includes('.')) return clean
  const stripped = clean.replace(/[^A-Z0-9]/g, '')
  if (stripped.length > 3) {
    return `${stripped.slice(0, 3)}.${stripped.slice(3)}`
  }
  return stripped
}

/**
 * Normalizes date string to ISO YYYY-MM-DD format.
 */
export function normalizeDate(dateStr?: string | null): string | null {
  if (!dateStr) return null
  const str = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str

  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }
  return str
}

/**
 * Fetches document bytes from S3 bucket as Buffer.
 */
async function fetchDocumentFromS3(s3Key: string): Promise<{ buffer: Buffer; mimeType: string }> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || 'authpilot-documents'
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    })

    const response = await s3Client.send(command)
    if (!response.Body) {
      throw new Error(`S3 object body empty for key: ${s3Key}`)
    }

    const byteArray = await response.Body.transformToByteArray()
    const buffer = Buffer.from(byteArray)
    const mimeType = response.ContentType || (s3Key.endsWith('.pdf') ? 'application/pdf' : 'text/plain')

    return { buffer, mimeType }
  } catch (err: any) {
    throw new Error(`Failed to fetch document from S3 [key=${s3Key}]: ${err?.message || err}`)
  }
}

/**
 * Core clinical document extraction pipeline powered by Claude 3.5 Sonnet.
 */
export async function extractClinicalData(
  params: ExtractClinicalDataParams
): Promise<ExtractedClinicalData> {
  const { documentS3Keys, patientId, agencyId, documentTypes, documentContents } = params

  // 1. Collect document contents (from S3 or inline test buffers)
  const messageBlocks: Anthropic.ContentBlockParam[] = []

  for (let i = 0; i < documentS3Keys.length; i++) {
    const s3Key = documentS3Keys[i]
    let buffer: Buffer
    let mimeType: string

    const inlineDoc = documentContents?.find((d) => d.key === s3Key)
    if (inlineDoc) {
      buffer = typeof inlineDoc.content === 'string' ? Buffer.from(inlineDoc.content) : inlineDoc.content
      mimeType = inlineDoc.mimeType || (s3Key.endsWith('.pdf') ? 'application/pdf' : 'text/plain')
    } else {
      const fetched = await fetchDocumentFromS3(s3Key)
      buffer = fetched.buffer
      mimeType = fetched.mimeType
    }

    const docTypeLabel = documentTypes[i] || 'clinical_notes'

    if (mimeType === 'application/pdf') {
      messageBlocks.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: buffer.toString('base64'),
        },
      })
    } else {
      // Plain text / markdown document content
      messageBlocks.push({
        type: 'text',
        text: `--- DOCUMENT [Type: ${docTypeLabel}, Key: ${s3Key}] ---\n${buffer.toString('utf8')}\n--- END DOCUMENT ---`,
      })
    }
  }

  messageBlocks.push({
    type: 'text',
    text: 'Extract all prior authorization clinical fields from these documents according to system instructions. Return ONLY valid JSON.',
  })

  // 2. Execute Claude Extraction API Call
  let responseText = ''
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: messageBlocks }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    responseText = textBlock && 'text' in textBlock ? textBlock.text : ''
  } catch (err: any) {
    console.error('[Claude Extraction API Error]:', err?.message || err)
    throw new Error(`Claude extraction API invocation failed: ${err?.message || err}`)
  }

  // 3. Clean & Parse JSON Response
  let parsed: any = null
  const cleanJsonText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    parsed = JSON.parse(cleanJsonText)
  } catch {
    // Retry once with a strict retry prompt if initial parse failed
    try {
      const retryResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: EXTRACTION_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: messageBlocks },
          { role: 'assistant', content: responseText },
          { role: 'user', content: 'Your previous response was not valid JSON. Output strictly valid JSON only.' },
        ],
      })
      const retryBlock = retryResponse.content.find((b) => b.type === 'text')
      const retryText = (retryBlock && 'text' in retryBlock ? retryBlock.text : '')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      parsed = JSON.parse(retryText)
    } catch {
      // Fallback partial result if double retry fails
      parsed = {
        confidence_scores: {},
        missing_fields: ['all_fields'],
        raw_extraction_notes: 'Failed to parse JSON response from Claude after retry.',
      }
    }
  }

  // 4. Post-Processing & Normalization
  const result: ExtractedClinicalData = {
    patient_name: parsed.patient_name ? String(parsed.patient_name).trim() : undefined,
    dob: normalizeDate(parsed.dob) || undefined,
    medicaid_id: parsed.medicaid_id ? String(parsed.medicaid_id).trim() : undefined,
    diagnoses: Array.isArray(parsed.diagnoses)
      ? parsed.diagnoses.map((d: any) => ({
          code: normalizeICD10(d.code),
          description: String(d.description || '').trim(),
          is_primary: Boolean(d.is_primary),
        }))
      : undefined,
    physician_name: parsed.physician_name ? String(parsed.physician_name).trim() : undefined,
    physician_npi: parsed.physician_npi ? String(parsed.physician_npi).trim() : undefined,
    homebound_status: Boolean(parsed.homebound_status),
    homebound_reason: parsed.homebound_reason ? String(parsed.homebound_reason).trim() : undefined,
    requested_services: Array.isArray(parsed.requested_services)
      ? parsed.requested_services.map((s: any) => ({
          service_type: String(s.service_type || '').trim(),
          code: String(s.code || '').trim(),
          frequency: String(s.frequency || '').trim(),
          duration_weeks: Number(s.duration_weeks) || 52,
        }))
      : undefined,
    care_frequency: parsed.care_frequency ? String(parsed.care_frequency).trim() : undefined,
    care_start_date: normalizeDate(parsed.care_start_date) || undefined,
    functional_limitations: Array.isArray(parsed.functional_limitations)
      ? parsed.functional_limitations.map((f: any) => String(f).trim())
      : undefined,
    confidence_scores: parsed.confidence_scores && typeof parsed.confidence_scores === 'object' ? parsed.confidence_scores : {},
    missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : [],
    raw_extraction_notes: parsed.raw_extraction_notes ? String(parsed.raw_extraction_notes).trim() : '',
  }

  // Low confidence check (< 0.6 -> add to missing_fields)
  Object.entries(result.confidence_scores).forEach(([fieldName, score]) => {
    if (typeof score === 'number' && score < 0.6) {
      if (!result.missing_fields.includes(fieldName)) {
        result.missing_fields.push(fieldName)
      }
    }
  })

  // 5. Database update (save extracted_data to documents table in Neon PostgreSQL)
  try {
    const avgConfidence =
      Object.keys(result.confidence_scores).length > 0
        ? Object.values(result.confidence_scores).reduce((a, b) => a + b, 0) /
          Object.values(result.confidence_scores).length
        : 0.0

    if (documentS3Keys.length > 0) {
      await query(
        `UPDATE public.documents 
         SET extracted_data = $1, confidence_scores = $2, updated_at = NOW() 
         WHERE patient_id = $3 AND agency_id = $4 AND s3_key = ANY($5::text[])`,
        [JSON.stringify(result), JSON.stringify({ average_confidence: avgConfidence, ...result.confidence_scores }), patientId, agencyId, documentS3Keys]
      )
    }
  } catch (dbErr: any) {
    console.error('[DB Document Save Error]:', dbErr?.message || dbErr)
  }

  // 6. Log audit entry
  await logAuditEvent({
    action: 'document_extracted',
    resourceType: 'document',
    resourceId: patientId,
    agencyId,
  })

  return result
}
