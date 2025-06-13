/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ── ANIMATIONS ──────────────────────────────────────────────────
      keyframes: {
        'move-bg': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%':       { backgroundPosition: '100% 100%' },
        },
        'accordion-down': {
          from: { height: 0 },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: 0 },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        }
      },
      animation: {
        'bg-shift':       'move-bg 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },

      // ── BACKGROUND-IMAGE UTILITIES ────────────────────────────────
      backgroundImage: {
        // subtle "to-card" overlay if you still want it
        'to-card': 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))',
        // our animated motif made of three radial gradients
        'theme-motif': `
          radial-gradient(circle at 20% 20%, hsl(var(--tw-gradient-start) / 0.15) 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, hsl(var(--tw-gradient-mid)   / 0.15) 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, hsl(var(--tw-gradient-end)   / 0.10) 0%, transparent 40%)
        `,
      },

      // ── EXPOSE THE CSS VARIABLES AS "GRADIENT STOPS" ───────────────
      gradientColorStops: theme => ({
        'motif-start': theme('colors.primary.DEFAULT'),
        'motif-mid':   theme('colors.secondary.DEFAULT'),
        'motif-end':   theme('colors.accent.DEFAULT'),
      }),
    },
  },
  plugins: [require('tailwindcss-animate')],
}
