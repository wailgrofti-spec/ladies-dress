import type { Config } from 'tailwindcss';

// Design tokens — Ladies Dress
// Palette derived from the brand logo (rose gold + blush) for a
// feminine, premium, reassuring feel without tipping into cliché pink.
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF6F5',
          100: '#FBEAE9', // page background
          200: '#F5D8D4',
        },
        rosegold: {
          300: '#D9A79C',
          400: '#C98374', // primary accent (buttons, links)
          500: '#B76E79', // hover / emphasis
          600: '#9C5A64',
        },
        charcoal: {
          700: '#3A332F',
          800: '#2E2A27', // body text
          900: '#1F1B19',
        },
        gold: {
          400: '#D4A574', // badges / highlights
        },
        admin: {
          bg: '#0F0E0D',
          surface: '#1A1817',
          surface2: '#231F1D',
          border: '#332E2A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'sans-serif'],
      },
      borderRadius: {
        soft: '0.9rem',
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(46,38,34,0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
