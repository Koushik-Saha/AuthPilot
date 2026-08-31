'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

interface AuthorizationCard {
  id: string
  medicaid_last4: string
  service_type: string
  payer_id: string
  payer_name: string
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'denied'
  days_in_status: number
  start_date: string
  hours_per_week: string
  diagnoses_summary: string
}

const DEMO_AUTHORIZATIONS: AuthorizationCard[] = [
  {
    id: 'auth-101',
    medicaid_last4: '3210',
    service_type: 'Personal Attendant (PAS)',
    payer_id: 'star-plus',
    payer_name: 'TX STAR+PLUS',
    status: 'draft',
    days_in_status: 1,
    start_date: '2026-09-01',
    hours_per_week: '18 hrs/wk',
    diagnoses_summary: 'M79.7 Fibromyalgia',
  },
  {
    id: 'auth-102',
    medicaid_last4: '8841',
    service_type: 'Community Attendant (CAS)',
    payer_id: 'uhc-texas',
    payer_name: 'UHC Texas',
    status: 'submitted',
    days_in_status: 2,
    start_date: '2026-08-28',
    hours_per_week: '24 hrs/wk',
    diagnoses_summary: 'I10 Hypertension, Diabetes',
  },
  {
    id: 'auth-103',
    medicaid_last4: '4109',
    service_type: 'Day Activity (DAHS)',
    payer_id: 'molina-texas',
    payer_name: 'Molina Texas',
    status: 'pending',
    days_in_status: 4,
    start_date: '2026-08-25',
    hours_per_week: '30 hrs/wk',
    diagnoses_summary: 'M19.0 Osteoarthritis',
  },
  {
    id: 'auth-104',
    medicaid_last4: '9923',
    service_type: 'Personal Attendant (PAS)',
    payer_id: 'star-plus',
    payer_name: 'TX STAR+PLUS',
    status: 'approved',
    days_in_status: 12,
    start_date: '2026-08-15',
    hours_per_week: '20 hrs/wk',
    diagnoses_summary: 'G81.9 Hemiplegia',
  },
  {
    id: 'auth-105',
    medicaid_last4: '1044',
    service_type: 'Personal Attendant (PAS)',
    payer_id: 'aetna-texas',
    payer_name: 'Aetna Better Health',
    status: 'denied',
    days_in_status: 3,
    start_date: '2026-08-20',
    hours_per_week: '15 hrs/wk',
    diagnoses_summary: 'M54.5 Lower back pain',
  },
]

