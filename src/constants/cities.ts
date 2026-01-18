import type { City } from '../types';

export const CITIES: City[] = [
  // Americas
  { id: 'sf', name: 'San Francisco', nameVi: 'San Francisco', country: 'USA', state: 'California', timezone: 'America/Los_Angeles', slug: 'san-francisco' },
  { id: 'ny', name: 'New York', nameVi: 'New York', country: 'USA', state: 'New York', timezone: 'America/New_York', slug: 'new-york' },
  { id: 'chicago', name: 'Chicago', nameVi: 'Chicago', country: 'USA', state: 'Illinois', timezone: 'America/Chicago', slug: 'chicago' },
  { id: 'toronto', name: 'Toronto', nameVi: 'Toronto', country: 'Canada', timezone: 'America/Toronto', slug: 'toronto' },
  { id: 'mexico', name: 'Mexico City', nameVi: 'Thành phố Mexico', country: 'Mexico', timezone: 'America/Mexico_City', slug: 'mexico-city' },
  { id: 'sao-paulo', name: 'São Paulo', nameVi: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', slug: 'sao-paulo' },
  
  // Europe
  { id: 'london', name: 'London', nameVi: 'Luân Đôn', country: 'UK', timezone: 'Europe/London', slug: 'london' },
  { id: 'paris', name: 'Paris', nameVi: 'Paris', country: 'France', timezone: 'Europe/Paris', slug: 'paris' },
  { id: 'berlin', name: 'Berlin', nameVi: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', slug: 'berlin' },
  { id: 'rome', name: 'Rome', nameVi: 'Roma', country: 'Italy', timezone: 'Europe/Rome', slug: 'rome' },
  { id: 'madrid', name: 'Madrid', nameVi: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', slug: 'madrid' },
  { id: 'amsterdam', name: 'Amsterdam', nameVi: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', slug: 'amsterdam' },
  { id: 'stockholm', name: 'Stockholm', nameVi: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm', slug: 'stockholm' },
  { id: 'moscow', name: 'Moscow', nameVi: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', slug: 'moscow' },
  
  // Asia
  { id: 'hcm', name: 'Ho Chi Minh City', nameVi: 'Thành phố Hồ Chí Minh', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'ho-chi-minh' },
  { id: 'hanoi', name: 'Hanoi', nameVi: 'Hà Nội', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', slug: 'hanoi' },
  { id: 'singapore', name: 'Singapore', nameVi: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', slug: 'singapore' },
  { id: 'bangkok', name: 'Bangkok', nameVi: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', slug: 'bangkok' },
  { id: 'jakarta', name: 'Jakarta', nameVi: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', slug: 'jakarta' },
  { id: 'manila', name: 'Manila', nameVi: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', slug: 'manila' },
  { id: 'tokyo', name: 'Tokyo', nameVi: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', slug: 'tokyo' },
  { id: 'seoul', name: 'Seoul', nameVi: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', slug: 'seoul' },
  { id: 'beijing', name: 'Beijing', nameVi: 'Bắc Kinh', country: 'China', timezone: 'Asia/Shanghai', slug: 'beijing' },
  { id: 'hongkong', name: 'Hong Kong', nameVi: 'Hồng Kông', country: 'China', timezone: 'Asia/Hong_Kong', slug: 'hong-kong' },
  { id: 'taipei', name: 'Taipei', nameVi: 'Đài Bắc', country: 'Taiwan', timezone: 'Asia/Taipei', slug: 'taipei' },
  { id: 'mumbai', name: 'Mumbai', nameVi: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', slug: 'mumbai' },
  { id: 'delhi', name: 'New Delhi', nameVi: 'New Delhi', country: 'India', timezone: 'Asia/Kolkata', slug: 'new-delhi' },
  { id: 'dubai', name: 'Dubai', nameVi: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', slug: 'dubai' },
  { id: 'tel-aviv', name: 'Tel Aviv', nameVi: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', slug: 'tel-aviv' },
  
  // Oceania
  { id: 'sydney', name: 'Sydney', nameVi: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', slug: 'sydney' },
  { id: 'melbourne', name: 'Melbourne', nameVi: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', slug: 'melbourne' },
  { id: 'auckland', name: 'Auckland', nameVi: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', slug: 'auckland' },
];

// Default cities for initial load
export const DEFAULT_CITIES = ['san-francisco', 'london', 'ho-chi-minh'];

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
