/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { navy: { DEFAULT: '#1A3A5C', dark: '#0D1B2A' }, gold: '#C9A227', mist: '#EEF3F8', line: '#C8D8E8' } } },
  plugins: [],
};
