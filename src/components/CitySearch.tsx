import { useState, useEffect, useRef, useMemo } from 'react';
import type { City } from '../types';
import { fuzzySearchCities } from '../utils/fuzzySearch';
import { getGMTOffset } from '../utils/timezoneHelpers';

interface CitySearchProps {
  selectedCities: City[];
  onAddCity: (city: City) => void;
  t: (key: string) => string;
}

interface CityResultItemProps {
  city: City;
  onSelect: () => void;
}

const CityResultItem = ({ city, onSelect }: CityResultItemProps) => {
  const gmtOffset = getGMTOffset(city.timezone);
  
  // Format location: "City" or "City, State" or "State, Country"
  const locationText = city.state 
    ? `${city.state}, ${city.country}`
    : city.country;

  return (
    <button
      onClick={onSelect}
      className="w-full px-3 py-2 text-left hover:bg-[#F7F6F3] transition-colors border-b border-[#E3E3E3] last:border-b-0 focus:outline-none focus:bg-[#F7F6F3] flex justify-between items-center"
      type="button"
    >
      <div>
        <div className="font-medium text-[#37352F] text-sm">{city.name}</div>
        <div className="text-xs text-[#9B9A97] mt-0.5">{locationText}</div>
      </div>
      <span className="text-xs text-[#9B9A97] flex-shrink-0 ml-4">
        {gmtOffset}
      </span>
    </button>
  );
};

export const CitySearch = ({ selectedCities, onAddCity, t }: CitySearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<City[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get existing city slugs - memoize to prevent infinite loop
  const existingCitySlugs = useMemo(() => {
    return selectedCities.map((city) => city.slug);
  }, [selectedCities]);

  // Filter cities when query changes
  useEffect(() => {
    if (query.length > 0) {
      const filtered = fuzzySearchCities(query, existingCitySlugs);
      setResults(filtered);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [query, existingCitySlugs]);

  // Click outside to close dropdown - INLINE handler để đảm bảo hoạt động
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Optional: clear query khi đóng
        // setQuery('');
      }
    };

    // Chỉ add listener khi dropdown đang mở
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            handleSelectCity(results[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, highlightedIndex]);

  const handleSelectCity = (city: City) => {
    onAddCity(city);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      {/* Search Input - Tally style compact */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          // Open dropdown if there's a query and results, or if query exists
          if (query.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder={t('searchPlaceholder')}
        className="w-full px-3 py-2 text-sm border border-[#E3E3E3] rounded-lg bg-white text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F]/20 transition-all"
      />

      {/* Results Dropdown - Compact Tally style */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E3E3E3] rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {results.length > 0 ? (
            <div>
              {results.map((city, index) => (
                <div
                  key={city.slug}
                  className={highlightedIndex === index ? 'bg-[#F7F6F3]' : ''}
                >
                  <CityResultItem
                    city={city}
                    onSelect={() => handleSelectCity(city)}
                  />
                </div>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="px-3 py-2 text-[#9B9A97] text-sm text-center">
              {t('noCitiesFound') || 'No cities found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
