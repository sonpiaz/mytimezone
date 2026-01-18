import { DateTime } from 'luxon';
import type { City } from '../types';
import { CITIES } from '../constants/cities';

/**
 * Detect user's timezone từ browser
 * Returns IANA timezone string: "Asia/Ho_Chi_Minh", "America/New_York", etc.
 */
export const detectUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Failed to detect timezone:', error);
    // Fallback to San Francisco
    return 'America/Los_Angeles';
  }
};

/**
 * Lấy UTC offset (in minutes) từ timezone string
 */
const getUTCOffsetMinutes = (timezone: string): number => {
  try {
    const now = DateTime.now().setZone(timezone);
    return now.offset; // Returns offset in minutes
  } catch (error) {
    console.error(`Invalid timezone: ${timezone}`, error);
    return 0;
  }
};

/**
 * Tìm city phù hợp nhất với timezone của user
 */
export const findCityByTimezone = (timezone: string): City | null => {
  // 1. Exact match - timezone trùng khớp hoàn toàn
  const exactMatch = CITIES.find((city) => city.timezone === timezone);
  if (exactMatch) return exactMatch;

  // 2. Same offset - tìm city có cùng UTC offset
  const userOffset = getUTCOffsetMinutes(timezone);
  const sameOffsetCity = CITIES.find((city) => {
    try {
      const cityOffset = getUTCOffsetMinutes(city.timezone);
      return cityOffset === userOffset;
    } catch {
      return false;
    }
  });
  if (sameOffsetCity) return sameOffsetCity;

  // 3. Fallback - không tìm được
  return null;
};

/**
 * Get UTC offset in hours for a timezone
 */
const getTimezoneOffsetHours = (timezone: string): number => {
  try {
    const offsetMinutes = getUTCOffsetMinutes(timezone);
    return offsetMinutes / 60; // Convert to hours
  } catch {
    return 0;
  }
};

/**
 * Get complementary cities that have different timezones from reference
 * Returns cities with significant timezone differences (±3h or more)
 */
const getComplementaryCities = (referenceCity: City, count: number): City[] => {
  const refOffset = getTimezoneOffsetHours(referenceCity.timezone);
  
  // Popular cities to choose from (prioritized list)
  const popularCitySlugs = [
    'new-york',      // GMT-5 (US East)
    'london',        // GMT+0 (UK)
    'singapore',     // GMT+8 (Asia)
    'tokyo',         // GMT+9 (Japan)
    'sydney',        // GMT+10 (Australia)
    'san-francisco', // GMT-8 (US West)
    'paris',         // GMT+1 (Europe)
    'dubai',         // GMT+4 (Middle East)
    'mumbai',        // GMT+5:30 (India) - if we add it
    'beijing',       // GMT+8 (China)
  ];
  
  // Filter cities that:
  // 1. Exist in CITIES array
  // 2. Are different from reference city
  // 3. Have significant timezone difference (≥3 hours)
  const complementary = popularCitySlugs
    .map(slug => CITIES.find(c => c.slug === slug))
    .filter((city): city is City => {
      if (!city || city.id === referenceCity.id) return false;
      const cityOffset = getTimezoneOffsetHours(city.timezone);
      return Math.abs(cityOffset - refOffset) >= 3;
    })
    .slice(0, count);
  
  // If we don't have enough, add any city with different offset
  if (complementary.length < count) {
    const additional = CITIES
      .filter(city => {
        if (city.id === referenceCity.id) return false;
        if (complementary.some(c => c.id === city.id)) return false;
        const cityOffset = getTimezoneOffsetHours(city.timezone);
        return Math.abs(cityOffset - refOffset) >= 1; // At least 1 hour difference
      })
      .slice(0, count - complementary.length);
    complementary.push(...additional);
  }
  
  return complementary.slice(0, count);
};

/**
 * Generate default cities dựa trên timezone của user
 * Returns exactly 3 cities: [User's city 🏠, City 2, City 3]
 * 
 * Priority:
 * 1. User's detected timezone → match city
 * 2. Fallback to San Francisco if no match
 * 3. Add 2 complementary cities with different timezones
 */
export const getDefaultCities = (): City[] => {
  const userTimezone = detectUserTimezone();
  const userCity = findCityByTimezone(userTimezone);

  // Fallback: San Francisco if no user city detected
  const referenceCity = userCity || CITIES.find((c) => c.slug === 'san-francisco') || CITIES[0];
  if (!referenceCity) return [];

  // Get 2 complementary cities with different timezones
  const complementaryCities = getComplementaryCities(referenceCity, 2);

  // Build result: [reference, complementary1, complementary2]
  const result: City[] = [referenceCity, ...complementaryCities];

  // Ensure we have exactly 3 cities
  while (result.length < 3) {
    const fallback = CITIES.find((c) => !result.some((r) => r.id === c.id));
    if (fallback) {
      result.push(fallback);
    } else {
      break; // No more cities available
    }
  }

  return result.slice(0, 3); // Always return exactly 3 cities
};
