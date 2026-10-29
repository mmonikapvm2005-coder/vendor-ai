/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F4EFE6',
          300: '#EADFCF',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EAE3D7',
          300: '#DCD1C0',
          400: '#C2B099',
          500: '#9E886D',
        },
        navy: {
          700: '#163A69',
          800: '#0E294B',
          900: '#0A1D37',
          950: '#061325',
        }
      }
    },
  },
  plugins: [],
}
