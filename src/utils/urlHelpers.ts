import type { City } from '../types';

// Build lookup maps for performance
const codeToCity = new Map<string, City>();
const slugToCity = new Map<string, City>();

// Initialize maps (will be populated when cities are imported)
import { CITIES } from '../constants/cities';
CITIES.forEach(city => {
  codeToCity.set(city.code.toLowerCase(), city);
  slugToCity.set(city.slug.toLowerCase(), city);
});

/**
 * Find city by code OR slug (backward compatible)
 */
export function findCityByCodeOrSlug(identifier: string): City | undefined {
  const lower = identifier.toLowerCase();
  return codeToCity.get(lower) || slugToCity.get(lower);
}

/**
 * Encode cities to short URL param using codes
 * Output: "sf,ldn,sgp"
 */
export function encodeCitiesToUrl(cities: City[]): string {
  if (cities.length === 0) return '';
  return cities.map(c => c.code).join(',');
}

/**
 * Decode URL param to cities (supports both old and new format)
 * Input: "sf,ldn,sgp" OR "san-francisco,london,singapore"
 */
export function decodeCitiesFromUrl(param: string | null): City[] {
  if (!param || typeof param !== 'string') return [];
  
  try {
    const identifiers = param.split(',').map(s => s.trim()).filter(Boolean);
    const result: City[] = [];
    
    for (const id of identifiers) {
      const city = findCityByCodeOrSlug(id);
      if (city) {
        result.push(city);
      }
    }
    
    // Validate: max 10 cities to prevent URL length issues
    return result.slice(0, 10);
  } catch (error) {
    console.error('Failed to decode cities from URL:', error);
    return [];
  }
}

/**
 * Get cities from URL (supports both old ?cities= and new ?c= format)
 * Returns city objects, not slugs
 */
export const getCitiesFromUrl = (): City[] => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Try new format first: ?c=sf,ldn,sgp
    const shortParam = urlParams.get('c');
    if (shortParam) {
      const cities = decodeCitiesFromUrl(shortParam);
      if (cities.length > 0) {
        return cities;
      }
    }
    
    // Fallback to old format: ?cities=san-francisco,london
    const oldParam = urlParams.get('cities');
    if (oldParam) {
      const cities = decodeCitiesFromUrl(oldParam);
      if (cities.length > 0) {
        return cities;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get cities from URL:', error);
    return [];
  }
};

/**
 * Update URL parameters without page reload
 * Always uses new short format: ?c=sf,ldn,sgp
 */
export const updateUrlParams = (cities: City[]): void => {
  try {
    if (window.location.pathname !== '/') return;
    
    const encoded = encodeCitiesToUrl(cities);
    const url = new URL(window.location.href);
    
    if (encoded) {
      url.searchParams.set('c', encoded);
      // Remove old 'cities' param if exists
      url.searchParams.delete('cities');
    } else {
      url.searchParams.delete('c');
      url.searchParams.delete('cities');
    }
    
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to update URL params:', error);
    // Silently fail - URL update is not critical
  }
};
