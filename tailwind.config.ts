import type { Config } from 'tailwindcss'
import { colors } from './src/lib/design-tokens'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: colors.teal,
          tealDim: colors.tealDim,
          tealGlow: colors.tealGlow,
          navy: colors.navy,
          navyMid: colors.navyMid,
        },
        surface: {
          DEFAULT: colors.surface,
          bg: colors.bg,
          card: colors.card,
          border: colors.border,
          borderLt: colors.borderLt,
        },
        text: {
          primary: colors.textPri,
          secondary: colors.textSec,
          muted: colors.textMut,
        },
        status: {
          approved: colors.approved,
          pending: colors.pending,
          denied: colors.denied,
          draft: colors.draft,
          submitted: colors.submitted,
        },
        severity: {
          critical: colors.critical,
          warning: colors.warning,
          info: colors.info,
          success: colors.success,
        },
      },
    },
  },
  plugins: [],
}

export default config
