import { useState, useEffect } from 'react';
import type { City } from '../types';
import { getCitiesFromUrl, updateUrlParams } from '../utils/urlHelpers';
import { getCitiesBySlugs } from '../constants/cities';

export const useUrlState = (): [City[], (cities: City[]) => void] => {
  const [cities, setCities] = useState<City[]>(() => {
    const slugs = getCitiesFromUrl();
    return getCitiesBySlugs(slugs);
  });

  const updateCities = (newCities: City[]) => {
    setCities(newCities);
    updateUrlParams(newCities);
  };

  // Listen for URL changes (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const slugs = getCitiesFromUrl();
      const newCities = getCitiesBySlugs(slugs);
      setCities(newCities);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [cities, updateCities];
};
