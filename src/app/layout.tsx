import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AuthPilot — Prior Authorization AI',
  description: 'AI Prior Authorization Agent for Home Care Agencies (Texas STAR+PLUS focus)',
  icons: {
    icon: '/brand/favicon.ico',
    shortcut: '/brand/favicon.ico',
    apple: '/brand/logo-icon.png',
  },
  openGraph: {
    title: 'AuthPilot — Prior Authorization AI',
    description: 'AI Prior Authorization Agent for Home Care Agencies (Texas STAR+PLUS focus)',
    images: [
      {
        url: '/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuthPilot — AI Prior Authorization for Home Care Agencies',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0A1628] text-[#F0F6FC] font-sans">
        {children}
      </body>
    </html>
  )
}
