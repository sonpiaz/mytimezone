import type { City } from '../types';
import { CITIES } from '../constants/cities';

interface CityPickerProps {
  selectedCities: City[];
  onAddCity: (city: City) => void;
  t: (key: string) => string;
}

export const CityPicker = ({ selectedCities, onAddCity, t }: CityPickerProps) => {
  const availableCities = CITIES.filter(
    city => !selectedCities.some(selected => selected.id === city.id)
  );

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
      <label htmlFor="city-select" className="block text-sm font-medium text-apple-dark mb-2">
        {t('addCity')}
      </label>
      <select
        id="city-select"
        onChange={handleSelect}
        className="w-full md:w-auto px-4 py-2.5 border border-apple-border rounded-apple-sm bg-white text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-apple"
      >
        <option value="">{t('selectCity')}</option>
        {availableCities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name} ({city.country})
          </option>
        ))}
      </select>
    </div>
  );
};
