import type { City } from '../types';

export const CITIES: City[] = [
  // GMT-12: Baker Island (uninhabited, but keeping for completeness)
  // GMT-11: American Samoa
  { id: 'pago-pago', name: 'Pago Pago', nameVi: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', slug: 'pago-pago' },
  
  // GMT-10: Hawaii
  { id: 'honolulu', name: 'Honolulu', nameVi: 'Honolulu', country: 'USA', state: 'Hawaii', timezone: 'Pacific/Honolulu', slug: 'honolulu' },
  
  // GMT-9: Alaska
  { id: 'anchorage', name: 'Anchorage', nameVi: 'Anchorage', country: 'USA', state: 'Alaska', timezone: 'America/Anchorage', slug: 'anchorage' },
  
  // GMT-8: Pacific Time
  { id: 'los-angeles', name: 'Los Angeles', nameVi: 'Los Angeles', country: 'USA', state: 'California', timezone: 'America/Los_Angeles', slug: 'los-angeles' },
  { id: 'san-francisco', name: 'San Francisco', nameVi: 'San Francisco', country: 'USA', state: 'California', timezone: 'America/Los_Angeles', slug: 'san-francisco' },
  { id: 'seattle', name: 'Seattle', nameVi: 'Seattle', country: 'USA', state: 'Washington', timezone: 'America/Los_Angeles', slug: 'seattle' },
  { id: 'portland', name: 'Portland', nameVi: 'Portland', country: 'USA', state: 'Oregon', timezone: 'America/Los_Angeles', slug: 'portland' },
  { id: 'vancouver', name: 'Vancouver', nameVi: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', slug: 'vancouver' },
  
  // GMT-7: Mountain Time
  { id: 'denver', name: 'Denver', nameVi: 'Denver', country: 'USA', state: 'Colorado', timezone: 'America/Denver', slug: 'denver' },
  { id: 'phoenix', name: 'Phoenix', nameVi: 'Phoenix', country: 'USA', state: 'Arizona', timezone: 'America/Phoenix', slug: 'phoenix' },
  
  // GMT-6: Central Time
  { id: 'chicago', name: 'Chicago', nameVi: 'Chicago', country: 'USA', state: 'Illinois', timezone: 'America/Chicago', slug: 'chicago' },
  { id: 'dallas', name: 'Dallas', nameVi: 'Dallas', country: 'USA', state: 'Texas', timezone: 'America/Chicago', slug: 'dallas' },
  { id: 'houston', name: 'Houston', nameVi: 'Houston', country: 'USA', state: 'Texas', timezone: 'America/Chicago', slug: 'houston' },
  { id: 'new-orleans', name: 'New Orleans', nameVi: 'New Orleans', country: 'USA', state: 'Louisiana', timezone: 'America/Chicago', slug: 'new-orleans' },
  { id: 'mexico-city', name: 'Mexico City', nameVi: 'Thành phố Mexico', country: 'Mexico', timezone: 'America/Mexico_City', slug: 'mexico-city' },
  
  // GMT-5: Eastern Time
  { id: 'new-york', name: 'New York', nameVi: 'New York', country: 'USA', state: 'New York', timezone: 'America/New_York', slug: 'new-york' },
  { id: 'miami', name: 'Miami', nameVi: 'Miami', country: 'USA', state: 'Florida', timezone: 'America/New_York', slug: 'miami' },
  { id: 'boston', name: 'Boston', nameVi: 'Boston', country: 'USA', state: 'Massachusetts', timezone: 'America/New_York', slug: 'boston' },
  { id: 'atlanta', name: 'Atlanta', nameVi: 'Atlanta', country: 'USA', state: 'Georgia', timezone: 'America/New_York', slug: 'atlanta' },
  { id: 'detroit', name: 'Detroit', nameVi: 'Detroit', country: 'USA', state: 'Michigan', timezone: 'America/Detroit', slug: 'detroit' },
  { id: 'toronto', name: 'Toronto', nameVi: 'Toronto', country: 'Canada', timezone: 'America/Toronto', slug: 'toronto' },
  { id: 'montreal', name: 'Montreal', nameVi: 'Montreal', country: 'Canada', timezone: 'America/Toronto', slug: 'montreal' },
  
  // GMT-4: Atlantic Time (South America)
  { id: 'santiago', name: 'Santiago', nameVi: 'Santiago', country: 'Chile', timezone: 'America/Santiago', slug: 'santiago' },
  { id: 'caracas', name: 'Caracas', nameVi: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', slug: 'caracas' },
  
  // GMT-3: South America
  { id: 'sao-paulo', name: 'São Paulo', nameVi: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', slug: 'sao-paulo' },
  { id: 'buenos-aires', name: 'Buenos Aires', nameVi: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', slug: 'buenos-aires' },
  
  // GMT-2: Fernando de Noronha (Brazil)
  { id: 'fernando-noronha', name: 'Fernando de Noronha', nameVi: 'Fernando de Noronha', country: 'Brazil', timezone: 'America/Noronha', slug: 'fernando-noronha' },
  
  // GMT-1: Azores
  { id: 'azores', name: 'Ponta Delgada', nameVi: 'Ponta Delgada', country: 'Portugal', timezone: 'Atlantic/Azores', slug: 'azores' },
  
  // GMT+0: Western Europe
  { id: 'london', name: 'London', nameVi: 'Luân Đôn', country: 'UK', timezone: 'Europe/London', slug: 'london' },
  { id: 'edinburgh', name: 'Edinburgh', nameVi: 'Edinburgh', country: 'UK', timezone: 'Europe/London', slug: 'edinburgh' },
  { id: 'lisbon', name: 'Lisbon', nameVi: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', slug: 'lisbon' },
  { id: 'dublin', name: 'Dublin', nameVi: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', slug: 'dublin' },
  
  // GMT+1: Central Europe
  { id: 'paris', name: 'Paris', nameVi: 'Paris', country: 'France', timezone: 'Europe/Paris', slug: 'paris' },
  { id: 'berlin', name: 'Berlin', nameVi: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', slug: 'berlin' },
  { id: 'rome', name: 'Rome', nameVi: 'Roma', country: 'Italy', timezone: 'Europe/Rome', slug: 'rome' },
  { id: 'madrid', name: 'Madrid', nameVi: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', slug: 'madrid' },
  { id: 'barcelona', name: 'Barcelona', nameVi: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', slug: 'barcelona' },
  { id: 'amsterdam', name: 'Amsterdam', nameVi: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', slug: 'amsterdam' },
  { id: 'brussels', name: 'Brussels', nameVi: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', slug: 'brussels' },
  { id: 'vienna', name: 'Vienna', nameVi: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', slug: 'vienna' },
  { id: 'prague', name: 'Prague', nameVi: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', slug: 'prague' },
  { id: 'warsaw', name: 'Warsaw', nameVi: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', slug: 'warsaw' },
  { id: 'zurich', name: 'Zurich', nameVi: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', slug: 'zurich' },
  { id: 'milan', name: 'Milan', nameVi: 'Milan', country: 'Italy', timezone: 'Europe/Rome', slug: 'milan' },
  
  // GMT+2: Eastern Europe / Middle East
  { id: 'cairo', name: 'Cairo', nameVi: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', slug: 'cairo' },
  { id: 'athens', name: 'Athens', nameVi: 'Athens', country: 'Greece', timezone: 'Europe/Athens', slug: 'athens' },
  { id: 'helsinki', name: 'Helsinki', nameVi: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', slug: 'helsinki' },
  { id: 'kyiv', name: 'Kyiv', nameVi: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kiev', slug: 'kyiv' },
  { id: 'tel-aviv', name: 'Tel Aviv', nameVi: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', slug: 'tel-aviv' },
  
  // GMT+3: Russia / Middle East
  { id: 'moscow', name: 'Moscow', nameVi: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', slug: 'moscow' },
  { id: 'istanbul', name: 'Istanbul', nameVi: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', slug: 'istanbul' },
  { id: 'riyadh', name: 'Riyadh', nameVi: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', slug: 'riyadh' },
  { id: 'kuwait-city', name: 'Kuwait City', nameVi: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait', slug: 'kuwait-city' },
  
  // GMT+4: Middle East / Central Asia
  { id: 'dubai', name: 'Dubai', nameVi: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', slug: 'dubai' },
  { id: 'baku', name: 'Baku', nameVi: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', slug: 'baku' },
  
  // GMT+5: Central Asia / South Asia
  { id: 'karachi', name: 'Karachi', nameVi: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', slug: 'karachi' },
  { id: 'tashkent', name: 'Tashkent', nameVi: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', slug: 'tashkent' },
  // Note: India uses GMT+5:30, but we'll add New Delhi for completeness
  { id: 'new-delhi', name: 'New Delhi', nameVi: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', slug: 'new-delhi' },
  
  // GMT+6: South Asia / Central Asia
  { id: 'dhaka', name: 'Dhaka', nameVi: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', slug: 'dhaka' },
  { id: 'almaty', name: 'Almaty', nameVi: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty', slug: 'almaty' },
  
  // GMT+7: Southeast Asia
  { id: 'bangkok', name: 'Bangkok', nameVi: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', slug: 'bangkok' },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', nameVi: 'Thành phố Hồ Chí Minh', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'ho-chi-minh' },
  { id: 'da-nang', name: 'Da Nang', nameVi: 'Đà Nẵng', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'da-nang' },
  { id: 'hanoi', name: 'Hanoi', nameVi: 'Hà Nội', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'hanoi' },
  { id: 'jakarta', name: 'Jakarta', nameVi: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', slug: 'jakarta' },
  
  // GMT+8: East Asia
  { id: 'singapore', name: 'Singapore', nameVi: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', slug: 'singapore' },
  { id: 'hong-kong', name: 'Hong Kong', nameVi: 'Hồng Kông', country: 'China', timezone: 'Asia/Hong_Kong', slug: 'hong-kong' },
  { id: 'beijing', name: 'Beijing', nameVi: 'Bắc Kinh', country: 'China', timezone: 'Asia/Shanghai', slug: 'beijing' },
  { id: 'shenzhen', name: 'Shenzhen', nameVi: 'Shenzhen', country: 'China', timezone: 'Asia/Shanghai', slug: 'shenzhen' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', nameVi: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', slug: 'kuala-lumpur' },
  { id: 'taipei', name: 'Taipei', nameVi: 'Đài Bắc', country: 'Taiwan', timezone: 'Asia/Taipei', slug: 'taipei' },
  { id: 'manila', name: 'Manila', nameVi: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', slug: 'manila' },
  { id: 'perth', name: 'Perth', nameVi: 'Perth', country: 'Australia', state: 'Western Australia', timezone: 'Australia/Perth', slug: 'perth' },
  
  // GMT+9: Japan / Korea
  { id: 'tokyo', name: 'Tokyo', nameVi: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', slug: 'tokyo' },
  { id: 'osaka', name: 'Osaka', nameVi: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', slug: 'osaka' },
  { id: 'seoul', name: 'Seoul', nameVi: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', slug: 'seoul' },
  
  // GMT+10: Australia / Pacific
  { id: 'sydney', name: 'Sydney', nameVi: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', slug: 'sydney' },
  { id: 'melbourne', name: 'Melbourne', nameVi: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', slug: 'melbourne' },
  { id: 'brisbane', name: 'Brisbane', nameVi: 'Brisbane', country: 'Australia', state: 'Queensland', timezone: 'Australia/Brisbane', slug: 'brisbane' },
  
  // GMT+11: Pacific
  { id: 'noumea', name: 'Noumea', nameVi: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', slug: 'noumea' },
  
  // GMT+12: New Zealand / Pacific
  { id: 'auckland', name: 'Auckland', nameVi: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', slug: 'auckland' },
  { id: 'wellington', name: 'Wellington', nameVi: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland', slug: 'wellington' },
  { id: 'fiji', name: 'Suva', nameVi: 'Suva', country: 'Fiji', timezone: 'Pacific/Fiji', slug: 'fiji' },
  
  // GMT+13: Pacific
  { id: 'samoa', name: 'Apia', nameVi: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', slug: 'samoa' },
  { id: 'tonga', name: 'Nuku\'alofa', nameVi: 'Nuku\'alofa', country: 'Tonga', timezone: 'Pacific/Tongatapu', slug: 'tonga' },
  
  // GMT+14: Line Islands
  { id: 'kiritimati', name: 'Kiritimati', nameVi: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', slug: 'kiritimati' },
];

// Default cities for initial load (San Francisco is reference/home city)
export const DEFAULT_CITIES = ['san-francisco', 'new-york', 'london', 'singapore', 'da-nang'];

// Helper to find city by slug
export const findCityBySlug = (slug: string): City | undefined => {
  return CITIES.find(city => city.slug === slug);
};

// Helper to get cities by slugs
export const getCitiesBySlugs = (slugs: string[]): City[] => {
  return slugs
    .map(slug => findCityBySlug(slug))
    .filter((city): city is City => city !== undefined);
};
