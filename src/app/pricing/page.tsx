'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function PricingPage() {
  // State for FAQ accordion expansion
  const [openFaq, setOpenFaq] = useState<number | null>(0) // First open by default

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      q: 'Is AuthPilot HIPAA compliant?',
      a: 'Yes. AuthPilot is hosted on HIPAA-eligible infrastructure with AES-256 encryption at rest and TLS 1.3 in transit. We execute a Business Associate Agreement (BAA) with every agency before data is processed. Our subprocessors — including Anthropic, AWS, and Twilio — all maintain signed BAAs.',
    },
    {
      q: 'How long does setup take?',
      a: 'Most agencies are submitting their first prior authorization within 48 hours of signup. Our onboarding wizard takes 10 minutes. No EHR integration required — simply upload your clinical documents as PDFs.',
    },
    {
      q: 'Which payers do you support?',
      a: 'We currently support Texas STAR+PLUS Medicaid, UnitedHealthcare Texas, Molina Healthcare Texas, and Aetna Better Health Texas. These 4 payers cover over 80% of Texas home health Medicaid volume. Additional payers and states are added monthly.',
    },
    {
      q: 'Do you offer a free trial?',
      a: "Yes — your first 5 prior authorizations are completely free with no credit card required. You only pay when you're ready to continue. Cancel anytime.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] selection:bg-[#2DD4BF] selection:text-[#0A1628]">
      {/* TOP NAVIGATION BAR */}
      <nav className="border-b border-[#1E3050] bg-[#0A1628]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="full" size="sm" />

          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-[#8B98A8]">
            <Link href="/" className="hover:text-[#2DD4BF] transition">Home</Link>
            <Link href="/demo" className="hover:text-[#2DD4BF] transition">Live Demo</Link>
            <Link href="/appeals" className="hover:text-[#2DD4BF] transition">Appeals</Link>
            <Link href="/analytics" className="hover:text-[#2DD4BF] transition">Analytics</Link>
            <Link href="/pricing" className="text-[#2DD4BF] font-bold">Pricing</Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/demo"
              className="bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              ⚡ Sales Demo
            </Link>
            <Link
              href="/onboarding"
              className="bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1 — PAGE HEADER */}
      <section className="pt-16 pb-12 px-6 text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-block bg-[#0F2040] border border-[#2DD4BF]/40 px-4 py-1.5 rounded-full text-xs text-[#2DD4BF] font-mono shadow-md">
          TRANSPARENT PRICING
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F6FC] tracking-tight leading-tight">
          Simple, Predictable Pricing for Home Care Agencies
        </h1>

        <p className="text-base text-[#8B98A8] max-w-2xl mx-auto">
          No setup fees. No per-PA charges. Cancel anytime. Your first 5 PAs are free.
        </p>
      </section>

      {/* SECTION 2 — 3 PRICING TIER CARDS */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1 — STARTER */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-[#1E3050]/80 transition">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F0F6FC]">Starter</h3>
                <p className="text-xs text-[#8B98A8]">For agencies just getting started</p>
                <div className="pt-2 flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-[#F0F6FC]">$299</span>
                  <span className="text-xs text-[#8B98A8]">/month</span>
                </div>
                <div className="inline-block bg-[#162035] text-[#2DD4BF] font-mono text-[11px] px-3 py-1 rounded-md border border-[#1E3050]">
                  Up to 30 PAs/month
                </div>
              </div>

              <div className="border-t border-[#1E3050] pt-6 space-y-3 text-xs">
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> TX STAR+PLUS payer support</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> AI document extraction (OASIS, CMS-485)</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> PA form generation + PDF download</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Fax submission via Twilio</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Email deadline alerts</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Basic status tracking</div>
                <div className="flex items-center text-[#6B7280] line-through"><span className="text-[#6B7280] mr-2.5">✗</span> Denial appeal generator</div>
                <div className="flex items-center text-[#6B7280] line-through"><span className="text-[#6B7280] mr-2.5">✗</span> ROI analytics dashboard</div>
                <div className="flex items-center text-[#6B7280] line-through"><span className="text-[#6B7280] mr-2.5">✗</span> Renewal automation</div>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="w-full block text-center bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] font-bold text-xs py-3.5 rounded-xl transition mt-6"
            >
              Start Free Trial
            </Link>
          </div>

          {/* CARD 2 — GROWTH (MOST POPULAR HIGHLIGHTED) */}
          <div className="bg-[#0F2040] border-2 border-[#2DD4BF] rounded-3xl p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-[#2DD4BF]/10 scale-105 z-10">
            <div className="absolute -top-3.5 right-6 bg-[#2DD4BF] text-[#0A1628] font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F0F6FC]">Growth</h3>
                <p className="text-xs text-[#8B98A8]">For growing agencies — our most popular plan</p>
                <div className="pt-2 flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-[#2DD4BF]">$599</span>
                  <span className="text-xs text-[#8B98A8]">/month</span>
                </div>
                <div className="inline-block bg-[#2DD4BF]/10 text-[#2DD4BF] font-mono text-[11px] px-3 py-1 rounded-md border border-[#2DD4BF]/30">
                  Up to 150 PAs/month
                </div>
              </div>

              <div className="border-t border-[#1E3050] pt-6 space-y-3 text-xs">
                <div className="flex items-center text-[#F0F6FC] font-semibold"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Everything in Starter</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> All TX payers (UHC, Molina, Aetna, Humana TX)</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> AI denial appeal letter generator</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> ROI analytics dashboard</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Payer performance matrix</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Monthly efficiency report PDF</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Priority email support</div>
                <div className="flex items-center text-[#6B7280] line-through"><span className="text-[#6B7280] mr-2.5">✗</span> Renewal automation</div>
                <div className="flex items-center text-[#6B7280] line-through"><span className="text-[#6B7280] mr-2.5">✗</span> Multi-state payer support</div>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="w-full block text-center bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs py-3.5 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20 mt-6"
            >
              Start Free Trial
            </Link>
          </div>

          {/* CARD 3 — COMPLETE */}
          <div className="bg-[#0F2040] border border-[#1E3050] rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:border-[#1E3050]/80 transition">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F0F6FC]">Complete</h3>
                <p className="text-xs text-[#8B98A8]">Full-service automation for established agencies</p>
                <div className="pt-2 flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-[#F0F6FC]">$899</span>
                  <span className="text-xs text-[#8B98A8]">/month</span>
                </div>
                <div className="inline-block bg-[#162035] text-[#2DD4BF] font-mono text-[11px] px-3 py-1 rounded-md border border-[#1E3050]">
                  Unlimited PAs/month
                </div>
              </div>

              <div className="border-t border-[#1E3050] pt-6 space-y-3 text-xs">
                <div className="flex items-center text-[#F0F6FC] font-semibold"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Everything in Growth</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Authorization renewal automation (30-day pre-trigger)</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Medicaid waiver LOC reassessment packets</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Multi-state payer support (FL, OH coming soon)</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Dedicated onboarding call</div>
                <div className="flex items-center text-[#F0F6FC]"><span className="text-[#2DD4BF] font-bold mr-2.5">✓</span> Same-day support response</div>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full block text-center bg-[#162035] hover:bg-[#2A4060] text-[#2DD4BF] border border-[#2A4060] font-bold text-xs py-3.5 rounded-xl transition mt-6"
            >
              Book a Demo
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 3 — ROI PROOF BAR */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0F2040] border border-[#2DD4BF]/30 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-xs sm:text-sm text-[#8B98A8] font-medium leading-relaxed">
            Agencies on AuthPilot save an average of{' '}
            <strong className="text-[#2DD4BF]">18 hours/month</strong> ·{' '}
            <strong className="text-[#2DD4BF]">$540 in coordinator labor</strong> ·{' '}
            <strong className="text-emerald-400">$9,600 in protected revenue per month</strong>
          </p>
        </div>
      </section>

      {/* SECTION 4 — FAQ ACCORDION */}
      <section className="py-12 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#F0F6FC]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#8B98A8]">Everything you need to know about AuthPilot setup, compliance, and billing.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-[#0F2040] border border-[#1E3050] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="text-sm font-bold text-[#F0F6FC]">{faq.q}</span>
                  <span className="text-lg text-[#2DD4BF] font-mono">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-[#8B98A8] leading-relaxed border-t border-[#1E3050]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 5 — BOTTOM CTA STRIP */}
      <section className="py-16 px-6 bg-[#0D1B2E] border-t border-[#1E3050] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-[#F0F6FC]">Ready to cut your PA time by 75%?</h2>
          <p className="text-xs text-[#8B98A8]">
            Start with 5 free authorizations. No credit card required. Setup in 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs px-8 py-4 rounded-xl shadow-xl shadow-[#2DD4BF]/20 transition"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto bg-[#162035] hover:bg-[#2A4060] text-[#F0F6FC] border border-[#1E3050] font-semibold text-xs px-8 py-4 rounded-xl transition"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E3050] py-8 px-6 text-center text-xs text-[#6B7280]">
        <p>© 2026 AuthPilot, LLC. All Rights Reserved. Protected under HIPAA Privacy &amp; Security Rules.</p>
      </footer>
    </div>
  )
}
