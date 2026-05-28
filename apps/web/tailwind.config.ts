import type { Config } from 'tailwindcss';

/*
 * Tailwind v3 config for apps/web (Next.js marketing site).
 *
 * Design tokens are authoritative in @nohotfix/design-tokens/tokens.css.
 * Colors here are expressed as var(--…) references so a single CSS-variable
 * change propagates everywhere without touching Tailwind config.
 *
 * Dark mode: 'class' strategy. The pre-paint script in layout.tsx sets/removes
 * the `dark` class on <html> before first paint (no FOUC).
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ---- Orange scale (primary brand) ---- */
        orange: {
          50: 'var(--color-orange-50)',
          100: 'var(--color-orange-100)',
          200: 'var(--color-orange-200)',
          300: 'var(--color-orange-300)',
          400: 'var(--color-orange-400)',
          500: 'var(--color-orange-500)',
          600: 'var(--color-orange-600)',
          700: 'var(--color-orange-700)',
          800: 'var(--color-orange-800)',
          900: 'var(--color-orange-900)',
          950: 'var(--color-orange-950)',
        },

        /* ---- Semantic: Go (success) ---- */
        go: {
          50: 'var(--color-go-50)',
          100: 'var(--color-go-100)',
          200: 'var(--color-go-200)',
          300: 'var(--color-go-300)',
          400: 'var(--color-go-400)',
          500: 'var(--color-go-500)',
          600: 'var(--color-go-600)',
          700: 'var(--color-go-700)',
          800: 'var(--color-go-800)',
          900: 'var(--color-go-900)',
        },

        /* ---- Semantic: No-Go / Warning ---- */
        nogo: {
          50: 'var(--color-nogo-50)',
          100: 'var(--color-nogo-100)',
          200: 'var(--color-nogo-200)',
          300: 'var(--color-nogo-300)',
          400: 'var(--color-nogo-400)',
          500: 'var(--color-nogo-500)',
          600: 'var(--color-nogo-600)',
          700: 'var(--color-nogo-700)',
          800: 'var(--color-nogo-800)',
          900: 'var(--color-nogo-900)',
        },

        /* ---- Semantic: Error ---- */
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
        },

        /* ---- Neutral slate (scaffolding) ---- */
        slate: {
          50: 'var(--color-slate-50)',
          100: 'var(--color-slate-100)',
          300: 'var(--color-slate-300)',
          400: 'var(--color-slate-400)',
          500: 'var(--color-slate-500)',
          700: 'var(--color-slate-700)',
          900: 'var(--color-slate-900)',
        },

        /* ---- Semantic surface tokens (theme-aware) ---- */
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        'card-elevated': 'var(--bg-card-elevated)',
        'section-alt': 'var(--bg-section-alt)',
        input: 'var(--bg-input)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-link': 'var(--text-link)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'border-focus': 'var(--border-focus)',
        /* Decorative grid-line motif (see globals.css) */
        gridline: 'var(--grid-line)',
        'gridline-strong': 'var(--grid-line-strong)',
      },

      fontFamily: {
        /* display = DM Sans, loaded by next/font and wired to --font-display */
        display: ['var(--font-display)', 'DM Sans', 'Inter', '-apple-system', 'sans-serif'],
        /* body = Inter, loaded by next/font and wired to --font-body */
        body: ['var(--font-body)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        /* mono = Geist Mono, loaded by next/font and wired to --font-mono */
        mono: ['var(--font-mono)', 'Geist Mono', 'JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        sm: 'var(--radius-sm)',   /* 6px  — badges, chips */
        md: 'var(--radius-md)',   /* 10px — inputs, buttons */
        lg: 'var(--radius-lg)',   /* 16px — standard cards */
        xl: 'var(--radius-xl)',   /* 20px — modals, elevated cards */
        '2xl': 'var(--radius-2xl)', /* 28px — marketing hero cards */
      },

      boxShadow: {
        /* Theme-aware card shadows — resolved from CSS vars per light/dark */
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        modal: 'var(--shadow-modal)',
        overlay: 'var(--shadow-overlay)',
      },

      transitionTimingFunction: {
        premium: 'cubic-bezier(0.6, 0.6, 0, 1)',
        page: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
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
          '0%, 100%': { boxShadow: '0 0 8px rgba(234,106,4,0.30)' },
          '50%': { boxShadow: '0 0 8px rgba(234,106,4,0.60)' },
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
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
