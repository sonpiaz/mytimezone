import { timeColors } from '../constants/timeColors';

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB to hex color
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

/**
 * Interpolate between two colors
 * @param color1 Start color (hex)
 * @param color2 End color (hex)
 * @param progress Progress from 0 to 1 (0 = color1, 1 = color2)
 * @returns Interpolated color (hex)
 */
export const interpolateColor = (
  color1: string,
  color2: string,
  progress: number
): string => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = c1.r + (c2.r - c1.r) * clampedProgress;
  const g = c1.g + (c2.g - c1.g) * clampedProgress;
  const b = c1.b + (c2.b - c1.b) * clampedProgress;

  return rgbToHex(r, g, b);
};

/**
 * Get hour background color with smooth gradient transitions
 * Simplified to 2-3 colors: Gray (night) and Blue-Green (day)
 * @param localHour Hour in local timezone (0-23)
 * @returns Hex color string
 */
export const getHourColorSmooth = (localHour: number): string => {
  const { night, morning, afternoon } = timeColors;

  // ========== NIGHT: 0-6h, 22-23h (Gray) ==========
  if (localHour <= 6 || localHour >= 22) {
    return night;
  }

  // ========== TRANSITION: 7h (Night → Morning) ==========
  if (localHour === 7) {
    return interpolateColor(night, morning, 0.5);
  }

  // ========== MORNING: 8-13h (Green) ==========
  if (localHour >= 8 && localHour <= 13) {
    return morning;
  }

  // ========== TRANSITION: 14h (Morning → Afternoon) ==========
  if (localHour === 14) {
    return interpolateColor(morning, afternoon, 0.5);
  }

  // ========== AFTERNOON: 15-19h (Blue) ==========
  if (localHour >= 15 && localHour <= 19) {
    return afternoon;
  }

  // ========== TRANSITION: 20-21h (Afternoon → Night) ==========
  if (localHour === 20) {
    return interpolateColor(afternoon, night, 0.33);
  }
  if (localHour === 21) {
    return interpolateColor(afternoon, night, 0.66);
  }

  return night;
};
