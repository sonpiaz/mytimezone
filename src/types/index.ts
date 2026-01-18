export interface City {
  id: string;
  name: string;
  nameVi: string;
  country: string;
  timezone: string; // IANA format
  slug: string; // for URL
}

export interface TimeZoneData {
  city: City;
  currentTime: string;
  gmtOffset: string;
  hours: HourData[];
}

export interface HourData {
  hour: number;
  time: string;
  isCurrentHour: boolean;
  isWorkingHours: boolean; // 9-17
}

export type Language = 'vi' | 'en';
