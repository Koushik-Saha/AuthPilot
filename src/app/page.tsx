import { Logo } from '@/components/ui'
import { colors } from '@/lib/design-tokens'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A1628] text-[#F0F6FC] p-8 flex flex-col items-center justify-center space-y-12">
      {/* Brand Identity Header */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <Logo variant="full" size="lg" />
        <p className="text-[#8B98A8] text-lg max-w-xl">
          AI Prior Authorization Agent for Home Care Agencies (Texas STAR+PLUS focus)
        </p>
      </div>

      {/* Logo Variants Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Icon Variant</span>
          <Logo variant="icon" size="lg" />
        </div>

        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Full Logo Variant</span>
          <Logo variant="full" size="md" />
        </div>

        <div className="bg-[#0F2040] border border-[#1E3050] rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-semibold text-[#8B98A8] uppercase tracking-wider">Wordmark Variant</span>
          <Logo variant="wordmark" size="md" />
        </div>
      </div>

      {/* Palette Preview */}
      <div className="bg-[#162035] border border-[#1E3050] rounded-2xl p-6 w-full max-w-4xl space-y-4">
        <h3 className="text-sm font-semibold text-[#8B98A8] uppercase tracking-wider">Brand Palette Tokens</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-medium">
          <div className="p-3 rounded-lg bg-[#2DD4BF] text-[#0A1628] font-bold">Teal (#2DD4BF)</div>
          <div className="p-3 rounded-lg bg-[#0F2040] border border-[#1E3050] text-[#2DD4BF]">NavyMid (#0F2040)</div>
          <div className="p-3 rounded-lg bg-[#34D399] text-[#0A1628] font-bold">Approved (#34D399)</div>
          <div className="p-3 rounded-lg bg-[#FBBF24] text-[#0A1628] font-bold">Pending (#FBBF24)</div>
          <div className="p-3 rounded-lg bg-[#F87171] text-[#0A1628] font-bold">Denied (#F87171)</div>
        </div>
      </div>
    </main>
  )
}
