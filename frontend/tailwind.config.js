/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#1f4d3d',
        forest: '#163b2f',
        meadow: '#b5d8a7',
        sand: '#f5efe6',
        clay: '#c9895b',
        mist: '#ecf6ee',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(20, 53, 45, 0.12)',
      },
    },
  },
  plugins: [],
}
