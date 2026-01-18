import { useEffect, useState } from 'react';
import type { City, TimeZoneData } from '../types';
import { getTimeZoneData } from '../utils/timezoneHelpers';

export const useTimezones = (cities: City[]) => {
  const [timezoneData, setTimezoneData] = useState<TimeZoneData[]>([]);

  useEffect(() => {
    // Update timezone data for all cities
    const data = cities.map(city => getTimeZoneData(city));
    setTimezoneData(data);

    // Update every minute to keep time current
    const interval = setInterval(() => {
      const updatedData = cities.map(city => getTimeZoneData(city));
      setTimezoneData(updatedData);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [cities]);

  return timezoneData;
};
