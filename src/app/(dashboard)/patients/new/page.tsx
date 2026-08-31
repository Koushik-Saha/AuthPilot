'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function NewAuthorizationPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isExtracting, setIsExtracting] = useState(false)

  const [patient, setPatient] = useState({
    fullName: 'Maria Gonzalez',
    dob: '1954-06-12',
    medicaidId: '9876543210',
    payerId: 'star-plus',
  })

  const [files, setFiles] = useState<File[]>([])

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleStartExtraction = () => {
    setIsExtracting(true)
    setTimeout(() => {
      setIsExtracting(false)
      router.push('/authorizations/demo-auth-101/review')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#1E3050]">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <span className="text-xs text-[#8B98A8]">New Prior Authorization Wizard</span>
        </div>
        <Link href="/" className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
          ← Back to Dashboard
        </Link>
      </header>

      {/* Stepper Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl border text-xs font-semibold text-center ${step === 1 ? 'bg-[#0F2040] border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#0D1B2E] border-[#1E3050] text-[#6B7280]'}`}>
          1. Patient &amp; Payer
        </div>
        <div className={`p-3 rounded-xl border text-xs font-semibold text-center ${step === 2 ? 'bg-[#0F2040] border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#0D1B2E] border-[#1E3050] text-[#6B7280]'}`}>
          2. Clinical Documents
        </div>
        <div className={`p-3 rounded-xl border text-xs font-semibold text-center ${step === 3 ? 'bg-[#0F2040] border-[#2DD4BF] text-[#2DD4BF]' : 'bg-[#0D1B2E] border-[#1E3050] text-[#6B7280]'}`}>
          3. AI Extraction
        </div>
      </div>

      {/* STEP 1: PATIENT & PAYER SELECTION */}
      {step === 1 && (
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#F0F6FC]">Step 1: Patient Demographics &amp; Payer</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8B98A8] mb-1 font-medium">Patient Full Name</label>
              <input
                type="text"
                value={patient.fullName}
                onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={patient.dob}
                  onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Medicaid Member ID</label>
                <input
                  type="text"
                  value={patient.medicaidId}
                  onChange={(e) => setPatient({ ...patient, medicaidId: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8B98A8] mb-1 font-medium">Target Managed Care Payer</label>
              <select
                value={patient.payerId}
                onChange={(e) => setPatient({ ...patient, payerId: e.target.value })}
                className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
              >
                <option value="star-plus">Texas STAR+PLUS Medicaid (Primary)</option>
                <option value="uhc-texas">UnitedHealthcare Texas Medicaid</option>
                <option value="molina-texas">Molina Healthcare Texas</option>
                <option value="aetna-texas">Aetna Better Health Texas</option>
                <option value="humana-texas">Humana Healthy Horizons Texas</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition"
            >
              Continue to Document Upload →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MULTI-FILE UPLOAD */}
      {step === 2 && (
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#F0F6FC]">Step 2: Upload Clinical Documents</h2>
          <p className="text-xs text-[#8B98A8]">Upload OASIS assessment, physician CMS-485 Plan of Care, and progress notes.</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#2DD4BF]/40 bg-[#0A1628] rounded-2xl p-8 text-center space-y-3 cursor-pointer hover:border-[#2DD4BF] transition"
          >
            <div className="text-3xl">📁</div>
            <div className="text-sm font-semibold text-[#F0F6FC]">Drag &amp; drop clinical files here</div>
            <div className="text-xs text-[#8B98A8]">Supports PDF, OASIS text, CMS-485 orders up to 25MB</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#8B98A8] uppercase">Selected Enclosures (3)</div>
            <div className="space-y-1.5 text-xs">
              <div className="bg-[#162035] p-2.5 rounded-lg flex items-center justify-between">
                <span>📄 test-oasis.txt (OASIS Assessment)</span>
                <span className="text-emerald-400 font-bold">✓ Ready</span>
              </div>
              <div className="bg-[#162035] p-2.5 rounded-lg flex items-center justify-between">
                <span>📄 test-physician-orders.txt (CMS-485 Order)</span>
                <span className="text-emerald-400 font-bold">✓ Ready</span>
              </div>
              <div className="bg-[#162035] p-2.5 rounded-lg flex items-center justify-between">
                <span>📄 test-clinical-notes.txt (Face-to-Face)</span>
                <span className="text-emerald-400 font-bold">✓ Ready</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
              ← Back
            </button>
            <button
              onClick={() => {
                setStep(3)
                handleStartExtraction()
              }}
              className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition"
            >
              Start AI Clinical Extraction →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI EXTRACTION IN PROGRESS */}
      {step === 3 && (
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border-4 border-[#2DD4BF] border-t-transparent animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#F0F6FC]">Claude AI Extracting Clinical Fields...</h2>
            <p className="text-xs text-[#8B98A8]">
              Analyzing OASIS, CMS-485 orders, ICD-10 diagnosis codes, and calculating confidence scores.
            </p>
          </div>
          <div className="text-xs font-mono text-[#2DD4BF]">Redirecting to Coordinator Review Screen...</div>
        </div>
      )}
    </div>
  )
}
