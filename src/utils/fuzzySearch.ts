import type { City } from '../types';
import { CITIES } from '../constants/cities';
import { getGMTOffset, getTimezoneAbbreviation } from './timezoneHelpers';

/**
 * Normalize text: lowercase, remove diacritics
 */
const normalize = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
};

/**
 * Common city abbreviations mapping
 */
const abbreviations: Record<string, string[]> = {
  'sf': ['san francisco'],
  'nyc': ['new york'],
  'ny': ['new york'],
  'la': ['los angeles'],
  'hcm': ['ho chi minh', 'ho chi minh city'],
  'sg': ['singapore'],
  'ldn': ['london'],
  'tyo': ['tokyo'],
  'dn': ['da nang'],
  'hanoi': ['hanoi', 'ha noi'],
  'sgn': ['ho chi minh', 'saigon'],
};

/**
 * Fuzzy search cities based on query
 * @param query Search query string
 * @param existingCitySlugs Array of city slugs already added (to exclude)
 * @returns Filtered array of cities matching the query
 */
export const fuzzySearchCities = (
  query: string,
  existingCitySlugs: string[] = []
): City[] => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = normalize(query.trim());

  // Debug logging (only in development - remove in production)
  const DEBUG = false; // Set to true to enable debug logs
  if (DEBUG) {
    console.log('=== DEBUG SEARCH ===');
    console.log('Query:', normalizedQuery);
    console.log('Existing city slugs:', existingCitySlugs);
    
    // Check New York
    const newYork = CITIES.find((c) => c.slug === 'new-york');
    console.log('New York in CITIES:', newYork);
    console.log('New York already added?:', existingCitySlugs.includes('new-york'));
  }

  // Check abbreviations first
  const expandedQueries = abbreviations[normalizedQuery] || [normalizedQuery];

  const results = CITIES.filter((city) => {
    // Exclude already added cities
    if (existingCitySlugs.includes(city.slug)) {
      if (DEBUG && city.slug === 'new-york') {
        console.log('New York filtered out - already added');
      }
      return false;
    }

    // Get timezone info for search
    const gmtOffset = getGMTOffset(city.timezone);
    const timezoneAbbr = getTimezoneAbbreviation(city.timezone);

    // Build searchable text from all relevant fields
    // Include all parts separately to ensure partial matching works
    const searchableParts = [
      city.name,
      city.nameVi || '',
      city.country,
      city.state || '',
      gmtOffset,
      timezoneAbbr,
    ].filter(Boolean); // Remove empty strings

    // Normalize each part separately and join
    const searchableText = normalize(searchableParts.join(' '));

    // Also check individual parts for better matching
    const normalizedParts = searchableParts.map(part => normalize(part));

    // Check if any expanded query matches in the full text or any individual part
    const matches = expandedQueries.some((q) => {
      // Full text match (e.g., "new york" in "new york usa new york gmt-5")
      if (searchableText.includes(q)) return true;
      
      // Individual part match (for better partial matching)
      // This ensures "new" matches "New York" even if it's a word within the name
      const hasMatch = normalizedParts.some(part => part.includes(q));
      if (hasMatch) return true;
      
      // Word boundary match: "new" should match "New York" even if query is just "new"
      // Split each part into words and check if any word contains the query
      const wordMatch = normalizedParts.some(part => {
        const words = part.split(/\s+/);
        return words.some(word => word.includes(q) || q.includes(word));
      });
      
      return wordMatch;
    });

    // Debug logging for New York
    if (DEBUG && city.slug === 'new-york') {
      console.log('New York searchable text:', searchableText);
      console.log('New York normalized parts:', normalizedParts);
      console.log('New York expanded queries:', expandedQueries);
      console.log('New York matches?', matches);
    }

    return matches;
  });

  // Sort by relevance: exact name match > partial name match > country match
  const sortedResults = results.sort((a, b) => {
    const aName = normalize(a.name);
    const bName = normalize(b.name);
    
    // Exact name match gets highest priority
    const aExactMatch = expandedQueries.some(q => aName === q);
    const bExactMatch = expandedQueries.some(q => bName === q);
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    // Name starts with query gets second priority
    const aStartsWith = expandedQueries.some(q => aName.startsWith(q));
    const bStartsWith = expandedQueries.some(q => bName.startsWith(q));
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // Name contains query gets third priority
    const aContains = expandedQueries.some(q => aName.includes(q));
    const bContains = expandedQueries.some(q => bName.includes(q));
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;
    
    return 0;
  });

  // Limit to 10 results for performance
  const finalResults = sortedResults.slice(0, 10);

  // Debug logging
  if (DEBUG) {
    console.log('Final results:', finalResults.map((c) => c.name));
    console.log('New York in results?:', finalResults.some((c) => c.slug === 'new-york'));
  }

  return finalResults;
};
