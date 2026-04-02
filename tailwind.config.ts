import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hormadi: {
          // ─── Greens (from official charter) ───
          dark: '#012e24',       // Vert Foncé — primary dark bg
          forest: '#00664f',     // Vert Forêt — secondary bg / surfaces
          ocean: '#009681',      // Vert Océan — accent / interactive
          ice: '#a8d7d2',        // Vert Glace — light accents / highlights
          // ─── Red ───
          red: '#e4002b',        // Rouge Basque — CTAs, highlights, scores
          // ─── Neutrals ───
          black: '#0a0a0a',      // Near black — deepest bg
          white: '#FFFFFF',
          surface: '#021f19',    // Dark green surface for cards
          border: '#0a3d30',     // Border color (dark green)
          muted: '#8aafa6',      // Muted text on dark green
          // ─── Status ───
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Glacial Indifference', 'system-ui', 'sans-serif'],
        display: ['Anton', 'League Gothic', 'system-ui', 'sans-serif'],
        heading: ['Contrail One', 'Anton', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
