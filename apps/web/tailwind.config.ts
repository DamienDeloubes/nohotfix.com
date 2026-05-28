import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#080412',
          900: '#0D0920',
          800: '#130F2E',
          700: '#1A1640',
          600: '#231E54',
        },
        blue: {
          600: '#0028CC',
          500: '#0036FF',
          400: '#3361FF',
          300: '#6688FF',
          200: '#99AAFF',
          100: '#E0E6FF',
        },
        go: {
          600: '#009962',
          500: '#00CC80',
          400: '#00E591',
          100: '#D0FAE9',
        },
        nogo: {
          600: '#CC6200',
          500: '#F59E0B',
          400: '#FBB73A',
          100: '#FEF3C7',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', '-apple-system', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'shadow-1': '0 1px 3px rgba(0,0,0,.30), 0 1px 0 rgba(255,255,255,.06) inset',
        'shadow-2': '0 4px 16px rgba(0,0,0,.40), 0 1px 0 rgba(255,255,255,.10) inset',
        'shadow-3': '0 8px 40px rgba(0,0,0,.50), 0 1px 0 rgba(255,255,255,.14) inset',
        'shadow-4': '0 16px 64px rgba(0,0,0,.60), 0 1px 0 rgba(255,255,255,.18) inset',
        'glass-card': '0 1px 0 0 rgba(255,255,255,0.10) inset, 0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.40)',
        'glass-elevated': '0 1px 0 0 rgba(255,255,255,0.18) inset, 0 0 0 1px rgba(255,255,255,0.08) inset, 0 8px 40px rgba(0,0,0,0.50)',
      },
      animation: {
        shimmer: 'shimmer 2.5s ease-out forwards',
        'shimmer-short': 'shimmer 1.5s ease-out forwards',
        'fade-in': 'fadeIn 600ms ease-out forwards',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'slide-in-left': 'slideInLeft 500ms ease-out forwards',
        'slide-in-right': 'slideInRight 500ms ease-out forwards',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'lock-glow': 'lockGlow 2s ease-in-out infinite',
        'scale-in': 'scaleIn 400ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'draw-line': 'drawLine 400ms ease-out forwards',
        'orbit-slow': 'orbit 12s linear infinite',
        'orbit-slower': 'orbit 18s linear infinite reverse',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.30' },
        },
        lockGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245,158,11,0.30)' },
          '50%': { boxShadow: '0 0 8px rgba(245,158,11,0.60)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        drawLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.6, 0.6, 0, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
