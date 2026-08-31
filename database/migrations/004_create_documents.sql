-- Migration 004: Create documents table
CREATE TYPE document_type AS ENUM ('oasis', 'physician_orders', 'clinical_notes', 'denial_letter', 'care_plan');

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  
  -- Encrypted S3 storage key
  s3_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  
  -- AI extracted data & confidence metadata
  extracted_data JSONB,
  confidence_scores JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Agency isolation for documents
CREATE POLICY documents_agency_isolation_select ON public.documents
  FOR SELECT
  USING (
    agency_id = get_auth_agency_id()
  );

CREATE POLICY documents_agency_isolation_insert ON public.documents
  FOR INSERT
  WITH CHECK (
    agency_id = get_auth_agency_id()
  );

CREATE POLICY documents_agency_isolation_update ON public.documents
  FOR UPDATE
  USING (
    agency_id = get_auth_agency_id()
  );

-- Audit Trigger on Document Access (SELECT)
CREATE OR REPLACE FUNCTION audit_document_read()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (agency_id, user_id, action, resource_type, resource_id)
  VALUES (
    NEW.agency_id,
    auth.uid(),
    'DOCUMENT_READ',
    'document',
    NEW.id::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
