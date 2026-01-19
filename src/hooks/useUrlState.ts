import { useState, useEffect } from 'react';
import type { City } from '../types';
import { getCitiesFromUrl, updateUrlParams } from '../utils/urlHelpers';
import { getCitiesBySlugs } from '../constants/cities';
import { getDefaultCities } from '../utils/timezoneDetect';
import { saveCities, loadCities } from '../utils/storageHelpers';

// Keep old key for backward compatibility, but also use new helper functions
const STORAGE_KEY = 'my-timezone-cities-order';

export const useUrlState = (): [City[], (cities: City[]) => void] => {
  const [cities, setCities] = useState<City[]>(() => {
    // 1. Check URL params first (highest priority)
    const urlSlugs = getCitiesFromUrl();
    if (urlSlugs.length > 0) {
      const urlCities = getCitiesBySlugs(urlSlugs);
      if (urlCities.length > 0) {
        return urlCities;
      }
    }

    // 2. Check localStorage (second priority)
    // Try new helper function first, then fallback to old key for backward compatibility
    try {
      let slugs: string[] | null = loadCities();
      
      // If new helper returns null, try old key
      if (!slugs) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          slugs = JSON.parse(stored);
        }
      }
      
      // Validate: must be array and not empty
      if (Array.isArray(slugs) && slugs.length > 0) {
        const savedCities = getCitiesBySlugs(slugs);
        if (savedCities.length > 0) {
          // Migrate to new key if using old key
          if (!loadCities()) {
            saveCities(slugs);
          }
          return savedCities;
        }
      }
    } catch (e) {
      console.warn('Failed to load cities from localStorage:', e);
      // Clear corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore cleanup errors
      }
    }

    // 3. Auto-detect user timezone (fallback)
    try {
      const autoDetectedCities = getDefaultCities();
      if (autoDetectedCities.length > 0) {
        return autoDetectedCities;
      }
    } catch (error) {
      console.error('Failed to auto-detect timezone:', error);
    }

    // 4. Final fallback to hardcoded defaults
    return getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
  });

  const updateCities = (newCities: City[]) => {
    setCities(newCities);
    updateUrlParams(newCities);
    
    // Also save to localStorage using helper function
    try {
      const slugs = newCities.map(c => c.slug);
      // Validate before saving
      if (Array.isArray(slugs) && slugs.length > 0) {
        saveCities(slugs);
        // Also save to old key for backward compatibility
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
      }
    } catch (e) {
      console.warn('Failed to save cities to localStorage:', e);
      // Silently fail - localStorage is not critical
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
