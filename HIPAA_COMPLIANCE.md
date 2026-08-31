# AuthPilot HIPAA Compliance & Data Security Architecture

> **Notice**: This document outlines the administrative, physical, and technical safeguards implemented in AuthPilot to ensure compliance with the Health Insurance Portability and Accountability Act (HIPAA) Privacy and Security Rules (45 CFR Parts 160 and 164).

---

## 1. Protected Health Information (PHI) Inventory

AuthPilot processes only the minimal necessary PHI required for home health prior authorization requests under Texas Medicaid and Managed Care programs:

| PHI Field | Clinical Purpose | Storage Location | Encryption at Rest |
| :--- | :--- | :--- | :--- |
| **Patient Legal Name** | Form HHSC-STARPLUS-HCBS-01 | Neon PostgreSQL | AES-256 / pgcrypto |
| **Date of Birth (DOB)** | Payer Member Identification | Neon PostgreSQL | AES-256 / pgcrypto |
| **Medicaid Member ID** | State Eligibility Verification | Neon PostgreSQL | AES-256 / pgcrypto |
| **Medicare HICN / MBI** | Dual-Eligible Coordination | Neon PostgreSQL | AES-256 / pgcrypto |
| **ICD-10 Diagnoses** | Primary & Secondary Medical Need | Neon PostgreSQL | Standard DB Column |
| **ADL / IADL Limitations** | Nursing Facility LOC Proof | Neon PostgreSQL | JSONB Clinical Data |
| **OASIS Assessment Data** | Clinical Proof Enclosure | AWS S3 Bucket | AWS KMS (SSE-KMS) |
| **Physician CMS-485 Plan** | Prescription Order Enclosure | AWS S3 Bucket | AWS KMS (SSE-KMS) |
| **Physician NPI & Name** | Requesting Provider Attestation | Neon PostgreSQL | Standard DB Column |

---

## 2. Technical Safeguards & Data Protection

### 2.1 Encryption Standards
- **Data in Transit**: All data transmitted between client browsers, Next.js application servers, Neon PostgreSQL, and third-party APIs (Claude API, Twilio, AWS S3) is encrypted using **TLS 1.3** / HTTPS. Unencrypted HTTP traffic is automatically rejected.
- **Data at Rest**:
  - **Database**: Database storage is encrypted at rest using industry-standard **AES-256**. Application-level encryption is applied to PII/PHI columns.
  - **S3 Document Storage**: AWS S3 buckets enforce Server-Side Encryption with AWS Key Management Service (**SSE-KMS**). Unencrypted object uploads are denied via bucket policy.

### 2.2 Strict Access Control & Multi-Tenant Isolation
- **Row-Level Security (RLS)**: Database tables enforce strict multi-tenant isolation. Queries automatically scope data access to the user's authenticated `agency_id`. Users from Agency A can never read or mutate records belonging to Agency B.
- **S3 Presigned URLs**: Documents uploaded to S3 are private and inaccessible publicly. Temporary access for document preview or transmission is granted via short-lived presigned URLs expiring in **10 minutes**.

### 2.3 Email & Webhook Privacy Rules
- **ZERO PHI IN EMAIL BODIES**: Automated email notifications (via Mailtrap / Resend) never contain patient names, diagnosis descriptions, or Medicaid IDs. Notifications state only generic action reminders (e.g., *"Action Required: Authorization expiring in 15 days"*) and direct the coordinator to log into the authenticated dashboard.
- **Sanitized System Logs**: Console logs and application error tracebacks are strictly sanitized to prevent accidental leakage of PHI. Debug logs record system event IDs and UUIDs only.

---

## 3. Immutable HIPAA Audit Logging

Every read, creation, modification, and transmission of PHI triggers an automatic entry in the immutable `public.audit_log` table:

```sql
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,         -- e.g. 'document_extracted', 'pa_submitted', 'pa_form_generated'
  resource_type TEXT NOT NULL,  -- e.g. 'authorization', 'patient', 'document'
  resource_id TEXT,             -- Target record UUID
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

- **Logged Actions**: `document_uploaded`, `document_extracted`, `pa_form_generated`, `pa_submitted`, `appeal_letter_generated`, `pa_approved_for_submission`.
- **Retention**: Audit logs are retained for a minimum of 6 years per 45 CFR § 164.316(b)(2).

---

## 4. Business Associate Agreement (BAA) Status

AuthPilot maintains executed Business Associate Agreements (BAAs) with all sub-processors that transmit or store PHI:

- **Anthropic PBC** (AI Clinical Extraction & Narrative Engine): BAA Executed (Zero-data retention model for HIPAA endpoints).
- **Amazon Web Services (AWS)** (S3 Document Storage): AWS BAA Executed.
- **Twilio Inc.** (Fax Transmission): Twilio HIPAA BAA Executed.
- **Neon Inc.** (PostgreSQL Database): Neon HIPAA Security Addendum Executed.

---

*Last Updated: August 31, 2026 | AuthPilot Information Security Team*
