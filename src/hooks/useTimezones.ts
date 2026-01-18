import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import type { City, TimeZoneData } from '../types';
import { getTimeZoneData } from '../utils/timezoneHelpers';

export const useTimezones = (cities: City[], selectedDate?: Date) => {
  const [timezoneData, setTimezoneData] = useState<TimeZoneData[]>([]);
  const [currentHourColumn, setCurrentHourColumn] = useState(0);

  useEffect(() => {
    if (cities.length === 0) {
      setTimezoneData([]);
      return;
    }

    // Use first city as reference timezone
    const referenceTimezone = cities[0].timezone;
    
    // Use selectedDate if provided, otherwise use current time
    const now = DateTime.now().setZone(referenceTimezone);
    const today = now.startOf('day');
    
    // If selectedDate is provided, check if it's today
    const selectedDateTime = selectedDate 
      ? DateTime.fromJSDate(selectedDate).setZone(referenceTimezone).startOf('day')
      : null;
    
    const isSelectedDateToday = selectedDateTime?.hasSame(today, 'day');
    
    // If selectedDate is today, use current hour; otherwise start from 0h
    const referenceDate = selectedDateTime || today;
    const currentHour = isSelectedDateToday ? now.hour : 0; // Start from 0h if not today

    setCurrentHourColumn(currentHour);

    // Update timezone data for all cities
    const data = cities.map((city, index) =>
      getTimeZoneData(
        city,
        referenceTimezone,
        referenceDate,
        currentHour,
        index === 0 // First city is reference
      )
    );
    setTimezoneData(data);

    // Update every minute to keep time current (only if viewing today)
    if (isSelectedDateToday) {
      const interval = setInterval(() => {
        const newReferenceNow = DateTime.now().setZone(referenceTimezone);
        const newReferenceDate = newReferenceNow.startOf('day');
        const newCurrentHour = newReferenceNow.hour;

        setCurrentHourColumn(newCurrentHour);

        const updatedData = cities.map((city, index) =>
          getTimeZoneData(
            city,
            referenceTimezone,
            newReferenceDate,
            newCurrentHour,
            index === 0
          )
        );
        setTimezoneData(updatedData);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [cities, selectedDate]);

  return { timezoneData, currentHourColumn };
};
