-- Migration 006: Create submissions table
CREATE TYPE submission_channel AS ENUM ('fax', 'portal', 'fhir', 'email');
CREATE TYPE submission_status AS ENUM ('queued', 'sending', 'sent', 'failed', 'confirmed');

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES public.authorizations(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  channel submission_channel NOT NULL,
  status submission_status NOT NULL DEFAULT 'queued',
  
  attempt_count INTEGER NOT NULL DEFAULT 1,
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  confirmation_ref TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Read-only for agency members (coordinators, owners, viewers). No direct client write allowed.
CREATE POLICY submissions_select ON public.submissions
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id()
  );

-- Direct client INSERT, UPDATE, DELETE are intentionally BLOCKED.
-- Submissions can only be written by background jobs / server actions via service role (supabaseAdmin).
