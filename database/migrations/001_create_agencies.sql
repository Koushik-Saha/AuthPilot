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

CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Agency members can only read/write their own agency row
CREATE POLICY agencies_read_own ON public.agencies
  FOR SELECT
  USING (
    id IN (
      SELECT agency_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY agencies_update_own ON public.agencies
  FOR UPDATE
  USING (
    id IN (
      SELECT agency_id FROM public.users WHERE id = auth.uid() AND role = 'owner'
    )
  );
