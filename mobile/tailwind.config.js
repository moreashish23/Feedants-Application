/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    screens: {
      sm: '380px',
      md: '600px',
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F6B5C',
          dark: '#0B5347',
        },
        'teal-surface': {
          DEFAULT: '#E7F4F1',
          strong: '#D3EDE7',
          border: '#BFE2DA',
        },
        navy: {
          DEFAULT: '#12203A',
          muted: '#4B5A72',
        },
        ink: {
          secondary: '#6B7686',
          muted: '#93A0AF',
        },
        surface: '#F5F7F8',
        line: '#E7EAEE',
        gold: '#D4A017',
        silver: '#9AA5B1',
        bronze: '#C6803D',
        danger: {
          DEFAULT: '#C0392B',
          surface: '#FBEAE8',
        },
      },
    },
  },
  plugins: [],
};