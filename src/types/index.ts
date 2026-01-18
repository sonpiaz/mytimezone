export interface City {
  id: string;
  name: string;
  nameVi: string;
  country: string;
  state?: string; // State/Province (optional)
  timezone: string; // IANA format
  slug: string; // for URL
}

export interface TimeZoneData {
  city: City;
  currentTime: string;
  formattedTime: string; // e.g., "5:55p Sat, Jan 17"
  formattedDate: string; // e.g., "Sat, Jan 17"
  dayOfWeek: string; // e.g., "Sat"
  gmtOffset: string;
  timezoneAbbr: string; // e.g., "PST", "GMT", "CET"
  hours: HourData[];
  isReference: boolean; // True if this is the reference timezone
  offsetFromReference?: number; // Hour offset from reference timezone (e.g., +15, +8, -6)
}

export interface HourData {
  columnIndex: number; // 0-23, position in the grid
  referenceHour: number; // Hour in reference timezone (0-23)
  localHour: number; // Hour in this timezone's local time (0-23)
  localDate: Date; // Full date/time in this timezone
  displayLabel: string; // "6:00", "18:00", etc.
  isNextDay: boolean; // True if this is next day from reference
  isPreviousDay: boolean; // True if this is previous day from reference
  isBusinessHour: boolean; // True if 9am-5pm local time
  isCurrentHour: boolean; // True if this is current hour in reference timezone
  dayName?: string; // "SAT", "SUN", "MON" etc. for date labels
  dateLabel?: string; // "JAN 17", "JAN 18" etc. for date labels
  isNewDay?: boolean; // True if this is the start of a new day (for showing date label)
}

export type Language = 'vi' | 'en';
