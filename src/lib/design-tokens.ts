export const colors = {
  // Brand
  teal:      '#2DD4BF',
  tealDim:   '#1A8C80',
  tealGlow:  'rgba(45,212,191,0.12)',
  navy:      '#0A1628',
  navyMid:   '#0F2040',

  // Surfaces (dark theme — coordinators often work at night)
  bg:        '#0A1628',
  surface:   '#0F2040',
  card:      '#162035',
  border:    '#1E3050',
  borderLt:  '#2A4060',

  // Text
  textPri:   '#F0F6FC',
  textSec:   '#8B98A8',
  textMut:   '#4A6080',

  // Status colors
  approved:  '#34D399',
  pending:   '#FBBF24',
  denied:    '#F87171',
  draft:     '#8B98A8',
  submitted: '#60A5FA',

  // Severity
  critical:  '#F87171',
  warning:   '#F59E0B',
  info:      '#60A5FA',
  success:   '#34D399',
} as const

export const spacing = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 } as const
export const radius  = { sm:6, md:10, lg:14, xl:20, full:9999 } as const
export const fontSize = { xs:11, sm:13, md:15, lg:18, xl:24, xxl:32, hero:48 } as const
