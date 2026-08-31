import { Agency, Patient, Authorization } from '@/types'

export const DEMO_AGENCY: Agency = {
  id: 'demo-001',
  name: 'Sunrise Home Care Austin',
  npi: '1234567890',
  state: 'TX',
  plan: 'growth',
  stripe_customer_id: 'cus_demo_austin_123',
  pa_count_this_month: 47,
  created_at: '2026-01-15T00:00:00Z',
}

export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    agency_id: 'demo-001',
    full_name: 'Maria Gonzalez',
    dob: '1954-06-12',
    medicaid_id: '9876543210',
    primary_diagnoses: [{ code: 'M79.7', description: 'Fibromyalgia with polyarthralgia', is_primary: true }],
    physician_npi: '1234567890',
    physician_name: 'Dr. Robert Chen, MD',
    homebound_status: true,
    homebound_reason: 'Requires 2-person physical assistance for ambulation.',
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'pat-002',
    agency_id: 'demo-001',
    full_name: 'James Wilson',
    dob: '1948-11-20',
    medicaid_id: '8841920192',
    primary_diagnoses: [{ code: 'I10', description: 'Essential hypertension', is_primary: true }],
    physician_npi: '1987654321',
    physician_name: 'Dr. Amanda Vance, MD',
    homebound_status: true,
    homebound_reason: 'Severe dyspnea on minimal exertion.',
    created_at: '2026-08-05T00:00:00Z',
  },
  {
    id: 'pat-003',
    agency_id: 'demo-001',
    full_name: 'Elena Rodriguez',
    dob: '1961-03-30',
    medicaid_id: '4109283711',
    primary_diagnoses: [{ code: 'M19.0', description: 'Primary osteoarthritis, shoulder', is_primary: true }],
    physician_npi: '1554321098',
    physician_name: 'Dr. Carlos Mendoza, MD',
    homebound_status: true,
    homebound_reason: 'Wheelchair dependent.',
    created_at: '2026-08-10T00:00:00Z',
  },
]

export const DEMO_AUTHORIZATIONS: Authorization[] = [
  {
    id: 'auth-demo-1',
    patient_id: 'pat-001',
    agency_id: 'demo-001',
    payer_id: 'star-plus',
    status: 'draft',
    services_requested: [
      { service_type: 'Personal Attendant Services (PAS)', code: 'S5125', frequency: '18 hrs/week', duration_weeks: 52 },
    ],
    created_at: '2026-08-30T10:00:00Z',
  },
  {
    id: 'auth-demo-2',
    patient_id: 'pat-002',
    agency_id: 'demo-001',
    payer_id: 'uhc-texas',
    status: 'submitted',
    submitted_at: '2026-08-28T14:30:00Z',
    services_requested: [
      { service_type: 'Community Attendant (CAS)', code: 'S5125', frequency: '24 hrs/week', duration_weeks: 52 },
    ],
    created_at: '2026-08-28T09:00:00Z',
  },
  {
    id: 'auth-demo-3',
    patient_id: 'pat-003',
    agency_id: 'demo-001',
    payer_id: 'molina-texas',
    status: 'pending',
    submitted_at: '2026-08-25T11:15:00Z',
    services_requested: [
      { service_type: 'Day Activity (DAHS)', code: 'S5102', frequency: '30 hrs/week', duration_weeks: 52 },
    ],
    created_at: '2026-08-25T08:00:00Z',
  },
]

export const DEMO_ANALYTICS = {
  first_pass_approval_rate: 96.2,
  avg_days_to_approval: 2.4,
  total_pa_count: 47,
  hours_saved_this_month: 35.2,
  labor_dollars_saved: 880,
  revenue_protected: 19200,
}
