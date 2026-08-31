'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function DemoBookedPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-6 flex flex-col items-center justify-center space-y-8">
      {/* Brand Header */}
      <Link href="/">
        <Logo variant="full" size="md" />
      </Link>

      {/* Main Confirmation Card */}
      <div className="bg-[#0F2040] border border-[#2DD4BF]/40 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 text-3xl flex items-center justify-center mx-auto shadow-inner">
          ✓
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] tracking-tight">
            Demo Request Received
          </h1>
          <p className="text-xs sm:text-sm text-[#2DD4BF] font-semibold">
            We&apos;ll reach out within 24 hours to schedule your personalized AuthPilot walkthrough.
          </p>
        </div>

        <p className="text-xs text-[#8B98A8] leading-relaxed">
          In the meantime, explore the live interactive demo to see AuthPilot in action.
        </p>

        <Link
          href="/demo"
          className="w-full block bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-xs py-4 rounded-xl transition shadow-lg shadow-[#2DD4BF]/20"
        >
          Open Live Demo →
        </Link>

        <div className="text-[11px] text-[#6B7280] pt-2">
          Questions? Email us at{' '}
          <a href="mailto:demo@authpilot.app" className="text-[#8B98A8] hover:text-[#2DD4BF] underline">
            demo@authpilot.app
          </a>
        </div>
      </div>
    </div>
  )
}
