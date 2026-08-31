-- Migration 001: Create agencies table
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  npi TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'TX',
  plan TEXT CHECK (plan IN ('starter', 'growth', 'complete')) NOT NULL DEFAULT 'starter',
  stripe_customer_id TEXT,
  pa_count_this_month INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_agencies_updated_at ON public.agencies;
CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
