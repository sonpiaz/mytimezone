import type { City } from '../types';

export const CITIES: City[] = [
  // GMT-12: Baker Island (uninhabited, but keeping for completeness)
  // GMT-11: American Samoa
  { id: 'pago-pago', name: 'Pago Pago', nameVi: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', slug: 'pago-pago', code: 'ppg' },
  
  // GMT-10: Hawaii
  { id: 'honolulu', name: 'Honolulu', nameVi: 'Honolulu', country: 'USA', state: 'Hawaii', aliases: ['Hawaii', 'Waikiki'], timezone: 'Pacific/Honolulu', slug: 'honolulu', code: 'hnl' },
  
  // GMT-9: Alaska
  { id: 'anchorage', name: 'Anchorage', nameVi: 'Anchorage', country: 'USA', state: 'Alaska', timezone: 'America/Anchorage', slug: 'anchorage', code: 'anc' },
  
  // GMT-8: Pacific Time
  { id: 'los-angeles', name: 'Los Angeles', nameVi: 'Los Angeles', country: 'USA', state: 'California', aliases: ['LA', 'Hollywood'], timezone: 'America/Los_Angeles', slug: 'los-angeles', code: 'la' },
  { id: 'san-francisco', name: 'San Francisco', nameVi: 'San Francisco', country: 'USA', state: 'California', aliases: ['SF', 'Bay Area', 'Silicon Valley'], timezone: 'America/Los_Angeles', slug: 'san-francisco', code: 'sf' },
  { id: 'seattle', name: 'Seattle', nameVi: 'Seattle', country: 'USA', state: 'Washington', timezone: 'America/Los_Angeles', slug: 'seattle', code: 'sea' },
  { id: 'portland', name: 'Portland', nameVi: 'Portland', country: 'USA', state: 'Oregon', timezone: 'America/Los_Angeles', slug: 'portland', code: 'pdx' },
  { id: 'vancouver', name: 'Vancouver', nameVi: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', slug: 'vancouver', code: 'yvr' },
  
  // GMT-7: Mountain Time
  { id: 'denver', name: 'Denver', nameVi: 'Denver', country: 'USA', state: 'Colorado', timezone: 'America/Denver', slug: 'denver', code: 'den' },
  { id: 'phoenix', name: 'Phoenix', nameVi: 'Phoenix', country: 'USA', state: 'Arizona', timezone: 'America/Phoenix', slug: 'phoenix', code: 'phx' },
  
  // GMT-6: Central Time
  { id: 'chicago', name: 'Chicago', nameVi: 'Chicago', country: 'USA', state: 'Illinois', timezone: 'America/Chicago', slug: 'chicago', code: 'chi' },
  { id: 'dallas', name: 'Dallas', nameVi: 'Dallas', country: 'USA', state: 'Texas', timezone: 'America/Chicago', slug: 'dallas', code: 'dfw' },
  { id: 'houston', name: 'Houston', nameVi: 'Houston', country: 'USA', state: 'Texas', timezone: 'America/Chicago', slug: 'houston', code: 'iah' },
  { id: 'new-orleans', name: 'New Orleans', nameVi: 'New Orleans', country: 'USA', state: 'Louisiana', timezone: 'America/Chicago', slug: 'new-orleans', code: 'msy' },
  { id: 'mexico-city', name: 'Mexico City', nameVi: 'Thành phố Mexico', country: 'Mexico', timezone: 'America/Mexico_City', slug: 'mexico-city', code: 'mex' },
  
  // GMT-5: Eastern Time
  { id: 'new-york', name: 'New York', nameVi: 'New York', country: 'USA', state: 'New York', aliases: ['NYC', 'Manhattan', 'Brooklyn'], timezone: 'America/New_York', slug: 'new-york', code: 'nyc' },
  { id: 'miami', name: 'Miami', nameVi: 'Miami', country: 'USA', state: 'Florida', timezone: 'America/New_York', slug: 'miami', code: 'mia' },
  { id: 'boston', name: 'Boston', nameVi: 'Boston', country: 'USA', state: 'Massachusetts', timezone: 'America/New_York', slug: 'boston', code: 'bos' },
  { id: 'atlanta', name: 'Atlanta', nameVi: 'Atlanta', country: 'USA', state: 'Georgia', timezone: 'America/New_York', slug: 'atlanta', code: 'atl' },
  { id: 'detroit', name: 'Detroit', nameVi: 'Detroit', country: 'USA', state: 'Michigan', timezone: 'America/Detroit', slug: 'detroit', code: 'dtw' },
  { id: 'toronto', name: 'Toronto', nameVi: 'Toronto', country: 'Canada', timezone: 'America/Toronto', slug: 'toronto', code: 'yyz' },
  { id: 'montreal', name: 'Montreal', nameVi: 'Montreal', country: 'Canada', timezone: 'America/Toronto', slug: 'montreal', code: 'yul' },
  
  // GMT-4: Atlantic Time (South America)
  { id: 'santiago', name: 'Santiago', nameVi: 'Santiago', country: 'Chile', timezone: 'America/Santiago', slug: 'santiago', code: 'scl' },
  { id: 'caracas', name: 'Caracas', nameVi: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', slug: 'caracas', code: 'ccs' },
  
  // GMT-3: South America
  { id: 'sao-paulo', name: 'São Paulo', nameVi: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', slug: 'sao-paulo', code: 'sao' },
  { id: 'buenos-aires', name: 'Buenos Aires', nameVi: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', slug: 'buenos-aires', code: 'eze' },
  
  // GMT-2: Fernando de Noronha (Brazil)
  { id: 'fernando-noronha', name: 'Fernando de Noronha', nameVi: 'Fernando de Noronha', country: 'Brazil', timezone: 'America/Noronha', slug: 'fernando-noronha', code: 'fna' },
  
  // GMT-1: Azores
  { id: 'azores', name: 'Ponta Delgada', nameVi: 'Ponta Delgada', country: 'Portugal', timezone: 'Atlantic/Azores', slug: 'azores', code: 'pdl' },
  
  // GMT+0: Western Europe
  { id: 'london', name: 'London', nameVi: 'Luân Đôn', country: 'UK', timezone: 'Europe/London', slug: 'london', code: 'ldn' },
  { id: 'edinburgh', name: 'Edinburgh', nameVi: 'Edinburgh', country: 'UK', timezone: 'Europe/London', slug: 'edinburgh', code: 'edi' },
  { id: 'lisbon', name: 'Lisbon', nameVi: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon', slug: 'lisbon', code: 'lis' },
  { id: 'dublin', name: 'Dublin', nameVi: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin', slug: 'dublin', code: 'dub' },
  
  // GMT+1: Central Europe
  { id: 'paris', name: 'Paris', nameVi: 'Paris', country: 'France', timezone: 'Europe/Paris', slug: 'paris', code: 'par' },
  { id: 'berlin', name: 'Berlin', nameVi: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', slug: 'berlin', code: 'ber' },
  { id: 'rome', name: 'Rome', nameVi: 'Roma', country: 'Italy', timezone: 'Europe/Rome', slug: 'rome', code: 'rom' },
  { id: 'madrid', name: 'Madrid', nameVi: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', slug: 'madrid', code: 'mad' },
  { id: 'barcelona', name: 'Barcelona', nameVi: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', slug: 'barcelona', code: 'bcn' },
  { id: 'amsterdam', name: 'Amsterdam', nameVi: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', slug: 'amsterdam', code: 'ams' },
  { id: 'brussels', name: 'Brussels', nameVi: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels', slug: 'brussels', code: 'bru' },
  { id: 'vienna', name: 'Vienna', nameVi: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna', slug: 'vienna', code: 'vie' },
  { id: 'prague', name: 'Prague', nameVi: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague', slug: 'prague', code: 'prg' },
  { id: 'warsaw', name: 'Warsaw', nameVi: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw', slug: 'warsaw', code: 'waw' },
  { id: 'zurich', name: 'Zurich', nameVi: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', slug: 'zurich', code: 'zrh' },
  { id: 'milan', name: 'Milan', nameVi: 'Milan', country: 'Italy', timezone: 'Europe/Rome', slug: 'milan', code: 'mil' },
  
  // GMT+2: Eastern Europe / Middle East
  { id: 'cairo', name: 'Cairo', nameVi: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', slug: 'cairo', code: 'cai' },
  { id: 'athens', name: 'Athens', nameVi: 'Athens', country: 'Greece', timezone: 'Europe/Athens', slug: 'athens', code: 'ath' },
  { id: 'helsinki', name: 'Helsinki', nameVi: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki', slug: 'helsinki', code: 'hel' },
  { id: 'kyiv', name: 'Kyiv', nameVi: 'Kyiv', country: 'Ukraine', timezone: 'Europe/Kiev', slug: 'kyiv', code: 'iev' },
  { id: 'tel-aviv', name: 'Tel Aviv', nameVi: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', slug: 'tel-aviv', code: 'tlv' },
  
  // GMT+3: Russia / Middle East
  { id: 'moscow', name: 'Moscow', nameVi: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', slug: 'moscow', code: 'mow' },
  { id: 'istanbul', name: 'Istanbul', nameVi: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', slug: 'istanbul', code: 'ist' },
  { id: 'riyadh', name: 'Riyadh', nameVi: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', slug: 'riyadh', code: 'ruh' },
  { id: 'kuwait-city', name: 'Kuwait City', nameVi: 'Kuwait City', country: 'Kuwait', timezone: 'Asia/Kuwait', slug: 'kuwait-city', code: 'kwi' },
  
  // GMT+4: Middle East / Central Asia
  { id: 'dubai', name: 'Dubai', nameVi: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', slug: 'dubai', code: 'dxb' },
  { id: 'baku', name: 'Baku', nameVi: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', slug: 'baku', code: 'bak' },
  
  // GMT+5: Central Asia / South Asia
  { id: 'karachi', name: 'Karachi', nameVi: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', slug: 'karachi', code: 'khi' },
  { id: 'tashkent', name: 'Tashkent', nameVi: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', slug: 'tashkent', code: 'tas' },
  // India uses GMT+5:30
  { id: 'new-delhi', name: 'New Delhi', nameVi: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', slug: 'new-delhi', code: 'del' },
  { id: 'mumbai', name: 'Mumbai', nameVi: 'Mumbai', country: 'India', aliases: ['Bombay'], timezone: 'Asia/Kolkata', slug: 'mumbai', code: 'bom' },
  { id: 'bangalore', name: 'Bangalore', nameVi: 'Bangalore', country: 'India', aliases: ['Bengaluru'], timezone: 'Asia/Kolkata', slug: 'bangalore', code: 'blr' },
  
  // GMT+6: South Asia / Central Asia
  { id: 'dhaka', name: 'Dhaka', nameVi: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', slug: 'dhaka', code: 'dac' },
  { id: 'almaty', name: 'Almaty', nameVi: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty', slug: 'almaty', code: 'ala' },
  
  // GMT+7: Southeast Asia
  { id: 'bangkok', name: 'Bangkok', nameVi: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', slug: 'bangkok', code: 'bkk' },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', nameVi: 'Thành phố Hồ Chí Minh', country: 'Vietnam', aliases: ['Saigon', 'HCMC', 'SGN'], timezone: 'Asia/Ho_Chi_Minh', slug: 'ho-chi-minh', code: 'sgn' },
  { id: 'da-nang', name: 'Da Nang', nameVi: 'Đà Nẵng', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'da-nang', code: 'dad' },
  { id: 'hanoi', name: 'Hanoi', nameVi: 'Hà Nội', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'hanoi', code: 'han' },
  { id: 'jakarta', name: 'Jakarta', nameVi: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', slug: 'jakarta', code: 'cgk' },
  
  // GMT+8: East Asia
  { id: 'singapore', name: 'Singapore', nameVi: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', slug: 'singapore', code: 'sgp' },
  { id: 'hong-kong', name: 'Hong Kong', nameVi: 'Hồng Kông', country: 'China', timezone: 'Asia/Hong_Kong', slug: 'hong-kong', code: 'hkg' },
  { id: 'beijing', name: 'Beijing', nameVi: 'Bắc Kinh', country: 'China', aliases: ['Peking'], timezone: 'Asia/Shanghai', slug: 'beijing', code: 'pek' },
  { id: 'shenzhen', name: 'Shenzhen', nameVi: 'Shenzhen', country: 'China', timezone: 'Asia/Shanghai', slug: 'shenzhen', code: 'szx' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', nameVi: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', slug: 'kuala-lumpur', code: 'kul' },
  { id: 'taipei', name: 'Taipei', nameVi: 'Đài Bắc', country: 'Taiwan', timezone: 'Asia/Taipei', slug: 'taipei', code: 'tpe' },
  { id: 'manila', name: 'Manila', nameVi: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', slug: 'manila', code: 'mnl' },
  { id: 'perth', name: 'Perth', nameVi: 'Perth', country: 'Australia', state: 'Western Australia', timezone: 'Australia/Perth', slug: 'perth', code: 'per' },
  
  // GMT+9: Japan / Korea
  { id: 'tokyo', name: 'Tokyo', nameVi: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', slug: 'tokyo', code: 'tyo' },
  { id: 'osaka', name: 'Osaka', nameVi: 'Osaka', country: 'Japan', timezone: 'Asia/Tokyo', slug: 'osaka', code: 'osak' },
  { id: 'seoul', name: 'Seoul', nameVi: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', slug: 'seoul', code: 'icn' },
  
  // GMT+10: Australia / Pacific
  { id: 'sydney', name: 'Sydney', nameVi: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', slug: 'sydney', code: 'syd' },
  { id: 'melbourne', name: 'Melbourne', nameVi: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', slug: 'melbourne', code: 'mel' },
  { id: 'brisbane', name: 'Brisbane', nameVi: 'Brisbane', country: 'Australia', state: 'Queensland', timezone: 'Australia/Brisbane', slug: 'brisbane', code: 'bne' },
  
  // GMT+11: Pacific
  { id: 'noumea', name: 'Noumea', nameVi: 'Noumea', country: 'New Caledonia', timezone: 'Pacific/Noumea', slug: 'noumea', code: 'nou' },
  
  // GMT+12: New Zealand / Pacific
  { id: 'auckland', name: 'Auckland', nameVi: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', slug: 'auckland', code: 'akl' },
  { id: 'wellington', name: 'Wellington', nameVi: 'Wellington', country: 'New Zealand', timezone: 'Pacific/Auckland', slug: 'wellington', code: 'wlg' },
  { id: 'fiji', name: 'Suva', nameVi: 'Suva', country: 'Fiji', timezone: 'Pacific/Fiji', slug: 'fiji', code: 'nff' },
  
  // GMT+13: Pacific
  { id: 'samoa', name: 'Apia', nameVi: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', slug: 'samoa', code: 'apw' },
  { id: 'tonga', name: 'Nuku\'alofa', nameVi: 'Nuku\'alofa', country: 'Tonga', timezone: 'Pacific/Tongatapu', slug: 'tonga', code: 'tbu' },
  
  // GMT+14: Line Islands
  { id: 'kiritimati', name: 'Kiritimati', nameVi: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', slug: 'kiritimati', code: 'cxi' },
];

// Number of default cities to show
export const DEFAULT_CITIES_COUNT = 3;

// Default cities for initial load (fallback only - actual defaults come from auto-detect)
// This is used as fallback in urlHelpers.ts when URL parsing fails
export const DEFAULT_CITIES = ['san-francisco', 'london', 'singapore'];

// Helper to find city by slug
export const findCityBySlug = (slug: string): City | undefined => {
  return CITIES.find(city => city.slug === slug);
};

// Helper to find city by code
export const findCityByCode = (code: string): City | undefined => {
  return CITIES.find(city => city.code.toLowerCase() === code.toLowerCase());
};

// Helper to get cities by slugs
export const getCitiesBySlugs = (slugs: string[]): City[] => {
  return slugs
    .map(slug => findCityBySlug(slug))
    .filter((city): city is City => city !== undefined);
};
