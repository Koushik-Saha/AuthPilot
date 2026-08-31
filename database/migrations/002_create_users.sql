-- Migration 002: Create users table for Neon PostgreSQL
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'coordinator', 'viewer')) NOT NULL DEFAULT 'coordinator',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Helper function to get current user's agency_id from session configuration
CREATE OR REPLACE FUNCTION get_auth_agency_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_agency_id', true), '')::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable Row-Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
