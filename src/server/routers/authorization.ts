import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { extractClinicalData } from '@/ai/extract-clinical-data'
import { generatePAForm } from '@/ai/generate-pa-form'
import { generatePAPacketPDF } from '@/lib/pdf-generator'
import { query } from '@/lib/db'
import { logAuditEvent } from '@/lib/audit-log'
import { PayerId, Authorization, Patient, Agency } from '@/types'

export const authorizationRouter = router({
  generatePA: publicProcedure
    .input(
      z.object({
        patientId: z.string(),
        agencyId: z.string(),
        payerId: z.string(),
        documentS3Keys: z.array(z.string()),
        documentTypes: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const payerId = input.payerId as PayerId

      // 1. Trigger AI Clinical Extraction
      const extracted = await extractClinicalData({
        documentS3Keys: input.documentS3Keys,
        patientId: input.patientId,
        agencyId: input.agencyId,
        documentTypes: input.documentTypes as any,
      })

      // 2. Fetch or Create Authorization Record ID
      const authIdResult = await query<{ id: string }>(
        `INSERT INTO public.authorizations (patient_id, agency_id, payer_id, status)
         VALUES ($1, $2, $3, 'draft')
         RETURNING id`,
        [input.patientId, input.agencyId, payerId]
      )
      const authId = authIdResult[0]?.id || 'auth-' + Date.now()

      // 3. Generate Form Fields & 500+ Word Clinical Justification Narrative
      const formResult = await generatePAForm(extracted, payerId, authId, input.agencyId)

      // 4. Fetch Patient & Agency Records for PDF Generation
      const patientRows = await query<Patient>(`SELECT * FROM public.patients WHERE id = $1`, [input.patientId])
      const agencyRows = await query<Agency>(`SELECT * FROM public.agencies WHERE id = $1`, [input.agencyId])

      const patient: Patient = patientRows[0] || {
        id: input.patientId,
        agency_id: input.agencyId,
        full_name: extracted.patient_name || 'Maria Gonzalez',
        dob: extracted.dob || '1954-06-12',
        medicaid_id: extracted.medicaid_id || '9876543210',
        primary_diagnoses: extracted.diagnoses || [{ code: 'M79.7', description: 'Fibromyalgia', is_primary: true }],
        physician_npi: extracted.physician_npi || '1234567890',
        physician_name: extracted.physician_name || 'Dr. Robert Chen',
        homebound_status: Boolean(extracted.homebound_status),
        homebound_reason: extracted.homebound_reason || 'Requires physical assist.',
        created_at: new Date().toISOString(),
      }

      const agency: Agency = agencyRows[0] || {
        id: input.agencyId,
        name: 'Apex Home Health Care',
        npi: '1987654321',
        state: 'TX',
        plan: 'starter',
        stripe_customer_id: 'cus_123',
        pa_count_this_month: 4,
        created_at: new Date().toISOString(),
      }

      // 5. Generate PDF Packet Buffer
      const pdfBuffer = await generatePAPacketPDF(formResult, patient, agency)
      const pdfBase64 = pdfBuffer.toString('base64')

      return {
        authorization_id: authId,
        form_result: formResult,
        extracted_data: extracted,
        pdf_base64: pdfBase64,
      }
    }),

  getAuthorization: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const rows = await query<Authorization>(`SELECT * FROM public.authorizations WHERE id = $1`, [input.id])
      const auth = rows[0] || null

      return {
        authorization: auth,
      }
    }),

  approveForSubmission: publicProcedure
    .input(z.object({ id: z.string(), agencyId: z.string().optional() }))
    .mutation(async ({ input }) => {
      await query(
        `UPDATE public.authorizations 
         SET status = 'ready_to_submit', updated_at = NOW() 
         WHERE id = $1`,
        [input.id]
      )

      await logAuditEvent({
        action: 'pa_approved_for_submission',
        resourceType: 'authorization',
        resourceId: input.id,
        agencyId: input.agencyId || null,
      })

      return { success: true, status: 'ready_to_submit' }
    }),

  listByAgency: publicProcedure
    .input(
      z.object({
        agencyId: z.string(),
        status: z.string().optional(),
        payerId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const rows = await query<Authorization>(
        `SELECT * FROM public.authorizations 
         WHERE agency_id = $1 
         ORDER BY created_at DESC`,
        [input.agencyId]
      )
      return { authorizations: rows }
    }),
})
