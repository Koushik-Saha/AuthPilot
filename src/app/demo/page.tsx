'use client'

import React from 'react'
import DashboardPage from '../(dashboard)/page'

export default function SalesDemoRoutePage() {
  return (
    <div className="relative">
      <div className="bg-[#2DD4BF] text-[#0A1628] font-bold text-xs text-center py-2 border-b border-[#2DD4BF]/50">
        🚀 AUTHPILOT INTERACTIVE SALES DEMO — Pre-populated with Sunrise Home Care Austin sample data
      </div>
      <DashboardPage />
    </div>
  )
}
