/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medico': {
          dark: '#1E3A5F',
          medium: '#3B82F6',
          light: '#EFF6FF',
        }
      }
    },
  },
  plugins: [],
}