/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion-style colors
        notion: {
          text: '#37352F',
          textLight: '#787774',
          textLighter: '#9B9A97',
          textPlaceholder: '#C4C4C0',
          border: '#E9E9E7',
          borderLight: '#F1F1EF',
          divider: '#EBEBEA',
          bg: '#FAFAFA',
          bgSecondary: '#F7F7F5',
          hover: '#F5F5F5',
          accent: '#2F81F7',
          accentLight: '#E8F1FD',
          // Status colors (muted)
          success: '#0F7B0F',
          successBg: '#DDEDEA',
          warning: '#B35C00', // Muted orange (not red!)
          warningBg: '#FFEFD6', // Warm beige
          neutral: '#787774',
          neutralBg: '#F1F1EF',
          // Primary button
          primary: '#37352F',
          primaryHover: '#5A5A5A',
        },
        // Time-of-day colors (softer pastels)
        hour: {
          night: '#F7F7F5',
          business: '#EDF7ED',
          evening: '#FEF9EC',
          lateNight: '#F5F5F4',
        },
        // Legacy Apple colors (for backward compatibility)
        apple: {
          blue: '#0071E3',
          green: '#34C759',
          dark: '#1D1D1F',
          border: '#D2D2D7',
          bg: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        sm: ['13px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        base: ['14px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        lg: ['16px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        xl: ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'notion-sm': '4px',
        'notion-md': '6px',
        'notion-lg': '8px',
        'notion-xl': '12px',
        'apple': '12px',
        'apple-sm': '8px',
      },
      boxShadow: {
        'notion-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'notion-md': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'notion-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      transitionDuration: {
        'notion': '150ms',
      },
      transitionTimingFunction: {
        'notion': 'ease-out',
      },
    },
  },
  plugins: [],
}
