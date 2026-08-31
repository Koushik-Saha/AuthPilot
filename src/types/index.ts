export type PlanTier = 'starter' | 'growth' | 'complete'
export type PAStatus = 'draft' | 'ready_to_submit' | 'submitted' | 'pending' | 'approved' | 'denied' | 'appealed'
export type SubmissionChannel = 'fax' | 'portal' | 'fhir' | 'email'
export type DocumentType = 'oasis' | 'physician_orders' | 'clinical_notes' | 'denial_letter' | 'care_plan'
export type PayerId = 'star-plus' | 'uhc-texas' | 'molina-texas' | 'aetna-texas' | 'humana-texas'

export * from './payer'

export interface Agency {
  id: string
  name: string
  npi: string
  state: string
  plan: PlanTier
  stripe_customer_id: string
  pa_count_this_month: number
  created_at: string
}

export interface Patient {
  id: string
  agency_id: string
  full_name: string
  dob: string
  medicaid_id: string
  medicare_id?: string
  primary_diagnoses: DiagnosisCode[]
  physician_npi: string
  physician_name: string
  homebound_status: boolean
  homebound_reason: string
  created_at: string
}

export interface DiagnosisCode {
  code: string        // ICD-10
  description: string
  is_primary: boolean
}

export interface ExtractedClinicalData {
  patient_name?: string
  dob?: string
  medicaid_id?: string
  diagnoses?: DiagnosisCode[]
  physician_name?: string
  physician_npi?: string
  homebound_status?: boolean
  homebound_reason?: string
  requested_services?: RequestedService[]
  care_frequency?: string
  care_start_date?: string
  functional_limitations?: string[]
  confidence_scores: Record<string, number>  // field name → 0.0-1.0
  missing_fields: string[]
  raw_extraction_notes: string
}

export interface RequestedService {
  service_type: string   // skilled_nursing, physical_therapy, etc.
  code: string           // procedure code
  frequency: string      // e.g. "3x per week"
  duration_weeks: number
}

export interface Authorization {
  id: string
  patient_id: string
  agency_id: string
  payer_id: PayerId
  status: PAStatus
  services_requested: RequestedService[]
  generated_form_s3_key?: string
  submitted_at?: string
  payer_ref_number?: string
  auth_start_date?: string
  auth_end_date?: string
  denial_reason?: string
  appeal_letter_s3_key?: string
  created_at: string
}
