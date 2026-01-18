import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import type { City, TimeZoneData } from '../types';
import { getTimeZoneData } from '../utils/timezoneHelpers';

export const useTimezones = (cities: City[]) => {
  const [timezoneData, setTimezoneData] = useState<TimeZoneData[]>([]);
  const [currentHourColumn, setCurrentHourColumn] = useState(0);

  useEffect(() => {
    if (cities.length === 0) {
      setTimezoneData([]);
      return;
    }

    // Use first city as reference timezone
    const referenceTimezone = cities[0].timezone;
    const referenceNow = DateTime.now().setZone(referenceTimezone);
    const referenceDate = referenceNow.startOf('day');
    const currentHour = referenceNow.hour;

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

    // Update every minute to keep time current
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
  }, [cities]);

  return { timezoneData, currentHourColumn };
};
