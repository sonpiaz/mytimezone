import type { City } from '../types';
import { DEFAULT_CITIES } from '../constants/cities';

/**
 * Encode cities array to URL parameter string
 * Optimized: Early return for empty array
 */
export const encodeCitiesToUrl = (cities: City[]): string => {
  if (cities.length === 0) return '';
  return cities.map(city => city.slug).join(',');
};

/**
 * Decode URL parameter string to cities slugs array
 * Includes validation and error handling
 */
export const decodeCitiesFromUrl = (urlParam: string | null): string[] => {
  if (!urlParam || typeof urlParam !== 'string') return DEFAULT_CITIES;
  
  try {
    const slugs = urlParam.split(',').filter(slug => slug.trim() !== '');
    // Validate: max 10 cities to prevent URL length issues
    return slugs.slice(0, 10);
  } catch (error) {
    console.error('Failed to decode cities from URL:', error);
    return DEFAULT_CITIES;
  }
};

/**
 * Update URL parameters without page reload
 * Uses replaceState to avoid adding to browser history
 */
export const updateUrlParams = (cities: City[]): void => {
  try {
    const encoded = encodeCitiesToUrl(cities);
    const url = new URL(window.location.href);
    
    if (encoded) {
      url.searchParams.set('cities', encoded);
    } else {
      url.searchParams.delete('cities');
    }
    
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to update URL params:', error);
    // Silently fail - URL update is not critical
  }
};

/**
 * Get cities slugs from current URL
 * Returns default cities if URL param is invalid
 */
export const getCitiesFromUrl = (): string[] => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return decodeCitiesFromUrl(urlParams.get('cities'));
  } catch (error) {
    console.error('Failed to get cities from URL:', error);
    return DEFAULT_CITIES;
  }
};
