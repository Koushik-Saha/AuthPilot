import { generateAppealLetter } from '../write-appeal-letter'
import { Authorization, Patient, Agency } from '@/types'

describe('AI Appeal Letter Generator', () => {
  const mockAuth: Authorization = {
    id: 'auth-appeal-123',
    patient_id: 'patient-1',
    agency_id: 'agency-1',
    payer_id: 'star-plus',
    status: 'denied',
    services_requested: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockPatient: Patient = {
    id: 'patient-1',
    agency_id: 'agency-1',
    full_name: 'Maria Gonzalez',
    dob: '1954-06-12',
    medicaid_id: '9876543210',
    primary_diagnoses: [{ code: 'M79.7', description: 'Fibromyalgia with severe polyarthralgia', is_primary: true }],
    physician_npi: '1234567890',
    physician_name: 'Dr. Robert Chen',
    homebound_status: true,
    homebound_reason: 'Patient requires physical assistance of 2 persons for ambulation.',
    created_at: new Date().toISOString(),
  }

  const mockAgency: Agency = {
    id: 'agency-1',
    name: 'Apex Home Health Care',
    npi: '1987654321',
    state: 'TX',
    plan: 'starter',
    stripe_customer_id: 'cus_123',
    pa_count_this_month: 4,
    created_at: new Date().toISOString(),
  }

  test('generateAppealLetter produces formal clinical rebuttal and appeal PDF', async () => {
    const result = await generateAppealLetter({
      authorization: mockAuth,
      patient: mockPatient,
      agency: mockAgency,
      denialCode: 'A001',
      denialReasonText: 'Not medically necessary / Insufficient clinical documentation of Nursing Facility LOC.',
    })

    expect(result).toBeDefined()
    expect(result.appeal_text).toBeDefined()
    expect(result.appeal_text.length).toBeGreaterThan(200)
    expect(result.pdf_base64).toBeDefined()
    expect(result.pdf_base64.length).toBeGreaterThan(100)
  }, 45000)
})
