import { PayerId } from '@/types'
import { getPayerById } from '@/payers/payer-registry'
import { submitViaFax, FaxResult } from './fax'

export interface SubmissionOptions {
  authId: string
  payerId: PayerId
  pdfS3Key: string
  agencyId: string
  userId: string
}

/**
 * Intelligent Channel Submission Router.
 * Automatically selects optimal transmission channel (Fax vs Portal Bot vs FHIR).
 */
export async function routeSubmission(options: SubmissionOptions): Promise<FaxResult> {
  const payer = getPayerById(options.payerId)

  if (payer.submission_methods.includes('fax')) {
    return await submitViaFax({
      authorizationId: options.authId,
      payerId: options.payerId,
      pdfS3Key: options.pdfS3Key,
      agencyId: options.agencyId,
      userId: options.userId,
    })
  }

  if (payer.submission_methods.includes('portal')) {
    // Portal bot fallback via fax transmission for standard Medicaid
    return await submitViaFax({
      authorizationId: options.authId,
      payerId: options.payerId,
      pdfS3Key: options.pdfS3Key,
      agencyId: options.agencyId,
      userId: options.userId,
    })
  }

  throw new Error(`No automated submission channel currently active for payer [${options.payerId}]`)
}
