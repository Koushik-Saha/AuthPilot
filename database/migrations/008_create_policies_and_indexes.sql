-- Migration 008: Create RLS policies, audit triggers, and performance indexes

-- ==============================================================================
-- RLS POLICIES
-- ==============================================================================

-- Agencies Policies
DROP POLICY IF EXISTS agencies_read_own ON public.agencies;
CREATE POLICY agencies_read_own ON public.agencies
  FOR SELECT
  USING (
    id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS agencies_update_own ON public.agencies;
CREATE POLICY agencies_update_own ON public.agencies
  FOR UPDATE
  USING (
    id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- Users Policies
DROP POLICY IF EXISTS users_select_same_agency ON public.users;
CREATE POLICY users_select_same_agency ON public.users
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS users_update_self ON public.users;
CREATE POLICY users_update_self ON public.users
  FOR UPDATE
  USING (
    id::text = current_setting('app.current_user_id', true) OR current_setting('app.current_user_id', true) IS NULL
  );

-- Patients Policies
DROP POLICY IF EXISTS patients_agency_isolation_select ON public.patients;
CREATE POLICY patients_agency_isolation_select ON public.patients
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS patients_agency_isolation_insert ON public.patients;
CREATE POLICY patients_agency_isolation_insert ON public.patients
  FOR INSERT
  WITH CHECK (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS patients_agency_isolation_update ON public.patients;
CREATE POLICY patients_agency_isolation_update ON public.patients
  FOR UPDATE
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS patients_agency_isolation_delete ON public.patients;
CREATE POLICY patients_agency_isolation_delete ON public.patients
  FOR DELETE
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- Documents Policies
DROP POLICY IF EXISTS documents_agency_isolation_select ON public.documents;
CREATE POLICY documents_agency_isolation_select ON public.documents
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS documents_agency_isolation_insert ON public.documents;
CREATE POLICY documents_agency_isolation_insert ON public.documents
  FOR INSERT
  WITH CHECK (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS documents_agency_isolation_update ON public.documents;
CREATE POLICY documents_agency_isolation_update ON public.documents
  FOR UPDATE
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- Authorizations Policies
DROP POLICY IF EXISTS authorizations_select ON public.authorizations;
CREATE POLICY authorizations_select ON public.authorizations
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS authorizations_insert ON public.authorizations;
CREATE POLICY authorizations_insert ON public.authorizations
  FOR INSERT
  WITH CHECK (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS authorizations_update ON public.authorizations;
CREATE POLICY authorizations_update ON public.authorizations
  FOR UPDATE
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- Submissions Policies
DROP POLICY IF EXISTS submissions_select ON public.submissions;
CREATE POLICY submissions_select ON public.submissions
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- Audit Log Policies
DROP POLICY IF EXISTS audit_log_select ON public.audit_log;
CREATE POLICY audit_log_select ON public.audit_log
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

DROP POLICY IF EXISTS audit_log_insert ON public.audit_log;
CREATE POLICY audit_log_insert ON public.audit_log
  FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_authorizations_agency_status
  ON public.authorizations(agency_id, status);

CREATE INDEX IF NOT EXISTS idx_authorizations_end_date
  ON public.authorizations(auth_end_date);

CREATE INDEX IF NOT EXISTS idx_patients_agency
  ON public.patients(agency_id);

CREATE INDEX IF NOT EXISTS idx_documents_patient
  ON public.documents(patient_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_agency_created
  ON public.audit_log(agency_id, created_at DESC);
