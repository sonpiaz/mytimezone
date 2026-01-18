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
 * Generate default cities dựa trên timezone của user
 * Returns: [User's city 🏠, London/Singapore, San Francisco/Singapore]
 */
export const getDefaultCities = (): City[] => {
  const userTimezone = detectUserTimezone();
  const userCity = findCityByTimezone(userTimezone);

  // Tìm các cities cố định
  const london = CITIES.find((c) => c.slug === 'london');
  const sanFrancisco = CITIES.find((c) => c.slug === 'san-francisco');
  const singapore = CITIES.find((c) => c.slug === 'singapore');
  const newYork = CITIES.find((c) => c.slug === 'new-york');

  // Fallback nếu không detect được user city
  const defaultUserCity = userCity || sanFrancisco || CITIES[0];
  if (!defaultUserCity) return [];

  // Build danh sách 3 cities
  const result: City[] = [defaultUserCity];

  // City thứ 2: London (nếu user không ở London, ngược lại dùng Singapore)
  if (defaultUserCity.slug !== 'london' && london) {
    result.push(london);
  } else if (singapore) {
    result.push(singapore);
  }

  // City thứ 3: San Francisco (nếu user không ở SF, ngược lại dùng Singapore)
  if (defaultUserCity.slug !== 'san-francisco' && sanFrancisco) {
    // Kiểm tra Singapore đã được thêm chưa
    if (result.some((c) => c.slug === 'singapore')) {
      // Singapore đã có, thêm city khác (New York)
      if (newYork) result.push(newYork);
    } else {
      result.push(sanFrancisco);
    }
  } else if (singapore && !result.some((c) => c.slug === 'singapore')) {
    result.push(singapore);
  }

  // Đảm bảo luôn có 3 cities
  while (result.length < 3) {
    const fallback = CITIES.find((c) => !result.some((r) => r.slug === c.slug));
    if (fallback) result.push(fallback);
    else break;
  }

  return result.slice(0, 3); // Limit to 3 cities
};
