-- database/test-rls.sql
-- RLS Verification Script for AuthPilot

-- 1. Setup Test Data (Run as Superuser / Service Role)
BEGIN;

-- Create Agency A and Agency B
INSERT INTO public.agencies (id, name, npi, state)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Agency A (Austin)', '1234567890', 'TX'),
  ('22222222-2222-2222-2222-222222222222', 'Agency B (Dallas)', '0987654321', 'TX')
ON CONFLICT (id) DO NOTHING;

-- Create Patient for Agency B
INSERT INTO public.patients (id, agency_id, full_name, dob, medicaid_id, physician_npi, physician_name)
VALUES (
  '99999999-9999-9999-9999-999999999999',
  '22222222-2222-2222-2222-222222222222',
  'ENCRYPTED_NAME_DOE_JOHN',
  'ENCRYPTED_DOB_19800101',
  'ENCRYPTED_MEDICAID_123',
  '1122334455',
  'Dr. Smith'
) ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ----------------------------------------------------------------------
-- TEST 1: Cross-Agency Isolation Test
-- Set context to User from Agency A trying to read Agency B patients.
-- EXPECTED RESULT: 0 rows returned.
-- ----------------------------------------------------------------------
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';

-- Attempt to select patients belonging to Agency B
SELECT * FROM public.patients WHERE agency_id = '22222222-2222-2222-2222-222222222222';
ROLLBACK;


-- ----------------------------------------------------------------------
-- TEST 2: Audit Log Immutability Test
-- Attempt to DELETE a row from audit_log table.
-- EXPECTED RESULT: Error / Permission denied (0 rows affected or permission exception).
-- ----------------------------------------------------------------------
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';

-- Attempt to delete audit logs
DELETE FROM public.audit_log;
ROLLBACK;


-- ----------------------------------------------------------------------
-- TEST 3: Invalid Agency Insert Block Test
-- User from Agency A attempts to insert a patient into Agency B.
-- EXPECTED RESULT: Blocked by RLS WITH CHECK policy.
-- ----------------------------------------------------------------------
BEGIN;
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';

INSERT INTO public.patients (agency_id, full_name, dob, medicaid_id, physician_npi, physician_name)
VALUES (
  '22222222-2222-2222-2222-222222222222', -- Belongs to Agency B!
  'ENCRYPTED_ILLEGAL_INSERT',
  'ENCRYPTED_DOB',
  'ENCRYPTED_MEDICAID',
  '1234567890',
  'Dr. Attacker'
);
ROLLBACK;
