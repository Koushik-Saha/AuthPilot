-- Migration 004: Create documents table
DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('oasis', 'physician_orders', 'clinical_notes', 'denial_letter', 'care_plan');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable Row-Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
