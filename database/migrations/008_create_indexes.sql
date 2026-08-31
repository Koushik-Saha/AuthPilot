-- Migration 008: Create indexes for performance optimization

-- Index for authorizations pipeline status per agency
CREATE INDEX IF NOT EXISTS idx_authorizations_agency_status
  ON public.authorizations(agency_id, status);

-- Index for deadline monitor & renewal triggers
CREATE INDEX IF NOT EXISTS idx_authorizations_end_date
  ON public.authorizations(auth_end_date);

-- Index for patient lookup by agency
CREATE INDEX IF NOT EXISTS idx_patients_agency
  ON public.patients(agency_id);

-- Index for document lookup by patient
CREATE INDEX IF NOT EXISTS idx_documents_patient
  ON public.documents(patient_id);

-- Index for audit log querying by agency and date
CREATE INDEX IF NOT EXISTS idx_audit_log_agency_created
  ON public.audit_log(agency_id, created_at DESC);
