// Design System - Modern Minimalism (Notion/Tally/Linear Style)
export const colors = {
  // Backgrounds
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  bgTertiary: '#F7F7F5',
  
  // Text (Notion-style)
  textPrimary: '#37352F',
  textSecondary: '#787774',
  textTertiary: '#9B9A97',
  textPlaceholder: '#C4C4C0',
  
  // Borders & Dividers
  border: '#E9E9E7',
  borderLight: '#F1F1EF',
  divider: '#EBEBEA',
  
  // Accent
  accentBlue: '#2F81F7',
  accentBlueLight: '#E8F1FD',
  accentGreen: '#0F7B6C',
  accentGreenLight: '#E6F4F1',
  
  // Time-of-day (softer pastels)
  hourNight: '#F7F7F5',        // 0-7h: very light warm gray
  hourBusiness: '#EDF7ED',     // 8-17h: very light green
  hourEvening: '#FEF9EC',      // 17-21h: very light amber
  hourLateNight: '#F5F5F4',    // 21-24h: light cool gray
  
  // Current hour (không dùng bg đậm, chỉ dùng border)
  currentHourBorder: '#D0D0D0',
  
  // Hover states
  hoverBg: '#F5F5F5',
  
  // Shadows
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.04)',
  shadowMd: '0 2px 8px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 4px 16px rgba(0, 0, 0, 0.12)',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSizes: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  letterSpacing: '-0.01em',
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
};

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};
