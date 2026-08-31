-- Migration 007: Create immutable audit_log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Agency members can view audit logs for their agency
CREATE POLICY audit_log_select ON public.audit_log
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id() OR current_setting('app.current_agency_id', true) IS NULL
  );

-- INSERT allowed for authenticated users / server actions
CREATE POLICY audit_log_insert ON public.audit_log
  FOR INSERT
  WITH CHECK (true);

-- IMMUTABILITY GUARANTEE:
-- Intentionally NO UPDATE or DELETE policies created for audit_log table.
