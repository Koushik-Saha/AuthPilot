'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function BillingPage() {
  const [currentPlan] = useState('growth')
  const [paCountThisMonth] = useState(47)
  const [paLimit] = useState(150)
  const [isLoading, setIsLoading] = useState(false)

  const usagePercent = Math.min(Math.round((paCountThisMonth / paLimit) * 100), 100)

  const getUsageColor = (percent: number) => {
    if (percent > 95) return 'bg-rose-500 text-rose-400'
    if (percent > 80) return 'bg-amber-500 text-amber-400'
    return 'bg-[#2DD4BF] text-[#2DD4BF]'
  }

  const handleCheckout = async (planId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, agencyId: 'agency-1' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Checkout initiation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenPortal = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeCustomerId: 'cus_demo_123' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Failed to open billing portal.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 space-y-6">
      {/* Top Navbar */}
      <header className="flex items-center justify-between pb-6 border-b border-[#1E3050]">
        <div className="flex items-center space-x-4">
          <Logo variant="full" size="sm" />
          <span className="text-xs font-mono text-[#2DD4BF] bg-[#0F2040] border border-[#2DD4BF]/30 px-3 py-1 rounded-full">
            Subscription &amp; Billing Portal
          </span>
        </div>
        <Link href="/" className="text-xs text-[#8B98A8] hover:text-[#F0F6FC]">
          ← Back to Main Pipeline
        </Link>
      </header>

      {/* Current Plan & Monthly Usage Card */}
      <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E3050] pb-4">
          <div>
            <div className="text-xs text-[#8B98A8] font-medium uppercase tracking-wider">Active Agency Subscription</div>
            <h1 className="text-2xl font-extrabold text-[#F0F6FC]">Growth Plan ($599 / month)</h1>
            <p className="text-xs text-[#8B98A8]">Next billing cycle renews on September 28, 2026</p>
          </div>

          <button
            onClick={handleOpenPortal}
            disabled={isLoading}
            className="bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] font-bold text-xs px-5 py-3 rounded-xl transition"
          >
            💳 Manage Payment Method &amp; Invoices
          </button>
        </div>

        {/* PA Usage Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#F0F6FC]">Monthly Prior Authorization Usage</span>
            <span className={getUsageColor(usagePercent).split(' ')[1]}>
              {paCountThisMonth} / {paLimit} PAs Used ({usagePercent}%)
            </span>
          </div>

          <div className="h-3 bg-[#0A1628] rounded-full overflow-hidden border border-[#1E3050]">
            <div
              className={`h-full transition-all duration-500 ${getUsageColor(usagePercent).split(' ')[0]}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#8B98A8]">
            Need higher PA volume? Upgrade to the Complete Plan for unlimited monthly prior authorizations.
          </p>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className={`bg-[#0F2040] border ${currentPlan === 'starter' ? 'border-[#2DD4BF]' : 'border-[#1E3050]'} rounded-2xl p-6 space-y-4 flex flex-col justify-between`}>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#F0F6FC]">Starter Plan</h3>
            <div className="text-3xl font-extrabold text-[#F0F6FC]">
              $299 <span className="text-xs text-[#8B98A8] font-normal">/ month</span>
            </div>
            <p className="text-xs text-[#8B98A8]">For small home health agencies managing basic PA volumes.</p>

            <ul className="text-xs text-[#F0F6FC] space-y-2 pt-2">
              <li className="flex items-center">✓ 30 Prior Authorizations / month</li>
              <li className="flex items-center">✓ Texas STAR+PLUS &amp; Medicaid</li>
              <li className="flex items-center">✓ Automated Twilio Fax Transmission</li>
              <li className="flex items-center">✓ Basic Email Support</li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('starter')}
            disabled={currentPlan === 'starter' || isLoading}
            className="w-full bg-[#162035] hover:bg-[#2A4060] text-[#F0F6FC] font-bold text-xs py-3 rounded-xl border border-[#1E3050] transition mt-4"
          >
            {currentPlan === 'starter' ? 'Current Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Growth Plan (Popular) */}
        <div className={`bg-[#0F2040] border-2 ${currentPlan === 'growth' ? 'border-[#2DD4BF]' : 'border-[#1E3050]'} rounded-2xl p-6 space-y-4 flex flex-col justify-between relative shadow-xl`}>
          <div className="absolute -top-3 right-6 bg-[#2DD4BF] text-[#0A1628] font-bold text-[10px] px-3 py-1 rounded-full uppercase">
            Most Popular
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#F0F6FC]">Growth Plan</h3>
            <div className="text-3xl font-extrabold text-[#2DD4BF]">
              $599 <span className="text-xs text-[#8B98A8] font-normal">/ month</span>
            </div>
            <p className="text-xs text-[#8B98A8]">For growing regional agencies with multiple care coordinators.</p>

            <ul className="text-xs text-[#F0F6FC] space-y-2 pt-2">
              <li className="flex items-center font-semibold">✓ 150 Prior Authorizations / month</li>
              <li className="flex items-center">✓ All Texas Medicaid Payers</li>
              <li className="flex items-center">✓ AI Denial Appeal Letter Generator</li>
              <li className="flex items-center">✓ Inngest 30-Day Expiration Alerts</li>
              <li className="flex items-center">✓ Priority Phone &amp; Email Support</li>
            </ul>
          </div>

          <button
            disabled={currentPlan === 'growth'}
            className="w-full bg-[#2DD4BF] text-[#0A1628] font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20 mt-4 cursor-default"
          >
            Active Plan
          </button>
        </div>

        {/* Complete Plan */}
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#F0F6FC]">Complete Plan</h3>
            <div className="text-3xl font-extrabold text-[#F0F6FC]">
              $899 <span className="text-xs text-[#8B98A8] font-normal">/ month</span>
            </div>
            <p className="text-xs text-[#8B98A8]">For enterprise healthcare networks requiring unlimited capacity.</p>

            <ul className="text-xs text-[#F0F6FC] space-y-2 pt-2">
              <li className="flex items-center font-bold text-emerald-400">✓ Unlimited Prior Authorizations</li>
              <li className="flex items-center">✓ Multi-State Managed Care Support</li>
              <li className="flex items-center">✓ Dedicated Account Manager</li>
              <li className="flex items-center">✓ Custom EHR &amp; FHIR Integration</li>
              <li className="flex items-center">✓ 99.9% Uptime SLA &amp; HIPAA BAA</li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout('complete')}
            disabled={isLoading}
            className="w-full bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] font-bold text-xs py-3 rounded-xl transition mt-4"
          >
            Upgrade to Complete →
          </button>
        </div>
      </div>
    </div>
  )
}
