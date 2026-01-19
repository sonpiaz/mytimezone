import type { TimeZoneData } from '../types';
import { getFlagEmoji } from '../utils/flagEmoji';

interface CompactTimelineProps {
  timezoneData: TimeZoneData[];
  theme: 'light' | 'dark';
  compact: boolean;
}

export const CompactTimeline = ({ timezoneData, theme, compact }: CompactTimelineProps) => {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#37352F';
  const textLightColor = theme === 'dark' ? '#9B9A97' : '#6B7280';
  const borderColor = theme === 'dark' ? '#2F2F2F' : '#E9E9E7';
  
  if (timezoneData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: textLightColor }}>
        No cities selected
      </div>
    );
  }
  
  return (
    <div>
      {timezoneData.map((tz, index) => {
        const flag = getFlagEmoji(tz.city.country);
        const location = tz.city.state 
          ? `${tz.city.name}, ${tz.city.state}`
          : tz.city.name;
        
        return (
          <div
            key={tz.city.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: compact ? '8px 0' : '10px 0',
              borderBottom: index < timezoneData.length - 1 ? `1px solid ${borderColor}` : 'none',
            }}
          >
            {/* Left: City name with flag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{flag}</span>
              <span style={{ 
                fontSize: compact ? '13px' : '14px',
                fontWeight: 500,
                color: textColor,
              }}>
                {location}
              </span>
            </div>
            
            {/* Right: Time + Timezone */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontFamily: 'monospace',
            }}>
              <span style={{ 
                fontSize: compact ? '13px' : '14px',
                fontWeight: 500,
                color: textColor,
              }}>
                {tz.currentTime}
              </span>
              <span style={{ 
                fontSize: compact ? '11px' : '12px',
                color: textLightColor,
              }}>
                {tz.timezoneAbbr}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
