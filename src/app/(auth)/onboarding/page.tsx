'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [agency, setAgency] = useState({
    name: 'Apex Home Health Care',
    npi: '1987654321',
    state: 'TX',
    phone: '(512) 555-0199',
    address: '4500 Medical Parkway, Suite 300, Austin, TX 78756',
  })

  const [user, setUser] = useState({
    fullName: 'Sarah Jenkins',
    title: 'Care Coordinator',
  })

  const [invites, setInvites] = useState<string[]>([''])

  const handleAddInvite = () => setInvites([...invites, ''])
  const handleInviteChange = (index: number, val: string) => {
    const updated = [...invites]
    updated[index] = val
    setInvites(updated)
  }

  const isNpiValid = /^[0-9]{10}$/.test(agency.npi)

  const handleComplete = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0F2040] border border-[#1E3050] rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E3050]">
          <Logo variant="full" size="sm" />
          <span className="text-xs font-mono text-[#2DD4BF] bg-[#0A1628] border border-[#2DD4BF]/30 px-3 py-1 rounded-full">
            Onboarding Step {step} of 3
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-[#0A1628] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2DD4BF] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: AGENCY DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#F0F6FC]">Step 1: Agency Profile</h2>
              <p className="text-xs text-[#8B98A8]">Enter your home health agency licensing information.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Agency Name</label>
                <input
                  type="text"
                  value={agency.name}
                  onChange={(e) => setAgency({ ...agency, name: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8B98A8] mb-1 font-medium">Agency NPI (10 Digits)</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={agency.npi}
                    onChange={(e) => setAgency({ ...agency, npi: e.target.value })}
                    className={`w-full bg-[#0A1628] border ${
                      isNpiValid ? 'border-[#1E3050] focus:border-[#2DD4BF]' : 'border-rose-500'
                    } text-[#F0F6FC] rounded-xl p-3 outline-none`}
                  />
                  {!isNpiValid && <p className="text-[10px] text-rose-400 mt-1">NPI must be exactly 10 numeric digits.</p>}
                </div>

                <div>
                  <label className="block text-[#8B98A8] mb-1 font-medium">State</label>
                  <input
                    type="text"
                    value={agency.state}
                    disabled
                    className="w-full bg-[#0A1628] border border-[#1E3050] text-[#8B98A8] rounded-xl p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Agency Phone</label>
                <input
                  type="text"
                  value={agency.phone}
                  onChange={(e) => setAgency({ ...agency, phone: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={!isNpiValid || !agency.name}
                onClick={() => setStep(2)}
                className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition"
              >
                Continue to Role Setup →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: USER ROLE */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#F0F6FC]">Step 2: Your Role</h2>
              <p className="text-xs text-[#8B98A8]">Identify your position at {agency.name}.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={user.fullName}
                  onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8B98A8] mb-1 font-medium">Position / Title</label>
                <select
                  value={user.title}
                  onChange={(e) => setUser({ ...user, title: e.target.value })}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                >
                  <option value="Care Coordinator">Care Coordinator</option>
                  <option value="Office Manager">Office Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Agency Owner">Agency Owner</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
                ← Back
              </button>
              <button
                disabled={!user.fullName}
                onClick={() => setStep(3)}
                className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition"
              >
                Continue to Team Invites →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INVITE TEAM */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#F0F6FC]">Step 3: Invite Your Care Team</h2>
              <p className="text-xs text-[#8B98A8]">Send passwordless magic link invites to colleagues.</p>
            </div>

            <div className="space-y-2 text-xs">
              {invites.map((email, idx) => (
                <input
                  key={idx}
                  type="email"
                  placeholder={`colleague${idx + 1}@${agency.name.toLowerCase().replace(/\s+/g, '')}.com`}
                  value={email}
                  onChange={(e) => handleInviteChange(idx, e.target.value)}
                  className="w-full bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl p-3 outline-none"
                />
              ))}

              <button
                type="button"
                onClick={handleAddInvite}
                className="text-xs text-[#2DD4BF] hover:underline font-semibold pt-1"
              >
                + Add another colleague
              </button>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button onClick={() => setStep(2)} className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition"
              >
                {isSubmitting ? 'Finalizing Setup...' : 'Complete Onboarding & Enter Dashboard →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
