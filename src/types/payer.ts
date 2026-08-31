import { PayerId, SubmissionChannel } from './index'

export interface PayerConfig {
  id: PayerId
  name: string
  full_name: string
  state: string
  fax_numbers: { primary: string; appeals: string }
  portal_url?: string
  submission_methods: SubmissionChannel[]
  response_deadline_standard_days: number   // CMS mandates 7 days as of Jan 2026
  response_deadline_urgent_hours: number    // CMS mandates 72 hours
  required_form_fields: FormField[]
  clinical_criteria: ClinicalCriterion[]
  denial_codes: Record<string, DenialCode>
  notes: string
}

export interface FormField {
  field_id: string
  label: string
  required: boolean
  type: 'text' | 'date' | 'boolean' | 'select' | 'icd10' | 'npi' | 'textarea'
  options?: string[]
  validation_regex?: string
  hipaa_phi: boolean           // marks if field contains PHI
  extraction_hint: string      // tells Claude what to look for in documents
}

export interface ClinicalCriterion {
  criterion_id: string
  name: string
  description: string
  required: boolean
  documentation_required: string[]   // what documents prove this criterion
}

export interface DenialCode {
  code: string
  reason: string
  appeal_strategy: string    // what to include in appeal letter for this code
  typical_overturn_rate: number  // 0.0-1.0, used to set coordinator expectations
}

export interface PAFormFields {
  member_name: string
  medicaid_id: string
  dob: string
  primary_icd10: string
  primary_icd10_description: string
  secondary_icd10: string[]
  requesting_npi: string
  requesting_provider_name: string
  requesting_provider_address: string
  requesting_provider_phone: string
  servicing_npi?: string
  service_type: string
  procedure_code: string
  requested_hours_per_week: string
  start_date: string
  end_date: string
  homebound_status: boolean
  homebound_reason: string
  oasis_assessment_date?: string
  physician_signature_date?: string
  medical_necessity_justification: string
}
