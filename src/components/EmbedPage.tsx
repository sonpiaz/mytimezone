import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findCityByCodeOrSlug } from '../utils/urlHelpers';
import { getCitiesBySlugs } from '../constants/cities';
import { useTimezones } from '../hooks/useTimezones';
import { CompactTimeline } from './CompactTimeline';
import type { City } from '../types';

export const EmbedPage = () => {
  const [searchParams] = useSearchParams();
  
  // Parse URL params
  const theme = (searchParams.get('theme') || 'light') as 'light' | 'dark';
  const compact = searchParams.get('compact') === 'true';
  
  // Parse cities from URL params
  // Supports both ?cities=sf,london,tokyo and ?c=sf,london,tokyo
  const citiesParam = searchParams.get('cities') || searchParams.get('c') || '';
  const cityCodes = citiesParam.split(',').map(s => s.trim()).filter(Boolean);
  
  // Convert city codes to City objects
  const urlCities: City[] = [];
  for (const code of cityCodes) {
    const city = findCityByCodeOrSlug(code);
    if (city) {
      urlCities.push(city);
    }
  }
  
  // Fallback to default cities if none provided
  const cities: City[] = urlCities.length > 0 
    ? urlCities 
    : getCitiesBySlugs(['san-francisco', 'london', 'singapore']);
  
  // Limit to max 5 cities for embed
  const displayCities = cities.slice(0, 5);
  
  // Use today's date
  const selectedDate = new Date();
  const { timezoneData } = useTimezones(displayCities, selectedDate);
  
  // Set page title for SEO
  useEffect(() => {
    document.title = `Time Zones - ${displayCities.map(c => c.name).join(', ')}`;
  }, [displayCities]);
  
  // Apply theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1F1F1F';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.style.backgroundColor = '#FAFAFA';
      document.body.style.color = '#37352F';
    }
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, [theme]);
  
  const bgColor = theme === 'dark' ? '#1F1F1F' : '#FFFFFF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#37352F';
  const textLightColor = theme === 'dark' ? '#9B9A97' : '#6B7280';
  const borderColor = theme === 'dark' ? '#2F2F2F' : '#E9E9E7';
  
  return (
    <div 
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Content */}
      <div style={{ flex: 1, padding: compact ? '12px' : '16px' }}>
        <CompactTimeline 
          timezoneData={timezoneData}
          theme={theme}
          compact={compact}
        />
      </div>
      
      {/* Footer */}
      <div 
        style={{
          padding: '8px 16px',
          borderTop: `1px solid ${borderColor}`,
          textAlign: 'center',
          fontSize: '11px',
          color: textLightColor,
        }}
      >
        Powered by{' '}
        <a
          href="https://mytimezone.online"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme === 'dark' ? '#60A5FA' : '#2F81F7',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          mytimezone.online
        </a>
      </div>
    </div>
  );
};
