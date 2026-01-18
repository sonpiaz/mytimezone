import { useMemo } from 'react';
import { DateTime } from 'luxon';
import type { City } from '../types';
import { CITIES } from '../constants/cities';
import { getGMTOffset } from '../utils/timezoneHelpers';

interface CityPickerProps {
  selectedCities: City[];
  onAddCity: (city: City) => void;
  t: (key: string) => string;
}

// Calculate UTC offset in hours for sorting
const getUTCOffset = (timezone: string): number => {
  const now = DateTime.now().setZone(timezone);
  return now.offset / 60; // Convert minutes to hours
};

// Format city display with timezone
const formatCityOption = (city: City): string => {
  const offsetLabel = getGMTOffset(city.timezone);
  const locationParts = [city.name];
  
  if (city.state && (city.country === 'USA' || city.country === 'United States')) {
    locationParts.push(city.state);
  }
  locationParts.push(city.country);
  
  return `${offsetLabel} · ${locationParts.join(', ')}`;
};

export const CityPicker = ({ selectedCities, onAddCity, t }: CityPickerProps) => {
  // Filter out already selected cities and sort by UTC offset
  const availableCities = useMemo(() => {
    const filtered = CITIES.filter(
      city => !selectedCities.some(selected => selected.id === city.id)
    );
    
    // Sort by UTC offset (from -12 to +14)
    return filtered.sort((a, b) => {
      const offsetA = getUTCOffset(a.timezone);
      const offsetB = getUTCOffset(b.timezone);
      return offsetA - offsetB;
    });
  }, [selectedCities]);

  if (availableCities.length === 0) {
    return null;
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    if (cityId) {
      const city = CITIES.find(c => c.id === cityId);
      if (city) {
        onAddCity(city);
        e.target.value = ''; // Reset select
      }
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="city-select" className="block text-sm font-medium text-notion-text mb-2">
        {t('addCity')}
      </label>
      <select
        id="city-select"
        onChange={handleSelect}
        className="w-full max-w-xs px-3 py-2.5 bg-white border border-notion-border rounded-lg text-sm text-notion-text shadow-notion-sm focus:outline-none focus:ring-2 focus:ring-notion-accent/20 focus:border-notion-accent transition-notion cursor-pointer"
      >
        <option value="" className="text-notion-textLighter">+ {t('selectCity')}</option>
        {availableCities.map((city) => (
          <option key={city.id} value={city.id} className="text-notion-text">
            {formatCityOption(city)}
          </option>
        ))}
      </select>
    </div>
  );
};
