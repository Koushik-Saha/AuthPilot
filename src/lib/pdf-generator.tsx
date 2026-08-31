import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { PAFormResult } from '@/ai/generate-pa-form'
import { Patient, Agency } from '@/types'

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#111827',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    transform: 'rotate(-30deg)',
    fontSize: 32,
    color: '#E5E7EB',
    opacity: 0.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#0F2040',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    color: '#0F2040',
  },
  headerSub: {
    fontSize: 9,
    color: '#4B5563',
  },
  logoText: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    color: '#0F2040',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: '#0F2040',
    backgroundColor: '#F3F4F6',
    padding: 4,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  gridTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  col: {
    width: '48%',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Times-Bold',
    width: 130,
    color: '#374151',
  },
  value: {
    flex: 1,
    color: '#111827',
  },
  box: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 6,
    fontSize: 8,
    color: '#6B7280',
  },
  confidentialBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    textAlign: 'center',
    color: '#991B1B',
    fontFamily: 'Times-Bold',
    fontSize: 9,
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#0F2040',
    marginRight: 8,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: 'Times-Bold',
  },
})

interface PacketProps {
  formResult: PAFormResult
  patient: Patient
  agency: Agency
}

/**
 * React-PDF Document Component for Texas STAR+PLUS Prior Authorization Packet
 */
