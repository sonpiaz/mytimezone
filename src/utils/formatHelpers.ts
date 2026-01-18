import type { City, TimeZoneData } from '../types';

/**
 * Format location display string
 * Example: "United States, California" or "Vietnam"
 */
export const formatLocation = (city: City): string => {
  if (city.state && (city.country === 'USA' || city.country === 'United States')) {
    return `${city.country}, ${city.state}`;
  }
  return city.country;
};

/**
 * Format offset display from reference timezone
 * Example: "+15", "+8", "-6", or null if same as reference
 */
export const formatOffset = (data: TimeZoneData): string | null => {
  if (data.offsetFromReference !== undefined && data.offsetFromReference !== 0) {
    return `${data.offsetFromReference >= 0 ? '+' : ''}${data.offsetFromReference}`;
  }
  return null;
};

/**
 * Extract time only from formatted time string (24h format)
 * Example: "21:33" from "21:33 Sat, Jan 17"
 */
export const getTimeOnly = (formattedTime: string): string => {
  return formattedTime.split(' ')[0];
};

import { getHourColorSmooth } from './colorUtils';

/**
 * Get time-of-day background color with smooth gradient transitions
 * Returns hex color string for inline style
 * @param hour Hour in local timezone (0-23)
 * @returns Hex color string
 */
export const getTimeOfDayColor = (hour: number): string => {
  return getHourColorSmooth(hour);
};

/**
 * Get time-of-day text color based on background brightness
 * @param hour Hour in local timezone (0-23)
 * @returns Tailwind text color class
 */
export const getTimeOfDayTextColor = (hour: number): string => {
  // Business hours (8-17): darker text for better contrast
  if (hour >= 8 && hour <= 17) {
    return 'text-notion-text';
  }
  // Other hours: lighter text
  return 'text-notion-textLight';
};

/**
 * Get time-of-day styling classes (for hover states)
 * Note: Background color is now applied via inline style, not Tailwind classes
 */
export const getTimeOfDayStyle = (
  hour: number,
  isCurrentHour: boolean,
  isHovered: boolean
): string => {
  // Hover state (but not current hour - current hour uses border line)
  if (isHovered && !isCurrentHour) {
    return 'bg-notion-hover text-notion-text';
  }

  // Text color based on hour
  return getTimeOfDayTextColor(hour);
};
