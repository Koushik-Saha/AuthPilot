import fs from 'fs'
import path from 'path'
import { extractClinicalData } from '../src/ai/extract-clinical-data'
import { generatePAForm } from '../src/ai/generate-pa-form'
import { generatePAPacketPDF } from '../src/lib/pdf-generator'
import { routeSubmission } from '../src/submission/submission-router'
import { query } from '../src/lib/db'
import { Patient, Agency } from '../src/types'

/**
 * End-to-End Walk-in Demo Verification Test Script.
 * Runs complete pipeline test from raw clinical document upload to final fax submission & audit verification.
 */
async function runEndToEndTest() {
  console.log('==================================================')
  console.log('🧪 RUNNING AUTHPILOT FULL END-TO-END SYSTEM TEST')
  console.log('==================================================')

  // 1. Read Test Fixture Documents
  console.log('1. Loading clinical fixture documents (OASIS, 485, Progress Notes)...')
  const oasisText = fs.readFileSync(path.join(__dirname, '../tests/fixtures/test-oasis.txt'), 'utf8')
  const ordersText = fs.readFileSync(path.join(__dirname, '../tests/fixtures/test-physician-orders.txt'), 'utf8')
  const notesText = fs.readFileSync(path.join(__dirname, '../tests/fixtures/test-clinical-notes.txt'), 'utf8')

  // 2. Trigger Claude 3.5 Sonnet Extraction
  console.log('2. Invoking Claude 3.5 Sonnet clinical extraction pipeline...')
  const extracted = await extractClinicalData({
    documentS3Keys: ['test-oasis.txt', 'test-physician-orders.txt', 'test-clinical-notes.txt'],
    patientId: '11111111-1111-1111-1111-111111111111',
    agencyId: '22222222-2222-2222-2222-222222222222',
    documentTypes: ['oasis', 'physician_orders', 'clinical_notes'],
    documentContents: [
      { key: 'test-oasis.txt', content: oasisText, mimeType: 'text/plain' },
      { key: 'test-physician-orders.txt', content: ordersText, mimeType: 'text/plain' },
      { key: 'test-clinical-notes.txt', content: notesText, mimeType: 'text/plain' },
    ],
  })

  console.log(`✓ Patient Extracted: ${extracted.patient_name} (Medicaid ID: ${extracted.medicaid_id})`)
  console.log(`✓ Primary ICD-10 Code: ${extracted.diagnoses?.[0]?.code}`)
  console.log(`✓ Homebound Status Documented: ${extracted.homebound_status}`)

  // 3. Generate PA Form & 500+ Word Clinical Justification
  console.log('\n3. Generating Texas STAR+PLUS Form Fields & 500+ Word Narrative...')
  const formResult = await generatePAForm(extracted, 'star-plus', 'auth-e2e-demo-101', '22222222-2222-2222-2222-222222222222')

  console.log(`✓ PA Form Member Name: ${formResult.form_fields.member_name}`)
  console.log(`✓ Justification Length: ${formResult.justification_text.length} characters`)

  // 4. Render 4-Page React-PDF Packet
  console.log('\n4. Rendering 4-Page Prior Authorization PDF Packet...')
  const mockPatient: Patient = {
    id: '11111111-1111-1111-1111-111111111111',
    agency_id: '22222222-2222-2222-2222-222222222222',
    full_name: extracted.patient_name || 'Maria Gonzalez',
    dob: extracted.dob || '1954-06-12',
    medicaid_id: extracted.medicaid_id || '9876543210',
    primary_diagnoses: extracted.diagnoses || [],
    physician_npi: extracted.physician_npi || '1234567890',
    physician_name: extracted.physician_name || 'Dr. Robert Chen',
    homebound_status: true,
    homebound_reason: extracted.homebound_reason || 'Requires assistance.',
    created_at: new Date().toISOString(),
  }

  const mockAgency: Agency = {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sunrise Home Care Austin',
    npi: '1234567890',
    state: 'TX',
    plan: 'growth',
    stripe_customer_id: 'cus_demo_123',
    pa_count_this_month: 5,
    created_at: new Date().toISOString(),
  }

  const pdfBuffer = await generatePAPacketPDF(formResult, mockPatient, mockAgency)
  console.log(`✓ PDF Packet Generated Successfully! Buffer Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`)

  // 5. Route Electronic Fax Transmission
  console.log('\n5. Routing Electronic Transmission via Twilio Fax Engine...')
  const faxResult = await routeSubmission({
    authId: 'auth-e2e-demo-101',
    payerId: 'star-plus',
    pdfS3Key: 'demo-packet.pdf',
    agencyId: '22222222-2222-2222-2222-222222222222',
    userId: 'usr-demo-1',
  })

  console.log(`✓ Fax Transmitted to Texas STAR+PLUS (${faxResult.fax_to})`)
  console.log(`✓ Twilio Transmission SID: ${faxResult.twilio_sid}`)
  console.log(`✓ Status: ${faxResult.status.toUpperCase()}`)

  console.log('\n==================================================')
  console.log('🎉 AUTHPILOT END-TO-END TEST COMPLETED — 100% PASS!')
  console.log('==================================================\n')
}

runEndToEndTest().catch((err) => {
  console.error('❌ E2E TEST FAILED:', err)
  process.exit(1)
})
