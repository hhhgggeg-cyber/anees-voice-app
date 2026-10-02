/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'amiri': ['"Amiri"', 'serif'],
        'cairo': ['"Cairo"', 'sans-serif'],
        'naskh': ['"Noto Naskh Arabic"', 'serif'],
      },
      colors: {
        emerald: {
          950: '#022c22',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
        },
        gold: {
          600: '#b8860b',
          500: '#daa520',
          400: '#d4af37',
          300: '#e6c84e',
          200: '#f0d97c',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf8f0',
          200: '#f5f0e1',
        },
        charcoal: {
          900: '#0a0f0d',
          800: '#111a17',
          700: '#1a2622',
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.7' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
