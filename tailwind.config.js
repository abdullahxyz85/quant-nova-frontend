/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0E17',
          panel: '#111827',
          elevated: '#1A2030',
          hover: '#1F2937',
        },
        border: {
          DEFAULT: '#1F2937',
          subtle: '#151B26',
          strong: '#374151',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        profit: {
          DEFAULT: '#10B981',
          dim: '#065F46',
          glow: 'rgba(16,185,129,0.15)',
        },
        loss: {
          DEFAULT: '#EF4444',
          dim: '#7F1D1D',
          glow: 'rgba(239,68,68,0.15)',
        },
        warn: {
          DEFAULT: '#F59E0B',
          dim: '#78350F',
          glow: 'rgba(245,158,11,0.15)',
        },
        info: {
          DEFAULT: '#3B82F6',
          dim: '#1E40AF',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          dim: '#5B21B6',
          glow: 'rgba(139,92,246,0.18)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'panel-header': ['11px', { lineHeight: '16px', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      animation: {
        'pulse-once': 'pulseOnce 150ms ease-out',
        'border-travel': 'borderTravel 2s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'dot-pulse': 'dotPulse 1.5s ease-in-out infinite',
        'neon-border': 'neonBorder 5s linear infinite',
        'glow-float': 'glowFloat 8s ease-in-out infinite',
      },
      keyframes: {
        pulseOnce: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        borderTravel: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        dotPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        neonBorder: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '220% 50%' },
        },
        glowFloat: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(18px, 22px, 0) scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
