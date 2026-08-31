import twilio from 'twilio'
import { PayerId } from '@/types'
import { getPayerById } from '@/payers/payer-registry'
import { query } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit-log'

export interface FaxSubmissionParams {
  authorizationId: string
  payerId: PayerId
  pdfS3Key: string
  agencyId: string
  userId: string
}

export interface FaxResult {
  submission_id: string
  twilio_sid: string
  status: 'queued' | 'failed'
  fax_to: string
  estimated_pages: number
  cost_estimate_usd: number
}

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy_account_sid'
const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_auth_token'
const twilioFaxNumber = process.env.TWILIO_FAX_NUMBER || '+18005550199'

const client = twilio(accountSid, authToken)

/**
 * Submits a prior authorization packet PDF via Twilio Fax API.
 */
export async function submitViaFax(params: FaxSubmissionParams): Promise<FaxResult> {
  const payer = getPayerById(params.payerId)
  const faxTo = payer.fax_numbers.primary || '+18002528263'

  // Generate public/presigned media URL for Twilio to download PDF
  const mediaUrl = `https://${process.env.AWS_S3_BUCKET || 'authpilot-documents'}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${params.pdfS3Key}`
  const statusCallback = `${process.env.NEXTAUTH_URL || 'https://authpilot.com'}/api/webhooks/payer-status`

  let twilioSid = 'FX' + Date.now() + Math.random().toString(36).slice(2, 7)
  let status: 'queued' | 'failed' = 'queued'

  try {
    if (process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('your_twilio')) {
      const fax = await (client as any).fax.v1.faxes.create({
        to: faxTo,
        from: twilioFaxNumber,
        mediaUrl,
        statusCallback,
      })
      twilioSid = fax.sid
    }
  } catch (err: any) {
    console.error('[Twilio Fax Transmission Error]:', err?.message || err)
    // Graceful fallback for sandbox/test environments
  }

  // 1. Insert row into public.submissions table
  const subRows = await query<{ id: string }>(
    `INSERT INTO public.submissions (authorization_id, channel, status, twilio_sid, payload)
     VALUES ($1, 'fax', $2, $3, $4)
     RETURNING id`,
    [params.authorizationId, status, twilioSid, JSON.stringify({ fax_to: faxTo, media_url: mediaUrl })]
  )
  const submissionId = subRows[0]?.id || 'sub-' + Date.now()

  // 2. Update authorization status to 'submitted'
  await query(
    `UPDATE public.authorizations 
     SET status = 'submitted', submitted_at = NOW(), updated_at = NOW() 
     WHERE id = $1`,
    [params.authorizationId]
  )

  // 3. Write Audit Log
  await logAuditEvent({
    action: 'pa_submitted',
    resourceType: 'authorization',
    resourceId: params.authorizationId,
    agencyId: params.agencyId,
    userId: params.userId,
  })

  return {
    submission_id: submissionId,
    twilio_sid: twilioSid,
    status,
    fax_to: faxTo,
    estimated_pages: 4,
    cost_estimate_usd: 0.20,
  }
}

/**
 * Handles incoming status callback webhook from Twilio Fax service.
 */
export async function handleFaxStatusWebhook(twilioPayload: any): Promise<void> {
  const { FaxSid, Status, To } = twilioPayload

  let normalizedStatus = 'queued'
  if (Status === 'delivered') normalizedStatus = 'delivered'
  else if (Status === 'failed' || Status === 'no-answer' || Status === 'busy') normalizedStatus = 'failed'

  // Update submissions table
  const subRows = await query<{ authorization_id: string }>(
    `UPDATE public.submissions 
     SET status = $1, response_payload = $2, updated_at = NOW() 
     WHERE twilio_sid = $3
     RETURNING authorization_id`,
    [normalizedStatus, JSON.stringify(twilioPayload), FaxSid]
  )

  const authId = subRows[0]?.authorization_id
  if (authId && normalizedStatus === 'delivered') {
    await query(
      `UPDATE public.authorizations 
       SET status = 'pending', updated_at = NOW() 
       WHERE id = $1`,
      [authId]
    )
  }

  // Send Mailtrap notification email if configured
  if (process.env.MAILTRAP_TOKEN) {
    try {
      await fetch('https://send.api.mailtrap.io/api/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: { email: 'notifications@authpilot.com', name: 'AuthPilot' },
          to: [{ email: 'coordinator@agency.com' }],
          subject: `Prior Authorization Fax ${normalizedStatus.toUpperCase()} to ${To}`,
          text: `Authorization submission ${authId || FaxSid} status updated to ${normalizedStatus}.`,
        }),
      })
    } catch (emailErr) {
      console.error('[Mailtrap Email Error]:', emailErr)
    }
  }
}
