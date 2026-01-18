import { useState, useEffect, useRef } from 'react';
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

  return (
    <button
      onClick={onSelect}
      className="w-full px-4 py-3 text-left hover:bg-notion-hover transition-notion border-b border-notion-borderLight last:border-b-0 focus:outline-none focus:bg-notion-hover flex justify-between items-center"
      type="button"
    >
      <div>
        <div className="font-medium text-notion-text text-sm">{city.name}</div>
        <div className="text-xs text-notion-textLight mt-0.5">{city.country}</div>
      </div>
      <span className="text-sm text-notion-textPlaceholder flex-shrink-0 ml-4">
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

  // Get existing city slugs
  const existingCitySlugs = selectedCities.map((city) => city.slug);

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

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Debug logging
      console.log('=== CLICK OUTSIDE DEBUG ===');
      console.log('Event type:', event.type);
      console.log('Click target:', target);
      console.log('Target element:', target instanceof Element ? target.outerHTML.substring(0, 100) : target);
      console.log('Container ref:', containerRef.current);
      console.log('Container element:', containerRef.current?.outerHTML.substring(0, 100));
      
      if (!containerRef.current) {
        console.log('ERROR: containerRef is null');
        return;
      }

      const clickedInside = containerRef.current.contains(target);
      console.log('Clicked inside?:', clickedInside);

      if (!clickedInside) {
        console.log('>>> CLOSING DROPDOWN');
        setIsOpen(false);
        setHighlightedIndex(-1);
      } else {
        console.log('>>> KEEPING OPEN (clicked inside)');
      }
    };

    // Use click event (simpler than mousedown)
    // Add listener immediately
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
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
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-notion-text mb-2">
        {t('addCity')}
      </label>
      
      {/* Search Input - Thu nhỏ */}
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-textPlaceholder pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
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
          placeholder={t('searchCity') || 'Type to search city...'}
          className="w-full pl-10 pr-4 py-2.5 border border-notion-border rounded-lg bg-white text-notion-text placeholder:text-notion-textPlaceholder focus:outline-none focus:ring-2 focus:ring-notion-accent/20 focus:border-notion-accent transition-notion"
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-notion-border rounded-lg shadow-notion-lg max-h-[300px] overflow-y-auto z-50" style={{ width: '100%', maxWidth: '384px' }}>
          {results.length > 0 ? (
            <div>
              {results.map((city, index) => (
                <div
                  key={city.slug}
                  className={highlightedIndex === index ? 'bg-notion-hover' : ''}
                >
                  <CityResultItem
                    city={city}
                    onSelect={() => handleSelectCity(city)}
                  />
                </div>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="px-4 py-3 text-notion-textLight text-sm text-center">
              {t('noCitiesFound') || 'No cities found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
