import type { City } from '../types';
import { DEFAULT_CITIES } from '../constants/cities';

export const encodeCitiesToUrl = (cities: City[]): string => {
  if (cities.length === 0) return '';
  return cities.map(city => city.slug).join(',');
};

export const decodeCitiesFromUrl = (urlParam: string | null): string[] => {
  if (!urlParam) return DEFAULT_CITIES;
  return urlParam.split(',').filter(slug => slug.trim() !== '');
};

export const updateUrlParams = (cities: City[]): void => {
  const encoded = encodeCitiesToUrl(cities);
  const url = new URL(window.location.href);
  
  if (encoded) {
    url.searchParams.set('cities', encoded);
  } else {
    url.searchParams.delete('cities');
  }
  
  window.history.replaceState({}, '', url.toString());
};

export const getCitiesFromUrl = (): string[] => {
  const urlParams = new URLSearchParams(window.location.search);
  return decodeCitiesFromUrl(urlParams.get('cities'));
};
