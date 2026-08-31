-- Migration 002: Create users table extending auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'coordinator', 'viewer')) NOT NULL DEFAULT 'coordinator',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helper function to get current user's agency_id
CREATE OR REPLACE FUNCTION get_auth_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable Row-Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see users in their own agency
CREATE POLICY users_select_same_agency ON public.users
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id()
  );

CREATE POLICY users_update_self ON public.users
  FOR UPDATE
  USING (
    id = auth.uid()
  );
