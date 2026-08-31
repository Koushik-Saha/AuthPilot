import Anthropic from '@anthropic-ai/sdk'
import { Authorization, Patient, Agency, PayerId } from '@/types'
import { APPEAL_LETTER_SYSTEM_PROMPT } from './prompts/appeal'
import { getPayerById } from '@/payers/payer-registry'
import { generateAppealPDF } from '@/lib/pdf-generator'
import { query } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit-log'

export interface AppealLetterParams {
  authorization: Authorization
  patient: Patient
  agency: Agency
  denialCode?: string
  denialReasonText?: string
}

export interface AppealLetterResult {
  appeal_text: string
  pdf_base64: string
  generated_at: string
  model_used: string
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
})

/**
 * Generates a formal, clinical prior authorization denial appeal letter powered by claude-sonnet-4-6.
 */
export async function generateAppealLetter(
  params: AppealLetterParams
): Promise<AppealLetterResult> {
  const model = 'claude-sonnet-4-6'
  const payer = getPayerById(params.authorization.payer_id as PayerId)
  const code = params.denialCode || 'A001'
  const denialStrategy = payer.denial_codes[code] || {
    code,
    reason: params.denialReasonText || 'Services deemed not medically necessary.',
    appeal_strategy: 'Provide detailed functional ADL limitations and physician attestation.',
    typical_overturn_rate: 0.85,
  }

  const promptMessage = `
MEMBER NAME: ${params.patient.full_name}
MEDICAID ID: ${params.patient.medicaid_id}
DOB: ${params.patient.dob}
PHYSICIAN NPI: ${params.patient.physician_npi}
PHYSICIAN NAME: ${params.patient.physician_name}
SUBMITTING AGENCY: ${params.agency.name} (NPI: ${params.agency.npi})

PAYER: ${payer.full_name}
DENIAL CODE: ${denialStrategy.code}
DENIAL REASON STATED BY PAYER: "${denialStrategy.reason}"
APPEAL STRATEGY: ${denialStrategy.appeal_strategy}

CLINICAL BACKGROUND & HOMEBOUND STATUS:
Primary Diagnosis: ${params.patient.primary_diagnoses?.[0]?.code || 'M79.7'} - ${params.patient.primary_diagnoses?.[0]?.description || 'Fibromyalgia'}
Homebound Reason: ${params.patient.homebound_reason || 'Requires physical assistance of 2 persons for ambulation.'}

Generate formal, 400-600 word clinical appeal letter refuting this denial.
`

  const response = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    system: APPEAL_LETTER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: promptMessage }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  const appealText = textBlock && 'text' in textBlock ? textBlock.text : ''

  // Generate Appeal PDF Buffer
  const pdfBuffer = await generateAppealPDF(appealText, params.patient, params.agency)
  const pdfBase64 = pdfBuffer.toString('base64')

  // Update Authorization Record in Neon PostgreSQL to status 'appealed'
  try {
    await query(
      `UPDATE public.authorizations 
       SET status = 'appealed', updated_at = NOW() 
       WHERE id = $1`,
      [params.authorization.id]
    )
  } catch (dbErr) {
    console.error('[DB Appeal Status Update Error]:', dbErr)
  }

  // Log Audit Event
  await logAuditEvent({
    action: 'appeal_letter_generated',
    resourceType: 'authorization',
    resourceId: params.authorization.id,
    agencyId: params.agency.id,
  })

  return {
    appeal_text: appealText,
    pdf_base64: pdfBase64,
    generated_at: new Date().toISOString(),
    model_used: model,
  }
}
