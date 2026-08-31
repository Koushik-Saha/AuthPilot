import { PayerId, ExtractedClinicalData } from '@/types'
import { getPayerById } from '@/payers/payer-registry'

export interface ValidationResult {
  is_complete: boolean
  missing_required: string[]   // field IDs that are required but missing
  low_confidence: string[]     // field IDs present but confidence < 0.7
  warnings: string[]           // human-readable actionable sentences for coordinators
  ready_to_generate: boolean   // true only if is_complete and no critical missing
}

/**
 * Validates extracted clinical data against payer-specific prior authorization requirements.
 */
export function validateCompleteness(
  extracted: ExtractedClinicalData,
  payerId: PayerId
): ValidationResult {
  const payer = getPayerById(payerId)
  const missing_required: string[] = []
  const low_confidence: string[] = []
  const warnings: string[] = []

  // Helper mapping from payer field_ids to extracted clinical data properties
  const getExtractedFieldValue = (fieldId: string): any => {
    switch (fieldId) {
      case 'member_name':
        return extracted.patient_name
      case 'medicaid_id':
        return extracted.medicaid_id
      case 'dob':
        return extracted.dob
      case 'primary_icd10':
        return extracted.diagnoses && extracted.diagnoses.length > 0 ? extracted.diagnoses[0].code : null
      case 'requesting_npi':
        return extracted.physician_npi
      case 'requesting_provider_name':
        return extracted.physician_name
      case 'service_type':
      case 'requested_hours_per_week':
        return extracted.requested_services && extracted.requested_services.length > 0
          ? extracted.requested_services[0]
          : null
      case 'start_date':
        return extracted.care_start_date
      case 'end_date':
        return extracted.care_end_date || (extracted as any).end_date
      case 'medical_necessity_justification':
        return extracted.homebound_reason || (extracted.functional_limitations && extracted.functional_limitations.join(', '))
      case 'homebound_documented':
      case 'homebound_reason':
        return extracted.homebound_status ? extracted.homebound_reason || true : null
      case 'loc_attached':
        return (extracted as any).loc_attached !== undefined ? (extracted as any).loc_attached : true
      case 'oasis_date':
        return (extracted as any).oasis_assessment_date || (extracted as any).oasis_date || extracted.care_start_date
      case 'physician_signature_date':
        return (extracted as any).physician_signature_date || extracted.care_start_date
      default:
        return (extracted as any)[fieldId]
    }
  }

  // 1. Evaluate Required Fields
  payer.required_form_fields.forEach((field) => {
    if (field.required) {
      const val = getExtractedFieldValue(field.field_id)

      if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
        missing_required.push(field.field_id)

        // Generate coordinator action guidance sentence
        switch (field.field_id) {
          case 'member_name':
            warnings.push('Patient full name is missing. Please verify the patient face sheet or OASIS header.')
            break
          case 'medicaid_id':
            warnings.push('Medicaid Member ID is missing or invalid. Check the patient card or demographic face sheet.')
            break
          case 'dob':
            warnings.push('Date of Birth is missing. Confirm DOB on physician order or referral note.')
            break
          case 'primary_icd10':
            warnings.push('Primary ICD-10 diagnosis code is missing. Check Section 2 of Plan of Care Form 485.')
            break
          case 'requesting_npi':
            warnings.push('Requesting Provider NPI is missing. Locate 10-digit NPI on physician order signature block.')
            break
          case 'service_type':
          case 'requested_hours_per_week':
            warnings.push('Requested service hours or service type is missing. Verify weekly attendant care prescription.')
            break
          case 'medical_necessity_justification':
          case 'homebound_reason':
            warnings.push('Homebound reason is missing. Check the physician orders or OASIS assessment section 8C.')
            break
          default:
            warnings.push(`Required field "${field.label}" (${field.field_id}) is missing from clinical extraction.`)
            break
        }
      }
    }
  })

  // 2. Evaluate Field Confidence Scores (< 0.7)
  if (extracted.confidence_scores) {
    Object.entries(extracted.confidence_scores).forEach(([fieldName, score]) => {
      if (typeof score === 'number' && score < 0.7) {
        low_confidence.push(fieldName)
        warnings.push(
          `Field "${fieldName}" has low extraction confidence (${Math.round(score * 100)}%). Please review carefully before PA submission.`
        )
      }
    })
  }

  // 3. Final Completeness Evaluation
  const is_complete = missing_required.length === 0
  const ready_to_generate = is_complete && low_confidence.length === 0

  return {
    is_complete,
    missing_required,
    low_confidence,
    warnings,
    ready_to_generate,
  }
}
