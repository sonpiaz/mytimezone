import { useState, useEffect } from 'react';
import type { City } from '../types';
import { getCitiesFromUrl, updateUrlParams } from '../utils/urlHelpers';
import { getCitiesBySlugs } from '../constants/cities';

const STORAGE_KEY = 'my-timezone-cities-order';

export const useUrlState = (): [City[], (cities: City[]) => void] => {
  const [cities, setCities] = useState<City[]>(() => {
    // Try URL first, then localStorage, then default
    const urlSlugs = getCitiesFromUrl();
    if (urlSlugs.length > 0) {
      return getCitiesBySlugs(urlSlugs);
    }
    
    // Try localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const slugs = JSON.parse(stored);
        const cities = getCitiesBySlugs(slugs);
        if (cities.length > 0) {
          return cities;
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Default cities
    return getCitiesBySlugs(['san-francisco', 'london', 'ho-chi-minh']);
  });

  const updateCities = (newCities: City[]) => {
    setCities(newCities);
    updateUrlParams(newCities);
    
    // Also save to localStorage
    try {
      const slugs = newCities.map(c => c.slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch (e) {
      // Ignore localStorage errors
    }
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
