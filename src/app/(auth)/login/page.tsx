'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F2040] border border-[#1E3050] rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="icon" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Welcome to AuthPilot</h1>
          <p className="text-xs text-[#8B98A8]">
            HIPAA-compliant Prior Authorization AI Platform for Texas Medicaid Agencies
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">📩</div>
            <h2 className="text-base font-bold text-emerald-400">Check your email</h2>
            <p className="text-xs text-emerald-200/80">
              We sent a secure passwordless login link to <strong className="text-white">{email}</strong>.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block text-xs font-bold text-[#0A1628] bg-[#2DD4BF] hover:bg-[#1A8C80] px-4 py-2.5 rounded-xl transition"
              >
                Go to Dashboard Demo →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#8B98A8] mb-1.5">
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@agency.com"
                className="w-full h-12 bg-[#0A1628] border border-[#1E3050] focus:border-[#2DD4BF] text-[#F0F6FC] rounded-xl px-4 text-sm outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#2DD4BF] hover:bg-[#1A8C80] text-[#0A1628] font-bold text-sm rounded-xl transition shadow-lg shadow-[#2DD4BF]/20 flex items-center justify-center"
            >
              {isLoading ? 'Sending Login Link...' : 'Send Secure Login Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#1E3050]">
          <p className="text-xs text-[#6B7280]">
            First time? Your agency administrator will send you an invite link.
          </p>
        </div>
      </div>
    </div>
  )
}
