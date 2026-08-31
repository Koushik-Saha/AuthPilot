-- Migration 003: Create patients table
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  
  -- Encrypted PHI / PII columns (Application-level pgcrypto AES-256)
  full_name TEXT NOT NULL,          -- Encrypted string
  dob TEXT NOT NULL,                -- Encrypted string
  medicaid_id TEXT NOT NULL,        -- Encrypted string
  medicare_id TEXT,                 -- Encrypted string
  ssn_last4 TEXT,                   -- Encrypted string
  
  -- Clinical & Demographic Information
  primary_diagnoses JSONB NOT NULL DEFAULT '[]'::jsonb,
  physician_npi TEXT NOT NULL,
  physician_name TEXT NOT NULL,
  homebound_status BOOLEAN NOT NULL DEFAULT false,
  homebound_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
