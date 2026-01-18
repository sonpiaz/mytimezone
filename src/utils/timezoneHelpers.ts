import { DateTime } from 'luxon';
import type { City, TimeZoneData, HourData } from '../types';

export const getCurrentTime = (timezone: string): DateTime => {
  return DateTime.now().setZone(timezone);
};

export const getGMTOffset = (timezone: string): string => {
  const now = getCurrentTime(timezone);
  const offset = now.offset / 60; // Convert minutes to hours
  const sign = offset >= 0 ? '+' : '';
  // Format to show whole numbers or half hours
  const formattedOffset = offset % 1 === 0 ? offset.toString() : offset.toFixed(1);
  return `GMT${sign}${formattedOffset}`;
};

export const generateHours = (timezone: string): HourData[] => {
  const now = getCurrentTime(timezone);
  const currentHour = now.hour;
  const hours: HourData[] = [];

  for (let i = 0; i < 24; i++) {
    const hourTime = now.startOf('day').plus({ hours: i });
    const isCurrentHour = i === currentHour;
    const isWorkingHours = i >= 9 && i < 17; // 9 AM to 5 PM

    hours.push({
      hour: i,
      time: hourTime.toFormat('HH:mm'),
      isCurrentHour,
      isWorkingHours,
    });
  }

  return hours;
};

export const getTimeZoneData = (city: City): TimeZoneData => {
  const currentTime = getCurrentTime(city.timezone);
  const gmtOffset = getGMTOffset(city.timezone);
  const hours = generateHours(city.timezone);

  return {
    city,
    currentTime: currentTime.toFormat('HH:mm:ss'),
    gmtOffset,
    hours,
  };
};
