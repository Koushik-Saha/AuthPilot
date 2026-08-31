'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function PreSubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap Next.js 15+ async params
  const resolvedParams = React.use(params)
  const authId = resolvedParams.id

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  // Demo extracted state for coordinator pre-submission review
  const [extracted] = useState({
    patient_name: 'Maria Gonzalez',
    dob: '1954-06-12',
    medicaid_id: '9876543210',
    primary_icd10: 'M79.7',
    primary_icd10_desc: 'Fibromyalgia with severe polyarthralgia',
    physician_name: 'Dr. Robert Chen, MD',
    physician_npi: '1234567890',
    service_type: 'Personal Attendant Services (PAS)',
    requested_hours: '18 hours/week',
    homebound_status: true,
    homebound_reason: 'Patient requires 2-person assist and rolling walker for all ambulation. Leaving home requires taxing effort.',
    confidence_scores: {
      patient_name: 0.98,
      dob: 0.99,
      medicaid_id: 0.92,
      primary_icd10: 0.88,
      physician_npi: 0.90,
      service_type: 0.85,
      homebound_status: 0.95,
      homebound_reason: 0.65, // Yellow dot low confidence example
    },
    missing_fields: [] as string[],
  })

  const [justificationText, setJustificationText] = useState(
    `CLINICAL MEDICAL NECESSITY JUSTIFICATION

1. PATIENT CLINICAL PRESENTATION & PRIMARY DIAGNOSIS:
The member, Maria Gonzalez (DOB: 06/12/1954, Medicaid ID: 9876543210), is a 72-year-old female presenting with primary diagnosis M79.7 (Fibromyalgia with severe polyarthralgia) complicated by secondary osteoarthritis and essential hypertension. The primary diagnosis creates severe physical functional impairment affecting major daily activities.

2. LEVEL OF CARE (LOC) NURSING FACILITY DETERMINATION:
Member meets Nursing Facility Level of Care (LOC) criteria under Texas STAR+PLUS HCBS guidelines due to hands-on assistance requirements in 4 out of 5 core ADLs: bathing (M1810=3), dressing (M1820=2), transferring (M1830=2), and ambulation (M1860=3).

3. DANGERS OF NON-APPROVAL & PREVENTABLE MEDICAL RISKS:
Without 18 hours/week of personal attendant support, the member faces imminent risk of falls, medication non-adherence, skin breakdown, nutritional neglect, and emergency hospitalization leading to institutional nursing home placement.

4. PRESCRIBED SERVICE FREQUENCY & CARE PLAN RATIONALE:
Requested 18 hours per week of Personal Attendant Services (PAS, Procedure Code: S5125) are medically necessary and non-duplicative of community resources. Hours are scheduled across morning hygiene, meal preparation, and evening transfers.

5. PHYSICIAN ATTESTATION:
I attest that personal attendant services are medically necessary and prescribed per Texas Medicaid regulations.
Authorized by: Dr. Robert Chen, MD (NPI: 1234567890)`
  )

  const hasMissingRequired = extracted.missing_fields.length > 0

  const handleApprove = () => {
    if (hasMissingRequired) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsApproved(true)
    }, 1000)
  }

  const renderConfidenceDot = (score: number) => {
    if (score >= 0.8) {
      return (
        <span className="flex items-center text-xs font-semibold text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          {(score * 100).toFixed(0)}% (High)
        </span>
      )
    }
    if (score >= 0.6) {
      return (
        <span className="flex items-center text-xs font-semibold text-amber-400" title="We found this with low confidence — please verify before submitting">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5" />
          {(score * 100).toFixed(0)}% (Verify)
        </span>
      )
    }
    return (
      <span className="flex items-center text-xs font-semibold text-rose-400">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 mr-1.5" />
        {(score * 100).toFixed(0)}% (Low)
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6">
      {/* Top Navbar */}
      <header className="flex items-center justify-between pb-6 border-b border-[#1E3050] mb-6">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <span className="text-xs font-mono bg-[#0F2040] text-[#2DD4BF] border border-[#2DD4BF]/30 px-3 py-1 rounded-full">
            PA Packet Review #{authId.slice(0, 8)}
          </span>
        </div>

        {/* Time Saved Badge */}
        <div className="bg-[#0F2040] border border-[#2DD4BF]/40 rounded-xl px-4 py-2 flex items-center space-x-2">
          <span className="text-xl">⏱️</span>
          <div>
            <div className="text-xs text-[#8B98A8]">Time Saved</div>
            <div className="text-sm font-bold text-[#2DD4BF]">This would have taken ~45 minutes manually</div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (40%): Extraction Summary & Confidence */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Card */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Patient Summary</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F0F6FC]">{extracted.patient_name}</h3>
                <p className="text-xs text-[#8B98A8]">Medicaid ID: {extracted.medicaid_id} • DOB: {extracted.dob}</p>
              </div>
              <span className="bg-[#162035] border border-[#1E3050] text-[#34D399] text-xs font-semibold px-2.5 py-1 rounded-lg">
                TX STAR+PLUS
              </span>
            </div>
            <div className="text-xs text-[#8B98A8] pt-2 border-t border-[#1E3050]">
              <span className="font-semibold text-[#F0F6FC]">Primary ICD-10:</span> {extracted.primary_icd10} — {extracted.primary_icd10_desc}
            </div>
          </div>

          {/* Missing Fields Warning Box (if any) */}
          {hasMissingRequired && (
            <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center text-amber-400 font-bold text-sm">
                <span className="mr-2">⚠️</span> Missing Required Prior Authorization Fields
              </div>
              <p className="text-xs text-amber-200/80">
                The coordinator cannot submit this PA request until all mandatory Texas STAR+PLUS fields are resolved.
              </p>
              <ul className="text-xs text-amber-300 list-disc list-inside space-y-1">
                {extracted.missing_fields.map((f) => (
                  <li key={f}>{f} is missing. Please verify clinical documentation.</li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Fields List with Confidence Ratings */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Extracted Data Fields</h2>
              <span className="text-xs text-[#8B98A8]">Confidence Scores</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162035]">
                <span className="text-[#8B98A8]">Patient Name</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#F0F6FC] font-medium">{extracted.patient_name}</span>
                  {renderConfidenceDot(extracted.confidence_scores.patient_name)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162035]">
                <span className="text-[#8B98A8]">Medicaid ID</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#F0F6FC] font-medium">{extracted.medicaid_id}</span>
                  {renderConfidenceDot(extracted.confidence_scores.medicaid_id)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162035]">
                <span className="text-[#8B98A8]">Physician NPI</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#F0F6FC] font-medium">{extracted.physician_npi}</span>
                  {renderConfidenceDot(extracted.confidence_scores.physician_npi)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162035]">
                <span className="text-[#8B98A8]">Requested Service</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#F0F6FC] font-medium">{extracted.requested_hours}</span>
                  {renderConfidenceDot(extracted.confidence_scores.service_type)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#162035]">
                <span className="text-[#8B98A8]">Homebound Status</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[#F0F6FC] font-medium">{extracted.homebound_status ? 'Documented (YES)' : 'NO'}</span>
                  {renderConfidenceDot(extracted.confidence_scores.homebound_reason)}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Uploaded Clinical Documents</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#162035]">
                <span className="text-[#F0F6FC]">📄 test-oasis.txt</span>
                <span className="text-[#2DD4BF] font-mono text-[10px]">OASIS Assessment</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#162035]">
                <span className="text-[#F0F6FC]">📄 test-physician-orders.txt</span>
                <span className="text-[#2DD4BF] font-mono text-[10px]">CMS-485 Plan of Care</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#162035]">
                <span className="text-[#F0F6FC]">📄 test-clinical-notes.txt</span>
                <span className="text-[#2DD4BF] font-mono text-[10px]">Clinical Progress Note</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (60%): Generated Packet & Action Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Header & Preview Controls */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F0F6FC]">TX STAR+PLUS Prior Authorization Packet</h2>
              <p className="text-xs text-[#8B98A8]">Preview generated 4-page clinical packet</p>
            </div>
            <button
              onClick={() => alert('Downloading PA Packet PDF...')}
              className="bg-[#162035] hover:bg-[#2A4060] border border-[#2A4060] text-[#2DD4BF] text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              📥 Download PDF
            </button>
          </div>

          {/* Justification Narrative Textarea (Editable) */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">
                Medical Necessity Justification (500+ Words Clinical Narrative)
              </h2>
              <span className="text-[10px] text-[#2DD4BF] font-mono">Editable by Coordinator</span>
            </div>
            <textarea
              rows={14}
              value={justificationText}
              onChange={(e) => setJustificationText(e.target.value)}
              className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-xs text-[#F0F6FC] rounded-xl p-4 font-mono leading-relaxed focus:outline-none transition"
            />
          </div>

          {/* Submission Action Controls */}
          {isApproved ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 text-center space-y-2">
              <div className="text-emerald-400 font-bold text-lg">✓ Authorization Approved &amp; Marked Ready to Submit!</div>
              <p className="text-xs text-emerald-200/80">
                PA Packet has been queued for transmission via Texas STAR+PLUS Fax / TMHP Portal.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleApprove}
                disabled={hasMissingRequired || isSubmitting}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 ${
                  hasMissingRequired
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] shadow-lg shadow-[#2DD4BF]/20'
                }`}
              >
                {isSubmitting ? (
                  <span>Approving PA Packet...</span>
                ) : (
                  <span>Approve and Submit Request</span>
                )}
              </button>

              <Link
                href="/upload"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-semibold text-xs bg-[#162035] hover:bg-[#2A4060] text-[#8B98A8] border border-[#1E3050] text-center transition"
              >
                Request Corrections
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
