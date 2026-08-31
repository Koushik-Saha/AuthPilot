'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

interface DeniedAuthItem {
  id: string
  medicaid_last4: string
  payer_name: string
  denial_code: string
  denial_reason: string
  denied_at: string
  appeal_deadline_days: number
  appeal_generated: boolean
  overturn_rate: string
}

const INITIAL_DENIED_ITEMS: DeniedAuthItem[] = [
  {
    id: 'auth-105',
    medicaid_last4: '1044',
    payer_name: 'Aetna Better Health Texas',
    denial_code: 'A001',
    denial_reason: 'Not medically necessary / Insufficient clinical documentation of LOC',
    denied_at: '2026-08-25',
    appeal_deadline_days: 5, // Red urgency banner trigger!
    appeal_generated: false,
    overturn_rate: '85%',
  },
  {
    id: 'auth-109',
    medicaid_last4: '5512',
    payer_name: 'UnitedHealthcare Texas',
    denial_code: 'A002',
    denial_reason: 'Missing signed 485 Plan of Care within 60 days',
    denied_at: '2026-08-18',
    appeal_deadline_days: 22,
    appeal_generated: true,
    overturn_rate: '78%',
  },
]

export default function AppealsDashboardPage() {
  const [items, setItems] = useState<DeniedAuthItem[]>(INITIAL_DENIED_ITEMS)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const handleGenerateAppeal = (id: string) => {
    setGeneratingId(id)
    setTimeout(() => {
      setGeneratingId(null)
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, appeal_generated: true } : item))
      )
    }, 2000)
  }

  const handleResolve = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const urgentItems = items.filter((item) => item.appeal_deadline_days <= 7)

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 space-y-6">
      {/* Top Navbar */}
      <header className="flex items-center justify-between pb-6 border-b border-[#1E3050]">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
            AI Denial Appeals Center
          </span>
        </div>
        <Link href="/" className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
          ← Back to Main Pipeline
        </Link>
      </header>

      {/* Red Urgency Banner if Appeal Deadline <= 7 Days */}
      {urgentItems.length > 0 && (
        <div className="bg-rose-950/60 border border-rose-500 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚨</span>
            <div>
              <div className="text-sm font-bold text-rose-300">
                CRITICAL APPEAL DEADLINE WARNING ({urgentItems.length} Authorization)
              </div>
              <div className="text-xs text-rose-200/80">
                Member ending in ...{urgentItems[0].medicaid_last4} appeal deadline expires in {urgentItems[0].appeal_deadline_days} days! Payers mandate appeal submission within 60 days.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleGenerateAppeal(urgentItems[0].id)}
            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            ⚡ Immediate AI Appeal
          </button>
        </div>
      )}

      {/* Appeals List Table */}
      <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F0F6FC]">Denied Prior Authorizations ({items.length})</h2>
            <p className="text-xs text-[#8B98A8]">AI-powered clinical rebuttals with 80%+ overturn rate</p>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0A1628] border border-[#1E3050] rounded-xl p-5 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-[#F0F6FC]">Member ...{item.medicaid_last4}</span>
                  <span className="text-xs font-mono bg-[#162035] text-[#2DD4BF] px-2 py-0.5 rounded border border-[#1E3050]">
                    {item.payer_name}
                  </span>
                  <span className="text-xs font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                    Denial Code: {item.denial_code}
                  </span>
                </div>

                <p className="text-xs text-rose-300/90 font-mono">"{item.denial_reason}"</p>

                <div className="flex items-center space-x-4 text-[11px] text-[#8B98A8] pt-1">
                  <span>Denied: {item.denied_at}</span>
                  <span>•</span>
                  <span className={item.appeal_deadline_days <= 7 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                    Deadline: {item.appeal_deadline_days} days remaining
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400">Historical Overturn Rate: {item.overturn_rate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {item.appeal_generated ? (
                  <>
                    <button
                      onClick={() => alert('Downloading Generated Appeal PDF Letter...')}
                      className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/40 text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      📥 Download Appeal PDF
                    </button>
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-[#0A1628] text-xs font-bold px-3 py-2.5 rounded-xl transition"
                    >
                      ✓ Mark Resolved
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleGenerateAppeal(item.id)}
                    disabled={generatingId === item.id}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-rose-500/20 flex items-center space-x-2"
                  >
                    {generatingId === item.id ? (
                      <span>Generating Appeal...</span>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Generate Appeal Letter</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
