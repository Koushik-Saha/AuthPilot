-- Migration 005: Create authorizations table
CREATE TYPE pa_status AS ENUM ('draft', 'ready_to_submit', 'submitted', 'pending', 'approved', 'denied', 'appealed');
CREATE TYPE payer_id AS ENUM ('star-plus', 'uhc-texas', 'molina-texas', 'aetna-texas', 'humana-texas');

CREATE TABLE IF NOT EXISTS public.authorizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  payer_id payer_id NOT NULL,
  status pa_status NOT NULL DEFAULT 'draft',
  
  services_requested JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_form_s3_key TEXT,
  submitted_at TIMESTAMPTZ,
  payer_ref_number TEXT,
  auth_start_date DATE,
  auth_end_date DATE,
  denial_reason TEXT,
  appeal_letter_s3_key TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_authorizations_updated_at
  BEFORE UPDATE ON public.authorizations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.authorizations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Agency isolation. Coordinator and owner can create/edit. Viewer can only read.
CREATE POLICY authorizations_select ON public.authorizations
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id()
  );

CREATE POLICY authorizations_insert ON public.authorizations
  FOR INSERT
  WITH CHECK (
    agency_id = get_auth_agency_id() AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY authorizations_update ON public.authorizations
  FOR UPDATE
  USING (
    agency_id = get_auth_agency_id() AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('owner', 'coordinator')
    )
  );
