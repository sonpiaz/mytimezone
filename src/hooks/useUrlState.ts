import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { City } from '../types';
import { getCitiesFromUrl, updateUrlParams } from '../utils/urlHelpers';
import { getCitiesBySlugs } from '../constants/cities';
import { getDefaultCities } from '../utils/timezoneDetect';
import { saveCities, loadCities } from '../utils/storageHelpers';

// Keep old key for backward compatibility, but also use new helper functions
const STORAGE_KEY = 'my-timezone-cities-order';

// Helper function to compare cities arrays
const areCitiesEqual = (a: City[], b: City[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((city, index) => city.id === b[index]?.id);
};

export const useUrlState = (): [City[], (cities: City[]) => void] => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isNavigatingRef = useRef(false);
  const citiesRef = useRef<City[]>([]);

  const [cities, setCities] = useState<City[]>(() => {
    // 1. Check URL params first (highest priority)
    const urlSlugs = getCitiesFromUrl();
    if (urlSlugs.length > 0) {
      const urlCities = getCitiesBySlugs(urlSlugs);
      if (urlCities.length > 0) {
        citiesRef.current = urlCities;
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
          citiesRef.current = savedCities;
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
        citiesRef.current = autoDetectedCities;
        return autoDetectedCities;
      }
    } catch (error) {
      console.error('Failed to auto-detect timezone:', error);
    }

    // 4. Final fallback to hardcoded defaults
    const defaultCities = getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
    citiesRef.current = defaultCities;
    return defaultCities;
  });

  // Keep citiesRef in sync with cities state
  useEffect(() => {
    citiesRef.current = cities;
  }, [cities]);

  const updateCities = (newCities: City[]) => {
    // Prevent infinite loop: skip if currently navigating
    if (isNavigatingRef.current) {
      return;
    }

    // Prevent infinite loop: only update if cities actually changed
    if (areCitiesEqual(cities, newCities)) {
      return;
    }

    setCities(newCities);
    
    // Only update URL params when on home page and not navigating
    // Skip if navigating or not on home page to avoid conflicts with routing
    if (isHomePage && !isNavigatingRef.current) {
      updateUrlParams(newCities);
    }
    
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

  // Listen for URL changes (back/forward button) - only on home page
  useEffect(() => {
    // Only listen to popstate when on home page
    if (!isHomePage) {
      return;
    }

    const handlePopState = () => {
      // Prevent infinite loop: skip if we're currently navigating
      if (isNavigatingRef.current) {
        return;
      }

      const slugs = getCitiesFromUrl();
      const newCities = getCitiesBySlugs(slugs);
      
      // Use ref to compare, not state (to avoid dependency on cities)
      // Only update if cities actually changed
      if (!areCitiesEqual(citiesRef.current, newCities)) {
        isNavigatingRef.current = true;
        setCities(newCities);
        // Reset flag after state update using requestAnimationFrame
        requestAnimationFrame(() => {
          isNavigatingRef.current = false;
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isHomePage]); // Only depend on isHomePage, not cities

  return [cities, updateCities];
};
