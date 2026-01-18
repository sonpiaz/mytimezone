/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071E3',
          green: '#34C759',
          dark: '#1D1D1F',
          border: '#D2D2D7',
          bg: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-sm': '8px',
      },
      boxShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
