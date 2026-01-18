import { DateTime } from 'luxon';
import type { City, TimeZoneData, HourData } from '../types';
import { HOURS_PER_DAY } from '../constants/layout';

// Cache for timezone abbreviations to avoid repeated lookups
const timezoneAbbrCache = new Map<string, string>();

export const getCurrentTime = (timezone: string): DateTime => {
  try {
    return DateTime.now().setZone(timezone);
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    // Fallback to UTC
    return DateTime.now().setZone('UTC');
  }
};

export const getGMTOffset = (timezone: string): string => {
  const now = getCurrentTime(timezone);
  const offset = now.offset / 60; // Convert minutes to hours
  const sign = offset >= 0 ? '+' : '';
  // Format to show whole numbers or half hours (like World Time Buddy: "GMT-3", "GMT+12")
  const formattedOffset = offset % 1 === 0 ? offset.toString() : offset.toFixed(1);
  return `GMT${sign}${formattedOffset}`;
};

export const getTimezoneAbbreviation = (timezone: string): string => {
  // Check cache first
  if (timezoneAbbrCache.has(timezone)) {
    return timezoneAbbrCache.get(timezone)!;
  }

  const now = getCurrentTime(timezone);
  
  // Try to get abbreviation from Luxon
  try {
    const abbr = now.offsetNameShort;
    if (abbr && abbr.length <= 5) {
      timezoneAbbrCache.set(timezone, abbr);
      return abbr;
    }
  } catch (e) {
    // Ignore errors, fall through to mappings
  }
  
  // Fallback: Extract from timezone string or use common mappings
  const timezoneLower = timezone.toLowerCase();
  
  // Common timezone mappings (static, no need to recalculate)
  const mappings: Record<string, string> = {
    'america/los_angeles': 'PST',
    'america/new_york': 'EST',
    'america/chicago': 'CST',
    'europe/london': 'GMT',
    'europe/paris': 'CET',
    'europe/berlin': 'CET',
    'europe/rome': 'CET',
    'asia/ho_chi_minh': 'GMT+7',
    'asia/singapore': 'SGT',
    'asia/tokyo': 'JST',
    'asia/seoul': 'KST',
    'asia/hong_kong': 'HKT',
    'australia/sydney': 'AEDT',
    'australia/melbourne': 'AEDT',
  };
  
  const result = mappings[timezoneLower] || timezone.split('/').pop()?.toUpperCase().substring(0, 3) || 'UTC';
  timezoneAbbrCache.set(timezone, result);
  return result;
};

/**
 * Calculate hour offset between two timezones
 * Returns positive number if target is ahead of reference
 * Example: SF (GMT-8) to HCM (GMT+7) = +15 hours
 */
export const getTimezoneOffset = (targetTimezone: string, referenceTimezone: string): number => {
  const targetTime = getCurrentTime(targetTimezone);
  const referenceTime = getCurrentTime(referenceTimezone);
  
  // Get offset in minutes, convert to hours
  const targetOffsetMinutes = targetTime.offset;
  const referenceOffsetMinutes = referenceTime.offset;
  
  // Calculate difference in hours
  const offsetHours = (targetOffsetMinutes - referenceOffsetMinutes) / 60;
  
  return Math.round(offsetHours);
};

/**
 * Generate 24 time slots based on reference timezone
 * Each column represents the SAME absolute moment in time
 * Other timezones show their LOCAL hour at that same moment
 */
export const generateTimeSlots = (
  timezone: string,
  _referenceTimezone: string,
  referenceDate: DateTime,
  currentHourInReference: number
): HourData[] => {
  const slots: HourData[] = [];
  const referenceDay = referenceDate.day;

  for (let columnIndex = 0; columnIndex < HOURS_PER_DAY; columnIndex++) {
    // Calculate absolute time for this column (in reference timezone)
    const absoluteTime = referenceDate.startOf('day').plus({ hours: columnIndex });
    
    // Convert to target timezone
    const localTime = absoluteTime.setZone(timezone);
    const localHour = localTime.hour;
    const localDay = localTime.day;
    const localDate = localTime.toJSDate();
    
    // Display label
    const displayLabel = localTime.toFormat('HH:mm');
    
    // Determine if this is a different day
    const isNextDay = localDay > referenceDay || (localDay === 1 && referenceDay > 28);
    const isPreviousDay = localDay < referenceDay && !isNextDay;
    
    // Date labels for timeline header - only show at midnight (localHour === 0)
    const dayName = localTime.toFormat('EEE').toUpperCase(); // "SAT", "SUN", etc.
    const dateLabel = localTime.toFormat('MMM dd').toUpperCase(); // "JAN 18", "JAN 19", etc. (uppercase, 2-digit day with leading zero)
    const showDateLabel = localHour === 0; // Only show at midnight (hour 0)
    
    // Business hours (9am-5pm) in local time
    const isBusinessHour = localHour >= 9 && localHour < 17;
    
    // Current hour: matches the current hour in reference timezone
    const isCurrentHour = columnIndex === currentHourInReference;

    slots.push({
      columnIndex,
      referenceHour: columnIndex,
      localHour,
      localDate,
      displayLabel,
      isNextDay,
      isPreviousDay,
      isBusinessHour,
      isCurrentHour,
      dayName,
      dateLabel,
      isNewDay: showDateLabel, // Only true when localHour === 0
    });
  }

  return slots;
};

export const getTimeZoneData = (
  city: City,
  referenceTimezone: string,
  referenceDate: DateTime,
  currentHourInReference: number,
  isReference: boolean
): TimeZoneData => {
  const currentTime = getCurrentTime(city.timezone);
  const gmtOffset = getGMTOffset(city.timezone);
  const timezoneAbbr = getTimezoneAbbreviation(city.timezone);
  const hours = generateTimeSlots(
    city.timezone,
    referenceTimezone,
    referenceDate,
    currentHourInReference
  );

  // Format time: 24-hour format (e.g., "21:33" instead of "9:33p") - shorter and clearer
  const hour24 = currentTime.hour;
  const minute = currentTime.minute;
  const formattedTime = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  // Format date: "Sat, Jan 17"
  const dayOfWeek = currentTime.toFormat('EEE'); // "Sat", "Sun", etc.
  const monthDay = currentTime.toFormat('MMM d'); // "Jan 17", "Jan 18", etc.
  const formattedDate = `${dayOfWeek}, ${monthDay}`;
  
  // Keep full formatted time for backward compatibility (for display in sidebar)
  const fullFormattedTime = `${formattedTime} ${formattedDate}`;

  // Calculate offset from reference timezone
  const offsetFromReference = isReference ? 0 : getTimezoneOffset(city.timezone, referenceTimezone);

  return {
    city,
    currentTime: currentTime.toFormat('HH:mm:ss'),
    formattedTime: fullFormattedTime,
    formattedDate,
    dayOfWeek,
    gmtOffset,
    timezoneAbbr,
    hours,
    isReference,
    offsetFromReference,
  };
};
