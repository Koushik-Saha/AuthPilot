'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function Home() {
  const [monthlyPaCount, setMonthlyPaCount] = useState(25)

  // Calculations for ROI calculator
  const minutesSavedPerPa = 45
  const totalHoursSaved = Math.round(((monthlyPaCount * minutesSavedPerPa) / 60) * 10) / 10
  const laborCostSaved = Math.round(totalHoursSaved * 25) // $25/hr coordinator rate
  const revenueProtected = Math.round((monthlyPaCount * 0.12) * 3200) // $3,200 avg claim value for 12% denied claims

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] selection:bg-[#2DD4BF] selection:text-[#0A1628]">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-[#1E3050] bg-[#0A1628]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="full" size="sm" />

          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-[#8B98A8]">
            <a href="#features" className="hover:text-[#2DD4BF] transition">Features</a>
            <a href="#how-to-run" className="hover:text-[#2DD4BF] transition">How to Run</a>
            <a href="#roi-calculator" className="hover:text-[#2DD4BF] transition">ROI Calculator</a>
            <Link href="/analytics" className="hover:text-[#2DD4BF] transition">Analytics</Link>
            <Link href="/pricing" className="hover:text-[#2DD4BF] transition">Pricing</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/demo"
              className="bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              ⚡ Interactive Sales Demo
            </Link>
            <Link
              href="/patients/new"
              className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20"
            >
              + Create New PA
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Glowing Background Radial Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2DD4BF]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#0F2040] border border-[#2DD4BF]/40 px-4 py-1.5 rounded-full text-xs text-[#2DD4BF] font-mono shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
            <span>AI Prior Authorization Platform for Texas Medicaid Agencies</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F0F6FC] leading-tight">
            Turn <span className="text-[#2DD4BF]">7-Day PA Delays</span> into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2DD4BF] via-emerald-400 to-[#2DD4BF] bg-clip-text text-transparent">
              2-Minute Instant Approvals
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8B98A8] max-w-2xl mx-auto leading-relaxed">
            AuthPilot reads raw OASIS forms, CMS-485 orders, and clinical notes to generate audit-resistant prior authorization packets and 500+ word medical necessity narratives with <strong>96.2% first-pass approval</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-[#2DD4BF]/20 transition transform hover:-translate-y-0.5"
            >
              🚀 Open Live Interactive Demo →
            </Link>
            <Link
              href="/authorizations/demo-auth-101/review"
              className="w-full sm:w-auto bg-[#162035] hover:bg-[#2A4060] text-[#F0F6FC] border border-[#1E3050] font-semibold text-sm px-6 py-4 rounded-xl transition"
            >
              📄 Preview Pre-Submission Packet Review
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-[#1E3050]/80 text-left">
            <div className="p-4 bg-[#0F2040]/60 border border-[#1E3050] rounded-xl">
              <div className="text-2xl font-extrabold text-[#2DD4BF]">96.2%</div>
              <div className="text-xs text-[#8B98A8]">First-Pass Approval Rate</div>
            </div>
            <div className="p-4 bg-[#0F2040]/60 border border-[#1E3050] rounded-xl">
              <div className="text-2xl font-extrabold text-[#F0F6FC]">45 Mins</div>
              <div className="text-xs text-[#8B98A8]">Saved Per Authorization</div>
            </div>
            <div className="p-4 bg-[#0F2040]/60 border border-[#1E3050] rounded-xl">
              <div className="text-2xl font-extrabold text-[#F0F6FC]">85%+</div>
              <div className="text-xs text-[#8B98A8]">Denial Overturn Rate</div>
            </div>
            <div className="p-4 bg-[#0F2040]/60 border border-[#1E3050] rounded-xl">
              <div className="text-2xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-[#8B98A8]">HIPAA Compliant &amp; BAA Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS MODULES GRID */}
      <section id="features" className="py-16 px-6 bg-[#0D1B2E] border-y border-[#1E3050]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono text-[#2DD4BF] uppercase tracking-widest">Complete Core Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC]">One-Click Access to Every Feature</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Kanban Pipeline */}
            <Link
              href="/demo"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center text-xl font-bold">
                📊
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                Kanban Pipeline Dashboard
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                Real-time coordinator board tracking authorizations across 5 statuses: Draft, Submitted, Pending, Approved, and Denied.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">Launch Dashboard →</div>
            </Link>

            {/* Card 2: Document Extraction */}
            <Link
              href="/patients/new"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center text-xl font-bold">
                📁
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                3-Step Patient Upload Wizard
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                Drag-and-drop OASIS assessment forms, CMS-485 orders, and clinical notes for instant Claude 3.5 Sonnet extraction.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">Start New Wizard →</div>
            </Link>

            {/* Card 3: React-PDF Generator */}
            <Link
              href="/authorizations/demo-auth-101/review"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center text-xl font-bold">
                📄
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                Pre-Submission Review &amp; PDF Packet
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                2-column review screen displaying confidence dots, editable 500+ word narrative, and downloadable 4-page React-PDF packet.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">Open Packet Review →</div>
            </Link>

            {/* Card 4: AI Appeal Letter Generator */}
            <Link
              href="/appeals"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl font-bold">
                ⚡
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                AI Denial Appeal Center
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                60-day deadline countdown, red urgency alerts, and 1-click clinical rebuttal letter generator with 85%+ overturn rate.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">Open Appeal Center →</div>
            </Link>

            {/* Card 5: Agency Analytics */}
            <Link
              href="/analytics"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center text-xl font-bold">
                📈
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                Agency Analytics &amp; Intelligence
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                8-week approval rate trend vs 62% benchmark, payer performance matrix, and monthly labor/revenue impact calculator.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">View Analytics →</div>
            </Link>

            {/* Card 6: Stripe Subscription Billing */}
            <Link
              href="/billing"
              className="bg-[#0F2040] border border-[#1E3050] hover:border-[#2DD4BF] p-6 rounded-2xl space-y-3 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex items-center justify-center text-xl font-bold">
                💳
              </div>
              <h4 className="text-base font-bold text-[#F0F6FC] group-hover:text-[#2DD4BF] transition">
                Stripe Billing &amp; Limit Control
              </h4>
              <p className="text-xs text-[#8B98A8] leading-relaxed">
                Self-serve plan management (Starter $299 / Growth $599 / Complete $899) with automated PA usage limit enforcement.
              </p>
              <div className="text-xs font-bold text-[#2DD4BF] pt-2">Manage Subscription →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW TO RUN THE PROJECT SECTION */}
      <section id="how-to-run" className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono text-[#2DD4BF] uppercase tracking-widest">Developer &amp; Agency Guide</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC]">How to Run AuthPilot Locally or Deploy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Clone & Setup */}
            <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#2DD4BF] text-[#0A1628] font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="text-sm font-bold text-[#F0F6FC]">Install Dependencies &amp; Env Vars</h4>
              </div>
              <p className="text-xs text-[#8B98A8]">
                Ensure Node.js 20+ is installed. Clone the repository and configure credentials in <code>.env.local</code>.
              </p>
              <pre className="bg-[#0A1628] border border-[#1E3050] p-3 rounded-xl text-xs font-mono text-[#2DD4BF] overflow-x-auto">
                npm install
              </pre>
            </div>

            {/* Step 2: Run Local Dev Server */}
            <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#2DD4BF] text-[#0A1628] font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="text-sm font-bold text-[#F0F6FC]">Start Next.js Development Server</h4>
              </div>
              <p className="text-xs text-[#8B98A8]">
                Launch dev server and open <code>http://localhost:3000</code> in your web browser.
              </p>
              <pre className="bg-[#0A1628] border border-[#1E3050] p-3 rounded-xl text-xs font-mono text-[#2DD4BF] overflow-x-auto">
                npm run dev
              </pre>
            </div>

            {/* Step 3: Run Jest Test Suite */}
            <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#2DD4BF] text-[#0A1628] font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="text-sm font-bold text-[#F0F6FC]">Execute Unit &amp; Integration Tests</h4>
              </div>
              <p className="text-xs text-[#8B98A8]">
                Run Jest unit tests for payer rules, Claude extraction, and PA form generation.
              </p>
              <pre className="bg-[#0A1628] border border-[#1E3050] p-3 rounded-xl text-xs font-mono text-[#2DD4BF] overflow-x-auto">
                npm test
              </pre>
            </div>

            {/* Step 4: Run E2E System Test */}
            <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-[#2DD4BF] text-[#0A1628] font-bold flex items-center justify-center text-xs">4</span>
                <h4 className="text-sm font-bold text-[#F0F6FC]">Run Full Pre-Walkin E2E Test</h4>
              </div>
              <p className="text-xs text-[#8B98A8]">
                Run full pipeline test verifying document extraction, PDF rendering, and Twilio fax routing.
              </p>
              <pre className="bg-[#0A1628] border border-[#1E3050] p-3 rounded-xl text-xs font-mono text-[#2DD4BF] overflow-x-auto">
                npx tsx scripts/e2e-test.ts
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section id="roi-calculator" className="py-16 px-6 bg-[#0D1B2E] border-t border-[#1E3050]">
        <div className="max-w-4xl mx-auto bg-[#0F2040] border border-[#2DD4BF]/40 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#F0F6FC]">Interactive Agency ROI Calculator</h3>
            <p className="text-xs text-[#8B98A8]">Adjust monthly prior authorization volume to calculate exact labor and revenue impact.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Monthly PA Volume:</span>
              <span className="text-[#2DD4BF] font-mono text-base">{monthlyPaCount} Prior Authorizations / mo</span>
            </div>

            <input
              type="range"
              min={5}
              max={150}
              value={monthlyPaCount}
              onChange={(e) => setMonthlyPaCount(Number(e.target.value))}
              className="w-full h-2 bg-[#0A1628] rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E3050] text-center">
            <div className="p-4 bg-[#0A1628] rounded-xl border border-[#1E3050]">
              <div className="text-xs text-[#8B98A8]">Monthly Hours Saved</div>
              <div className="text-2xl font-extrabold text-[#F0F6FC]">{totalHoursSaved} Hours</div>
              <div className="text-[10px] text-[#8B98A8]">@ 45 mins saved per PA</div>
            </div>

            <div className="p-4 bg-[#0A1628] rounded-xl border border-[#1E3050]">
              <div className="text-xs text-[#8B98A8]">Coordinator Labor Cost Saved</div>
              <div className="text-2xl font-extrabold text-[#2DD4BF]">${laborCostSaved.toLocaleString()}</div>
              <div className="text-[10px] text-[#8B98A8]">@ $25/hr labor rate</div>
            </div>

            <div className="p-4 bg-[#0A1628] rounded-xl border border-[#1E3050]">
              <div className="text-xs text-[#8B98A8]">Denied Revenue Protected</div>
              <div className="text-2xl font-extrabold text-emerald-400">${revenueProtected.toLocaleString()}</div>
              <div className="text-[10px] text-[#8B98A8]">@ $3,200 avg claim value</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & HIPAA COMPLIANCE */}
      <footer className="border-t border-[#1E3050] py-10 px-6 text-center text-xs text-[#6B7280] space-y-3">
        <div className="flex justify-center space-x-6">
          <Link href="/demo" className="hover:text-[#F0F6FC]">Sales Demo (/demo)</Link>
          <Link href="/login" className="hover:text-[#F0F6FC]">Coordinator Login</Link>
          <Link href="/onboarding" className="hover:text-[#F0F6FC]">Agency Onboarding</Link>
          <a href="https://github.com/Koushik-Saha/AuthPilot.git" target="_blank" rel="noreferrer" className="hover:text-[#F0F6FC]">GitHub Repo</a>
        </div>
        <p>© 2026 AuthPilot, LLC. All Rights Reserved. Protected under HIPAA Privacy &amp; Security Rules (45 CFR Parts 160/164).</p>
      </footer>
    </div>
  )
}
