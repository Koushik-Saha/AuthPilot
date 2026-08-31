import fs from 'fs'
import path from 'path'
import {
  normalizeICD10,
  normalizeDate,
  extractClinicalData,
} from '../extract-clinical-data'
import { validateCompleteness } from '../validate-completeness'
import { ExtractedClinicalData } from '@/types'

describe('AI Extraction & Completeness Pipeline', () => {
  describe('Helper Functions & Post-Processing', () => {
    test('normalizeICD10 formats unformatted lowercase codes correctly', () => {
      expect(normalizeICD10('m7940')).toBe('M79.40')
      expect(normalizeICD10('m79.7')).toBe('M79.7')
      expect(normalizeICD10('i10')).toBe('I10')
      expect(normalizeICD10('e119')).toBe('E11.9')
    })

    test('normalizeDate converts dates to ISO YYYY-MM-DD format', () => {
      expect(normalizeDate('06/12/1954')).toBe('1954-06-12')
      expect(normalizeDate('2026-08-15')).toBe('2026-08-15')
      expect(normalizeDate(null)).toBeNull()
    })
  })

  describe('Completeness Validation Logic', () => {
    test('validateCompleteness flags missing required fields', () => {
      const incompleteData: ExtractedClinicalData = {
        patient_name: 'Maria Gonzalez',
        homebound_status: true,
        confidence_scores: { patient_name: 0.95 },
        missing_fields: ['medicaid_id', 'primary_icd10'],
        raw_extraction_notes: 'Missing Medicaid ID and diagnosis',
      }

      const result = validateCompleteness(incompleteData, 'star-plus')
      expect(result.is_complete).toBe(false)
      expect(result.missing_required).toContain('medicaid_id')
      expect(result.missing_required).toContain('primary_icd10')
      expect(result.warnings.length).toBeGreaterThan(0)
    })

    test('validateCompleteness passes for complete high-confidence data', () => {
      const completeData: ExtractedClinicalData = {
        patient_name: 'Maria Gonzalez',
        dob: '1954-06-12',
        medicaid_id: '9876543210',
        physician_name: 'Dr. Robert Chen, MD',
        physician_npi: '1234567890',
        homebound_status: true,
        homebound_reason: 'Patient requires 2-person assist for ambulation.',
        care_start_date: '2026-08-20',
        care_end_date: '2027-08-19',
        diagnoses: [{ code: 'M79.7', description: 'Fibromyalgia', is_primary: true }],
        requested_services: [
          { service_type: 'Personal Attendant Services (PAS)', code: 'S5125', frequency: '18 hrs/week', duration_weeks: 52 },
        ],
        functional_limitations: ['Bathing', 'Dressing', 'Ambulation'],
        confidence_scores: {
          patient_name: 0.95,
          dob: 0.99,
          medicaid_id: 0.95,
          physician_npi: 0.90,
          homebound_status: 0.95,
          care_start_date: 0.90,
        },
        missing_fields: [],
        raw_extraction_notes: 'Full extraction complete',
      }

      const result = validateCompleteness(completeData, 'star-plus')
      expect(result.is_complete).toBe(true)
      expect(result.missing_required.length).toBe(0)
    })
  })

  describe('Integration Extraction Test (@integration)', () => {
    test('Extracts clinical data from 3 fixture documents via Claude API', async () => {
      const oasisText = fs.readFileSync(path.join(__dirname, '../../../tests/fixtures/test-oasis.txt'), 'utf8')
      const ordersText = fs.readFileSync(path.join(__dirname, '../../../tests/fixtures/test-physician-orders.txt'), 'utf8')
      const notesText = fs.readFileSync(path.join(__dirname, '../../../tests/fixtures/test-clinical-notes.txt'), 'utf8')

      const result = await extractClinicalData({
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

      expect(result).toBeDefined()
      expect(result.patient_name).toBeDefined()
      expect(result.patient_name?.toLowerCase()).toContain('gonzalez')
      expect(result.medicaid_id).toBe('9876543210')
      expect(result.diagnoses).toBeDefined()
      expect(result.diagnoses!.length).toBeGreaterThan(0)
      expect(result.physician_npi).toBe('1234567890')
      expect(result.homebound_status).toBe(true)
      expect(result.confidence_scores).toBeDefined()
      expect(Array.isArray(result.missing_fields)).toBe(true)
    }, 35000)
  })
})