export const TXStarPlusPAPacket: React.FC<PacketProps> = ({ formResult, patient, agency }) => {
  const fields = formResult.form_fields
  const generatedDate = new Date(formResult.generated_at).toLocaleDateString()

  return (
    <Document title={`PA_Packet_${fields.medicaid_id || patient.medicaid_id}`} author="AuthPilot AI">
      {/* PAGE 1 — COVER SHEET */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>DRAFT — Pending Coordinator Review</Text>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AuthPilot</Text>
            <Text style={styles.headerSub}>AI Prior Authorization Packet</Text>
          </View>
          <View>
            <Text style={styles.logoText}>PRIOR AUTHORIZATION PACKET</Text>
            <Text style={styles.headerSub}>Date Generated: {generatedDate}</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text>1. Request Summary</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Payer Name:</Text>
            <Text style={styles.value}>Texas STAR+PLUS Medicaid</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Service Category:</Text>
            <Text style={styles.value}>{fields.service_type || 'Personal Attendant Services (PAS)'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Procedure Code:</Text>
            <Text style={styles.value}>{fields.procedure_code || 'S5125'}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Requested Hours:</Text>
            <Text style={styles.value}>{fields.requested_hours_per_week || '18 hours/week'}</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text>2. Patient &amp; Agency Summary</Text>
        </View>
        <View style={styles.gridTwo}>
          <View style={styles.col}>
            <View style={styles.box}>
              <Text style={{ fontFamily: 'Times-Bold', marginBottom: 4 }}>Patient Information</Text>
              <Text>Name: {fields.member_name || patient.full_name}</Text>
              <Text>Medicaid ID: {fields.medicaid_id || patient.medicaid_id}</Text>
              <Text>DOB: {fields.dob || patient.dob}</Text>
            </View>
          </View>
          <View style={styles.col}>
            <View style={styles.box}>
              <Text style={{ fontFamily: 'Times-Bold', marginBottom: 4 }}>Submitting Agency</Text>
              <Text>Agency: {agency.name}</Text>
              <Text>NPI: {agency.npi}</Text>
              <Text>State: {agency.state}</Text>
            </View>
          </View>
        </View>

        <View style={styles.confidentialBanner}>
          <Text>CONFIDENTIAL — THIS DOCUMENT CONTAINS PROTECTED HEALTH INFORMATION (PHI)</Text>
          <Text style={{ fontSize: 8, marginTop: 2, fontFamily: 'Times-Roman' }}>
            Unauthorized disclosure or distribution is strictly prohibited under HIPAA Privacy Rule 45 CFR Part 160 &amp; 164.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>AuthPilot Prior Authorization AI System</Text>
          <Text>Page 1 of 4</Text>
        </View>
      </Page>

      {/* PAGE 2 — PRIOR AUTHORIZATION REQUEST FORM */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>DRAFT — Pending Coordinator Review</Text>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>TEXAS STAR+PLUS PA REQUEST FORM</Text>
          <Text style={styles.headerSub}>Form HHSC-STARPLUS-HCBS-01</Text>
        </View>

        <View style={styles.sectionTitle}>
          <Text>Section A: Member Information</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Member Name:</Text>
            <Text style={styles.value}>{fields.member_name}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Medicaid ID:</Text>
            <Text style={styles.value}>{fields.medicaid_id}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{fields.dob}</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text>Section B: Requesting Provider Information</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Provider Name:</Text>
            <Text style={styles.value}>{fields.requesting_provider_name}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Provider NPI:</Text>
            <Text style={styles.value}>{fields.requesting_npi}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Address / Phone:</Text>
            <Text style={styles.value}>
              {fields.requesting_provider_address} | {fields.requesting_provider_phone}
            </Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text>Section C: Requested Services &amp; Clinical Information</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Primary ICD-10 Code:</Text>
            <Text style={styles.value}>
              {fields.primary_icd10} — {fields.primary_icd10_description}
            </Text>
          </View>
          {fields.secondary_icd10 && fields.secondary_icd10.length > 0 && (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Secondary ICD-10 Codes:</Text>
              <Text style={styles.value}>{fields.secondary_icd10.join(', ')}</Text>
            </View>
          )}
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Requested Service:</Text>
            <Text style={styles.value}>{fields.service_type} ({fields.procedure_code})</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Prescribed Frequency:</Text>
            <Text style={styles.value}>{fields.requested_hours_per_week}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Authorization Episode:</Text>
            <Text style={styles.value}>
              {fields.start_date} to {fields.end_date}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Homebound Status:</Text>
            <Text style={styles.value}>
              {fields.homebound_status ? 'YES — Documented' : 'NO'}
            </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Homebound Rationale:</Text>
            <Text style={styles.value}>{fields.homebound_reason}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>OASIS Date:</Text>
            <Text style={styles.value}>{fields.oasis_assessment_date || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>AuthPilot Prior Authorization AI System</Text>
          <Text>Page 2 of 4</Text>
        </View>
      </Page>

      {/* PAGE 3 — MEDICAL NECESSITY JUSTIFICATION */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>DRAFT — Pending Coordinator Review</Text>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>CLINICAL MEDICAL NECESSITY JUSTIFICATION</Text>
          <Text style={styles.headerSub}>Texas STAR+PLUS Prior Authorization Narrative</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.paragraph}>{formResult.justification_text || fields.medical_necessity_justification}</Text>
        </View>

        <View style={{ marginTop: 30, borderTopWidth: 1, borderTopColor: '#9CA3AF', paddingTop: 10 }}>
          <Text style={{ fontFamily: 'Times-Bold', marginBottom: 4 }}>Physician Attestation &amp; Signature</Text>
          <Text style={{ fontSize: 9, marginBottom: 15 }}>
            I attest that the personal attendant / home health services requested above are medically necessary, appropriate for member care, and prescribed in accordance with Texas Medicaid guidelines.
          </Text>
          <Text style={{ fontFamily: 'Times-Bold' }}>Authorized by: {fields.requesting_provider_name}</Text>
          <Text>Physician NPI: {fields.requesting_npi}</Text>
          <Text>Signature Date: {fields.physician_signature_date || generatedDate}</Text>
        </View>

        <View style={styles.footer}>
          <Text>AuthPilot Prior Authorization AI System</Text>
          <Text>Page 3 of 4</Text>
        </View>
      </Page>

      {/* PAGE 4 — SUPPORTING DOCUMENTATION CHECKLIST */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>DRAFT — Pending Coordinator Review</Text>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>SUPPORTING DOCUMENTATION CHECKLIST</Text>
          <Text style={styles.headerSub}>Texas STAR+PLUS Mandatory Document Verification</Text>
        </View>

        <View style={styles.sectionTitle}>
          <Text>Required Submission Enclosures</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkbox}>X</Text>
            <Text style={{ flex: 1 }}>
              OASIS Assessment Form (Completed Date: {fields.oasis_assessment_date || generatedDate})
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkbox}>X</Text>
            <Text style={{ flex: 1 }}>
              Physician Plan of Care Form CMS-485 (Signed Date: {fields.physician_signature_date || generatedDate})
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkbox}>X</Text>
            <Text style={{ flex: 1 }}>
              Clinical Progress Notes &amp; Face-to-Face Encounter Summary
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkbox}>X</Text>
            <Text style={{ flex: 1 }}>
              Nursing Facility Level of Care (LOC) Assessment Determination
            </Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text>Submission Instructions</Text>
        </View>
        <Text style={styles.paragraph}>
          Transmit this completed Prior Authorization Packet via primary payer fax (800-252-8263) or online via TMHP Portal.
        </Text>

        <View style={styles.footer}>
          <Text>AuthPilot Prior Authorization AI System</Text>
          <Text>Page 4 of 4</Text>
        </View>
      </Page>
    </Document>
  )
}

/**
 * Generates the complete PA Packet PDF as a Node Buffer using @react-pdf/renderer.
 */
export async function generatePAPacketPDF(
  formResult: PAFormResult,
  patient: Patient,
  agency: Agency
): Promise<Buffer> {
  const element = <TXStarPlusPAPacket formResult={formResult} patient={patient} agency={agency} />
  const buffer = await pdf(element).toBuffer()
  return buffer as unknown as Buffer
}

interface AppealPDFProps {
  appealText: string
  patient: Patient
  agency: Agency
}

export const AppealLetterPDFComponent: React.FC<AppealPDFProps> = ({ appealText, patient, agency }) => (
  <Document title={`Appeal_Letter_${patient.medicaid_id}`} author="AuthPilot AI Appeals Engine">
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>FORMAL PRIOR AUTHORIZATION APPEAL</Text>
          <Text style={styles.headerSub}>Texas Medicaid Managed Care Denial Rebuttal</Text>
        </View>
        <View>
          <Text style={styles.logoText}>AuthPilot AI</Text>
          <Text style={styles.headerSub}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={styles.paragraph}>{appealText}</Text>
      </View>

      <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#0F2040', paddingTop: 8 }}>
        <Text style={{ fontFamily: 'Times-Bold' }}>Submitted By: {agency.name}</Text>
        <Text>Provider NPI: {agency.npi}</Text>
        <Text>State: {agency.state}</Text>
      </View>

      <View style={styles.footer}>
        <Text>AuthPilot Automated Healthcare Appeal Engine</Text>
        <Text>Page 1 of 1</Text>
      </View>
    </Page>
  </Document>
)

export async function generateAppealPDF(
  appealText: string,
  patient: Patient,
  agency: Agency
): Promise<Buffer> {
  const element = <AppealLetterPDFComponent appealText={appealText} patient={patient} agency={agency} />
  const buffer = await pdf(element).toBuffer()
  return buffer as unknown as Buffer
}

