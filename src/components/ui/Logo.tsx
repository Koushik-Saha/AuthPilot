import React from 'react'
import Image from 'next/image'

export interface LogoProps {
  variant?: 'icon' | 'full' | 'wordmark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  icon: {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  },
  full: {
    sm: { width: 150, height: 50 },
    md: { width: 210, height: 70 },
    lg: { width: 300, height: 100 },
  },
  wordmark: {
    sm: { fontSize: '1.25rem', subSize: '0.65rem' },
    md: { fontSize: '1.75rem', subSize: '0.85rem' },
    lg: { fontSize: '2.5rem', subSize: '1.1rem' },
  },
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  if (variant === 'icon') {
    const dim = sizeMap.icon[size]
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Image
          src="/brand/logo-icon.png"
          alt="AuthPilot Logo Icon"
          width={dim.width}
          height={dim.height}
          priority
          className="object-contain"
        />
      </div>
    )
  }

  if (variant === 'full') {
    const dim = sizeMap.full[size]
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Image
          src="/brand/logo-full.png"
          alt="AuthPilot — Prior Authorization AI"
          width={dim.width}
          height={dim.height}
          priority
          className="object-contain"
        />
      </div>
    )
  }

  // Wordmark variant
  const typography = sizeMap.wordmark[size]
  return (
    <div className={`flex flex-col justify-center ${className}`}>
      <div className="font-extrabold tracking-tight" style={{ fontSize: typography.fontSize }}>
        <span className="text-[#F0F6FC]">Auth</span>
        <span className="text-[#2DD4BF]">Pilot</span>
      </div>
      <span className="font-medium text-[#8B98A8] tracking-wide" style={{ fontSize: typography.subSize }}>
        Prior Authorization AI
      </span>
    </div>
  )
}
