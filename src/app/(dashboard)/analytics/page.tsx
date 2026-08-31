'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

export default function AnalyticsDashboardPage() {
  const kpis = [
    { label: 'First-Pass Approval Rate', value: '96.2%', change: '+8.4% vs industry', positive: true },
    { label: 'PAs Submitted This Month', value: '24', change: '+18% vs last month', positive: true },
    { label: 'Avg Days to Approval', value: '2.4 Days', change: '-4.6 days faster than cap', positive: true },
    { label: 'Hours Saved This Month', value: '18.0 Hrs', change: '=$540 labor cost saved', positive: true },
  ]

  const weeklyTrends = [
    { week: 'Wk 1', rate: 88.1 },
    { week: 'Wk 2', rate: 89.4 },
    { week: 'Wk 3', rate: 91.2 },
    { week: 'Wk 4', rate: 93.6 },
    { week: 'Wk 5', rate: 94.1 },
    { week: 'Wk 6', rate: 95.8 },
    { week: 'Wk 7', rate: 95.2 },
    { week: 'Wk 8', rate: 96.2 },
  ]

  const payers = [
    { name: 'Aetna Better Health Texas', count: 8, approval: '87.5%', days: '3.1', denial: '12.5%', isHighDenial: false },
    { name: 'UnitedHealthcare Texas', count: 14, approval: '92.8%', days: '2.5', denial: '7.2%', isHighDenial: false },
    { name: 'Texas STAR+PLUS Medicaid', count: 32, approval: '96.8%', days: '2.1', denial: '3.2%', isHighDenial: false },
    { name: 'Molina Healthcare Texas', count: 11, approval: '95.4%', days: '2.8', denial: '4.6%', isHighDenial: false },
  ]

  const expiring = [
    { id: 'auth-104', medicaid_last4: '3210', service: 'Personal Attendant (PAS)', expiry: '2026-09-15', days: 15 },
    { id: 'auth-112', medicaid_last4: '8841', service: 'Community Attendant (CAS)', expiry: '2026-09-22', days: 22 },
  ]

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#1E3050]">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <span className="text-xs font-mono text-[#2DD4BF] bg-[#0F2040] border border-[#2DD4BF]/30 px-3 py-1 rounded-full">
            Agency Intelligence &amp; Analytics
          </span>
        </div>
        <Link href="/" className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
          ← Back to Main Pipeline
        </Link>
      </header>

      {/* ROW 1 — 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-5 space-y-2">
            <div className="text-xs text-[#8B98A8] font-medium">{kpi.label}</div>
            <div className="text-2xl font-extrabold text-[#F0F6FC]">{kpi.value}</div>
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full border border-emerald-500/20">
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2 — TWO CHARTS SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CHART — Weekly First-Pass Approval Rate Line Chart */}
        <div className="lg:col-span-7 bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#F0F6FC]">Weekly First-Pass Approval Rate (8-Week Trend)</h2>
              <p className="text-xs text-[#8B98A8]">Compared against Industry Benchmark (62.0%) &amp; Target (90.0%)</p>
            </div>
            <span className="text-xs font-mono text-[#2DD4BF] bg-[#162035] px-2.5 py-1 rounded-lg border border-[#2DD4BF]/30">
              AuthPilot: 96.2%
            </span>
          </div>

          <div className="h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#1E3050" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="#8B98A8" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E3050' }} />
                <YAxis
                  domain={[75, 100]}
                  stroke="#8B98A8"
                  fontSize={11}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={{ stroke: '#1E3050' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0A1628] border border-[#2DD4BF]/50 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-[#F0F6FC]">{label}</p>
                          <p className="text-[#2DD4BF] font-mono font-semibold">
                            Approval Rate: {payload[0].value}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine
                  y={62}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{ value: 'Industry Avg 62%', fill: '#F59E0B', fontSize: 10, position: 'insideTopLeft' }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#34D399"
                  strokeDasharray="4 4"
                  label={{ value: 'Target 90%', fill: '#34D399', fontSize: 10, position: 'insideTopRight' }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2DD4BF"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2DD4BF', stroke: '#0F2040', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#2DD4BF', stroke: '#F0F6FC', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT CHART — PA Volume Breakdown */}
        <div className="lg:col-span-5 bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F0F6FC]">PA Status Breakdown (Current Month)</h2>
            <p className="text-xs text-[#8B98A8]">Total 24 Prior Authorizations</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold">Approved (19 PAs)</span>
                <span className="text-[#8B98A8]">79.2%</span>
              </div>
              <div className="h-3 bg-[#0A1628] rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[79.2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-purple-400 font-semibold">Pending Payer (3 PAs)</span>
                <span className="text-[#8B98A8]">12.5%</span>
              </div>
              <div className="h-3 bg-[#0A1628] rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full w-[12.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-semibold">Denied / Appealed (2 PAs)</span>
                <span className="text-[#8B98A8]">8.3%</span>
              </div>
              <div className="h-3 bg-[#0A1628] rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full w-[8.3%]" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#8B98A8] border-t border-[#1E3050] pt-3">
            96.2% overall first-pass approval across all Texas Medicaid payers.
          </div>
        </div>
      </div>

      {/* ROW 3 — PAYER PERFORMANCE TABLE */}
      <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#F0F6FC]">Payer Performance Matrix</h2>
          <p className="text-xs text-[#8B98A8]">Approval speed and denial rates sorted by payer performance</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[#8B98A8] border-b border-[#1E3050] bg-[#0A1628]">
              <tr>
                <th className="p-3">Payer Name</th>
                <th className="p-3">PAs Submitted</th>
                <th className="p-3">First-Pass Approval</th>
                <th className="p-3">Avg Days to Decision</th>
                <th className="p-3">Denial Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3050]">
              {payers.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#162035] transition">
                  <td className="p-3 font-semibold text-[#F0F6FC]">{p.name}</td>
                  <td className="p-3 font-mono">{p.count}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{p.approval}</td>
                  <td className="p-3 font-mono">{p.days} Days</td>
                  <td className="p-3 text-rose-400 font-semibold">{p.denial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 4 — EXPIRING AUTHORIZATIONS PANEL */}
      <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#F0F6FC]">Expiring Authorizations (&lt;30 Days)</h2>
          <p className="text-xs text-[#8B98A8]">Proactive renewal triggers to prevent gaps in patient care</p>
        </div>

        <div className="space-y-2">
          {expiring.map((exp) => (
            <div key={exp.id} className="bg-[#0A1628] border border-[#1E3050] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F0F6FC]">Member ...{exp.medicaid_last4}</span>
                <span className="text-xs text-[#8B98A8] ml-3">{exp.service}</span>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">Expires: {exp.expiry} ({exp.days} days remaining)</div>
              </div>
              <Link
                href="/patients/new"
                className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Start Renewal →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 5 — TIME & MONEY SAVED CALLOUT */}
      <div className="bg-gradient-to-r from-[#0F2040] via-[#16294A] to-[#0F2040] border border-[#2DD4BF]/40 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="inline-block bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 font-mono text-xs px-3 py-1 rounded-full">
          💡 Monthly Efficiency Impact
        </div>
        <h2 className="text-3xl font-extrabold text-[#F0F6FC]">You saved 18.0 hours this month</h2>
        <p className="text-xs text-[#8B98A8] max-w-xl mx-auto">
          That’s <strong className="text-[#2DD4BF]">$540 in coordinator labor time</strong> at $30/hr — not including <strong className="text-emerald-400">$9,600 in revenue protected</strong> from avoided prior authorization denials.
        </p>
        <button
          onClick={() => alert('Generating Stakeholder Impact Summary Report...')}
          className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20"
        >
          Share Report with Stakeholders
        </button>
      </div>
    </div>
  )
}
