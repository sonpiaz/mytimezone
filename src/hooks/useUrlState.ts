import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { City } from '../types';
import { getCitiesFromUrl, encodeCitiesToUrl } from '../utils/urlHelpers';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isHomePage = location.pathname === '/';
  const isNavigatingRef = useRef(false);
  const citiesRef = useRef<City[]>([]);


  // CRITICAL: Only sync URL on homepage - return early on other pages
  // This prevents conflicts with React Router navigation
  if (!isHomePage) {
    const defaultCities = getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
    const noop = () => {}; // No-op function for setCities
    return [defaultCities, noop];
  }

  const [cities, setCities] = useState<City[]>(() => {
    // Only parse URL if on home page
    if (location.pathname !== '/') {
      const defaultCities = getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
      citiesRef.current = defaultCities;
      return defaultCities;
    }

    // 1. Check URL params first (highest priority)
    // getCitiesFromUrl now returns City[] directly (supports both old and new format)
    const urlCities = getCitiesFromUrl();
    
    if (urlCities.length > 0) {
      citiesRef.current = urlCities;
      return urlCities;
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
      const cityParam = encodeCitiesToUrl(newCities); // Returns "sf,ldn,sgp" (not encoded)
      
      if (cityParam) {
        // Build URL directly to avoid URLSearchParams encoding comma
        // Encode each city code individually, but keep comma unencoded
        const encodedCities = newCities
          .map(c => encodeURIComponent(c.code))
          .join(','); // Comma separator NOT encoded
        const newUrl = `/?c=${encodedCities}`;
        window.history.replaceState({}, '', newUrl);
      } else {
        // Remove params if no cities
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
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

  // Update URL when cities change - with guards to prevent infinite loop
  useEffect(() => {
    // CRITICAL: Skip if navigating to prevent infinite loop
    if (isNavigatingRef.current) {
      return;
    }
    
    // Only update URL when on home page
    if (location.pathname !== '/') {
      return;
    }
    
    // Update URL params - build URL directly to avoid URLSearchParams encoding comma
    const cityParam = encodeCitiesToUrl(cities); // Returns "sf,ldn,sgp" (not encoded)
    
    if (cityParam) {
      // Encode each city code individually, but keep comma unencoded
      const encodedCities = cities
        .map(c => encodeURIComponent(c.code))
        .join(','); // Comma separator NOT encoded
      const newUrl = `/?c=${encodedCities}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Remove params if no cities
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [cities, location.pathname, searchParams, setSearchParams]);

  // Listen for URL changes (back/forward button) - only on home page
  // Use React Router's location change instead of popstate
  useEffect(() => {
    // Only handle if on home page
    if (location.pathname !== '/') {
      return;
    }

    // CRITICAL: Prevent infinite loop - skip if we're currently navigating
    if (isNavigatingRef.current) {
      return;
    }

    const newCities = getCitiesFromUrl();
    
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
  }, [location.search, location.pathname]); // React to URL changes via React Router

  return [cities, updateCities];
};
