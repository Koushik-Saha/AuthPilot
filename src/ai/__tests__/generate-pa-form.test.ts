import { generatePAForm } from '../generate-pa-form'
import { ExtractedClinicalData } from '@/types'

describe('PA Form Generator Pipeline', () => {
  const mockExtracted: ExtractedClinicalData = {
    patient_name: 'Maria Gonzalez',
    dob: '1954-06-12',
    medicaid_id: '9876543210',
    physician_name: 'Dr. Robert Chen, MD',
    physician_npi: '1234567890',
    homebound_status: true,
    homebound_reason: 'Patient requires 2-person assist and rolling walker for all ambulation.',
    care_start_date: '2026-08-20',
    care_end_date: '2027-08-19',
    diagnoses: [{ code: 'M79.7', description: 'Fibromyalgia with severe polyarthralgia', is_primary: true }],
    requested_services: [
      { service_type: 'Personal Attendant Services (PAS)', code: 'S5125', frequency: '18 hours/week', duration_weeks: 52 },
    ],
    confidence_scores: { patient_name: 0.98, medicaid_id: 0.95, physician_npi: 0.90 },
    missing_fields: [],
    raw_extraction_notes: 'Extraction complete from 3 fixture documents',
  }

  test('generatePAForm produces form fields and clinical justification narrative via Claude 3.5 Sonnet', async () => {
    const result = await generatePAForm(mockExtracted, 'star-plus', 'test-auth-123')
    expect(result).toBeDefined()
    expect(result.form_fields).toBeDefined()
    expect(result.form_fields.member_name).toBe('Maria Gonzalez')
    expect(result.form_fields.primary_icd10).toBe('M79.7')
    expect(result.justification_text).toBeDefined()
    expect(result.justification_text.length).toBeGreaterThan(100)
  }, 60000)
})