export default function DashboardPage() {
  const [selectedAuth, setSelectedAuth] = useState<AuthorizationCard | null>(null)

  const columns = [
    { id: 'draft', title: 'DRAFT', color: 'border-l-amber-500', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'submitted', title: 'SUBMITTED', color: 'border-l-blue-500', badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'pending', title: 'PENDING', color: 'border-l-purple-500', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'approved', title: 'APPROVED', color: 'border-l-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'denied', title: 'DENIED / APPEAL', color: 'border-l-rose-500', badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  ]

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 space-y-6">
      {/* HEADER ROW */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#1E3050] gap-4">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <div className="h-6 w-px bg-[#1E3050]" />
          <div>
            <h1 className="text-base font-bold text-[#F0F6FC]">Apex Home Health Care</h1>
            <p className="text-xs text-[#8B98A8]">Texas Region 7 • NPI: 1987654321</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/patients/new"
            className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#2DD4BF]/20 transition flex items-center space-x-2"
          >
            <span className="text-base">+</span>
            <span>New Authorization</span>
          </Link>

          <div className="flex items-center space-x-2 bg-[#0F2040] border border-[#1E3050] px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-[#2DD4BF] text-[#0A1628] font-bold flex items-center justify-center text-xs">
              SC
            </div>
            <span className="text-xs text-[#F0F6FC] font-medium hidden md:inline">Sarah Jenkins (Coordinator)</span>
          </div>
        </div>
      </header>

      {/* STATS BAR (4 Metric Cards with Sparklines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="text-xs text-[#8B98A8] font-medium">PAs This Month</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#F0F6FC]">24</div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ↑ +18% vs last mo
            </span>
          </div>
          {/* Sparkline Visual */}
          <div className="h-6 w-full flex items-end space-x-1 pt-2">
            <div className="h-2 w-full bg-[#1E3050] rounded-t" />
            <div className="h-3 w-full bg-[#1E3050] rounded-t" />
            <div className="h-4 w-full bg-[#2DD4BF]/50 rounded-t" />
            <div className="h-6 w-full bg-[#2DD4BF] rounded-t" />
          </div>
        </div>

        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="text-xs text-[#8B98A8] font-medium">First-Pass Approval Rate</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#2DD4BF]">96.2%</div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Target &gt;90%
            </span>
          </div>
          <div className="h-6 w-full flex items-end space-x-1 pt-2">
            <div className="h-4 w-full bg-[#2DD4BF]/40 rounded-t" />
            <div className="h-5 w-full bg-[#2DD4BF]/60 rounded-t" />
            <div className="h-5 w-full bg-[#2DD4BF]/80 rounded-t" />
            <div className="h-6 w-full bg-[#2DD4BF] rounded-t" />
          </div>
        </div>

        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="text-xs text-[#8B98A8] font-medium">Avg Time to Approval</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#F0F6FC]">2.4 Days</div>
            <span className="text-xs font-semibold text-[#8B98A8] bg-[#162035] px-2 py-0.5 rounded-full">
              CMS Cap 7 Days
            </span>
          </div>
          <div className="h-6 w-full flex items-end space-x-1 pt-2">
            <div className="h-5 w-full bg-[#1E3050] rounded-t" />
            <div className="h-4 w-full bg-[#2DD4BF]/60 rounded-t" />
            <div className="h-3 w-full bg-[#2DD4BF]/80 rounded-t" />
            <div className="h-2 w-full bg-[#2DD4BF] rounded-t" />
          </div>
        </div>

        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="text-xs text-[#8B98A8] font-medium">Expiring Soon (&lt;30 Days)</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-amber-400">3</div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Needs Renewal
            </span>
          </div>
          <div className="h-6 w-full flex items-end space-x-1 pt-2">
            <div className="h-2 w-full bg-amber-500/30 rounded-t" />
            <div className="h-4 w-full bg-amber-500/50 rounded-t" />
            <div className="h-5 w-full bg-amber-500/80 rounded-t" />
            <div className="h-6 w-full bg-amber-400 rounded-t" />
          </div>
        </div>
      </div>

      {/* KANBAN PIPELINE BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const auths = DEMO_AUTHORIZATIONS.filter((a) => a.status === col.id)

          return (
            <div key={col.id} className="bg-[#0D1B2E] border border-[#1E3050] rounded-2xl p-4 flex flex-col space-y-3 min-w-[240px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1E3050]">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${col.badgeBg}`}>
                  {col.title}
                </span>
                <span className="text-xs font-mono text-[#8B98A8] font-bold">{auths.length}</span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1">
                {auths.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#1E3050] rounded-xl flex items-center justify-center p-4 text-center">
                    <p className="text-xs text-[#6B7280]">No PAs currently in {col.title.toLowerCase()} state.</p>
                  </div>
                ) : (
                  auths.map((auth) => (
                    <div
                      key={auth.id}
                      onClick={() => setSelectedAuth(auth)}
                      className={`bg-[#0F2040] hover:bg-[#16294A] border-l-4 ${col.color} border border-r-[#1E3050] border-t-[#1E3050] border-b-[#1E3050] rounded-xl p-3.5 space-y-2 cursor-pointer transition shadow-md group`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#F0F6FC]">Member ...{auth.medicaid_last4}</span>
                        <span className="text-[10px] bg-[#162035] text-[#2DD4BF] px-2 py-0.5 rounded font-mono">
                          {auth.payer_name}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#F0F6FC]">{auth.service_type}</div>
                      <div className="text-[11px] text-[#8B98A8] truncate">{auth.diagnoses_summary}</div>

                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-2 border-t border-[#1E3050]/60">
                        <span>{auth.hours_per_week}</span>
                        <span>{auth.days_in_status}d in status</span>
                      </div>

                      {/* Action Button */}
                      <div className="pt-1">
                        {auth.status === 'draft' && (
                          <Link
                            href={`/authorizations/${auth.id}/review`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full block text-center bg-[#2DD4BF]/10 hover:bg-[#2DD4BF] text-[#2DD4BF] hover:text-[#0A1628] text-xs font-bold py-1.5 rounded-lg border border-[#2DD4BF]/30 transition"
                          >
                            Review &amp; Submit →
                          </Link>
                        )}
                        {auth.status === 'submitted' && (
                          <span className="block text-center text-[11px] text-blue-400 bg-blue-500/10 py-1 rounded-lg border border-blue-500/20">
                            Fax Transmitted
                          </span>
                        )}
                        {auth.status === 'pending' && (
                          <span className="block text-center text-[11px] text-purple-400 bg-purple-500/10 py-1 rounded-lg border border-purple-500/20">
                            Awaiting Payer
                          </span>
                        )}
                        {auth.status === 'approved' && (
                          <span className="block text-center text-[11px] text-emerald-400 bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">
                            ✓ Approved
                          </span>
                        )}
                        {auth.status === 'denied' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              alert('Opening AI Appeal Letter Generator...')
                            }}
                            className="w-full block text-center bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold py-1.5 rounded-lg border border-rose-500/40 transition"
                          >
                            ⚡ Generate Appeal
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* SLIDE-OVER DETAIL PANEL */}
      {selectedAuth && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F2040] border-l border-[#1E3050] p-6 space-y-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3050]">
                <div>
                  <h3 className="text-base font-bold text-[#F0F6FC]">Authorization Detail</h3>
                  <p className="text-xs text-[#8B98A8]">ID: {selectedAuth.id}</p>
                </div>
                <button
                  onClick={() => setSelectedAuth(null)}
                  className="text-[#8B98A8] hover:text-[#F0F6FC] text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#162035] space-y-1">
                  <div className="text-[#8B98A8]">Member Medicaid ID</div>
                  <div className="text-sm font-bold text-[#F0F6FC]">Ending in ...{selectedAuth.medicaid_last4}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#162035] space-y-1">
                  <div className="text-[#8B98A8]">Requested Service</div>
                  <div className="text-sm font-bold text-[#2DD4BF]">{selectedAuth.service_type}</div>
                  <div className="text-[11px] text-[#8B98A8]">{selectedAuth.hours_per_week} • Start Date: {selectedAuth.start_date}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#162035] space-y-1">
                  <div className="text-[#8B98A8]">Payer Information</div>
                  <div className="text-sm font-bold text-[#F0F6FC]">{selectedAuth.payer_name}</div>
                  <div className="text-[11px] text-[#8B98A8]">Standard Decision Deadline: 7 Days</div>
                </div>

                <div className="p-3 rounded-xl bg-[#162035] space-y-1">
                  <div className="text-[#8B98A8]">Clinical Diagnoses</div>
                  <div className="text-sm font-medium text-[#F0F6FC]">{selectedAuth.diagnoses_summary}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E3050] space-y-2">
              <Link
                href={`/authorizations/${selectedAuth.id}/review`}
                className="w-full block text-center bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs py-3 rounded-xl transition"
              >
                Open Full Review Screen
              </Link>
              <button
                onClick={() => setSelectedAuth(null)}
                className="w-full bg-[#162035] hover:bg-[#2A4060] text-[#8B98A8] text-xs font-semibold py-2.5 rounded-xl transition"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
