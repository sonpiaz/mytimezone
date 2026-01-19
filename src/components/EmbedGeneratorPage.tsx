import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { City } from '../types';
import { CitySearch } from './CitySearch';
import { CompactTimeline } from './CompactTimeline';
import { useTimezones } from '../hooks/useTimezones';
import { useTranslation } from '../hooks/useTranslation';
import { copyToClipboard } from '../utils/calendarUtils';
import { getCitiesBySlugs } from '../constants/cities';
import { Footer } from './Footer';

export const EmbedGeneratorPage = () => {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>(() => {
    // Default cities
    return getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [compact, setCompact] = useState(false);
  const [copied, setCopied] = useState(false);

  // Limit to max 5 cities
  const displayCities = cities.slice(0, 5);
  const selectedDate = new Date();
  const { timezoneData } = useTimezones(displayCities, selectedDate);

  // Generate embed URL and code
  const cityCodes = displayCities.map(c => c.code).join(',');
  const embedUrl = `https://mytimezone.online/embed?cities=${cityCodes}&theme=${theme}${compact ? '&compact=true' : ''}`;
  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${compact ? '150' : '200'}"
  frameborder="0"
></iframe>`;

  const handleAddCity = (city: City) => {
    // Check if city already exists
    if (cities.some(c => c.id === city.id)) {
      return;
    }
    // Max 5 cities
    if (cities.length >= 5) {
      return;
    }
    setCities([...cities, city]);
  };

  const handleRemoveCity = (cityId: string) => {
    setCities(cities.filter(c => c.id !== cityId));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(embedCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-[#E9E9E7] z-40">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              onClick={() => console.log('Logo clicked!')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src="/favicon.svg" alt="TZ" className="w-8 h-8" />
              <span className="text-xl font-semibold text-[#37352F]">My Time Zone</span>
            </Link>
            <Link
              to="/"
              onClick={() => console.log('Back to Home clicked!')}
              className="text-sm text-[#6B7280] hover:text-[#374151] transition-colors flex items-center gap-1 cursor-pointer"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-[#191919] mb-2">
            Embed Generator
          </h1>
          <p className="text-base text-[#6B7280]">
            Create a custom timezone widget for your website
          </p>
        </div>

        {/* City Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#37352F] mb-2">
            Select Cities (max 5):
          </label>
          <CitySearch
            selectedCities={displayCities}
            onAddCity={handleAddCity}
            t={t}
          />
          
          {/* Selected Cities List */}
          {displayCities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {displayCities.map((city) => (
                <div
                  key={city.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E9E9E7] rounded-lg text-sm text-[#37352F]"
                >
                  <span>{city.name}</span>
                  <button
                    onClick={() => handleRemoveCity(city.id)}
                    className="text-[#9B9A97] hover:text-[#37352F] transition-colors"
                    aria-label={`Remove ${city.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {displayCities.length === 0 && (
            <p className="mt-2 text-sm text-[#9B9A97]">
              Add cities to generate embed code
            </p>
          )}
        </div>

        {/* Options */}
        <div className="mb-6 space-y-4">
          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              Theme:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  className="w-4 h-4 text-[#2F81F7] focus:ring-[#2F81F7]"
                />
                <span className="text-sm text-[#37352F]">Light</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  className="w-4 h-4 text-[#2F81F7] focus:ring-[#2F81F7]"
                />
                <span className="text-sm text-[#37352F]">Dark</span>
              </label>
            </div>
          </div>

          {/* Compact Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
                className="w-4 h-4 text-[#2F81F7] focus:ring-[#2F81F7] rounded border-[#E9E9E7]"
              />
              <span className="text-sm text-[#37352F]">Compact (smaller height)</span>
            </label>
          </div>
        </div>

        {/* Live Preview */}
        {displayCities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#37352F] mb-3">Preview:</h3>
            <div className="border border-[#E9E9E7] rounded-lg overflow-hidden bg-white">
              <div
                style={{
                  backgroundColor: theme === 'dark' ? '#1F1F1F' : '#FFFFFF',
                  padding: compact ? '12px' : '16px',
                }}
              >
                <CompactTimeline
                  timezoneData={timezoneData}
                  theme={theme}
                  compact={compact}
                />
              </div>
            </div>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#2F81F7] hover:text-[#1E5FD9] hover:underline transition-colors"
            >
              <span>Open preview in new tab</span>
            </a>
          </div>
        )}

        {/* Embed Code */}
        {displayCities.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#37352F] mb-2">
              Embed Code:
            </label>
            <div className="bg-[#F7F7F5] border border-[#E9E9E7] rounded-lg p-4 mb-4">
              <pre className="text-xs font-mono text-[#37352F] whitespace-pre-wrap overflow-x-auto">
                {embedCode}
              </pre>
            </div>
            <button
              onClick={handleCopy}
              className={`w-full py-2.5 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#191919] text-white hover:bg-[#333333]'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
