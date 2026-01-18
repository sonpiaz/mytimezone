import { useRef } from 'react';
import type { TimeZoneData } from '../types';

interface TimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isReference?: boolean;
  sidebarOnly?: boolean;
  timelineOnly?: boolean;
  columnWidth?: number;
  sidebarWidth?: number;
}

export const TimeZoneRow = ({
  data,
  onRemove,
  t,
  dragHandleProps,
  isDragging = false,
  isReference = false,
  sidebarOnly = false,
  timelineOnly = false,
  columnWidth = 60,
  sidebarWidth = 256,
}: TimeZoneRowProps) => {
  const { city, gmtOffset, formattedTime, formattedDate, timezoneAbbr, hours } = data;
  const rowRef = useRef<HTMLDivElement>(null);

  // Format location display
  const locationDisplay = city.state && (city.country === 'USA' || city.country === 'United States')
    ? `${city.country}, ${city.state}`
    : city.country;
  
  // Format timezone label (GMT offset or abbreviation)
  const timezoneLabel = timezoneAbbr || gmtOffset;

  // Sidebar only (for fixed left column)
  if (sidebarOnly) {
    // Format offset display (+15, +8, -6, etc.)
    const offsetDisplay = data.offsetFromReference !== undefined && data.offsetFromReference !== 0
      ? `${data.offsetFromReference >= 0 ? '+' : ''}${data.offsetFromReference}`
      : null;

    // Extract time and date from formattedTime
    const timeOnly = formattedTime.split(' ')[0]; // e.g., "8:34p"
    
    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`bg-white border-b border-apple-border transition-apple ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className="flex h-14 flex-shrink-0 items-center">
          {/* Compact single-line layout */}
          <div 
            className="flex-shrink-0 flex items-center justify-between w-full px-3 border-r border-apple-border"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Left side - City info */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {/* Drag Handle */}
              {dragHandleProps && (
                <div
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Drag to reorder"
                >
                  <svg width="10" height="14" viewBox="0 0 12 16" fill="currentColor">
                    <circle cx="3" cy="4" r="1.5" />
                    <circle cx="9" cy="4" r="1.5" />
                    <circle cx="3" cy="8" r="1.5" />
                    <circle cx="9" cy="8" r="1.5" />
                    <circle cx="3" cy="12" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                  </svg>
                </div>
              )}

              {/* Home icon OR offset number */}
              {isReference ? (
                <span className="text-sm flex-shrink-0">🏠</span>
              ) : offsetDisplay ? (
                <span className="text-[10px] text-blue-600 font-medium w-7 flex-shrink-0">
                  {offsetDisplay}
                </span>
              ) : null}

              {/* City name */}
              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                {city.name}
              </span>

              {/* Timezone badge */}
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded flex-shrink-0">
                {timezoneLabel}
              </span>

              {/* Separator */}
              <span className="text-gray-300 flex-shrink-0 text-xs">·</span>

              {/* Country/State */}
              <span className="text-xs text-gray-500 truncate">
                {locationDisplay}
              </span>
            </div>

            {/* Right side - Time */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {/* Current time - large */}
              <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                {timeOnly}
              </span>

              {/* Date - smaller */}
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formattedDate}
              </span>

              {/* Remove button */}
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none ml-0.5 flex-shrink-0"
                aria-label={t('remove')}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Timeline only (for scrollable right column)
  if (timelineOnly) {
    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`bg-white border-b border-apple-border transition-apple ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className="flex h-14 flex-shrink-0">
          <div className="flex-1 flex items-center">
            <div
              className="flex min-w-max relative h-full"
              data-hours-grid
            >
              {hours.map((slot) => {
                // Simplified display: only hour number
                // Font size adjusted for narrower columns (20-30px)
                const fontSize = columnWidth >= 24 ? '12px' : '11px';
                const showDateIndicator = columnWidth >= 24;
                
                return (
                  <div
                    key={slot.columnIndex}
                    className={`
                      h-full flex items-center justify-center
                      border-r-0 cursor-pointer transition-colors relative z-10 py-0.5
                      ${
                        slot.isCurrentHour
                          ? 'bg-blue-500 text-white shadow-md rounded'
                          : slot.isBusinessHour
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-600'
                      }
                    `}
                    style={{
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`,
                      flexShrink: 0,
                      height: '56px',
                    }}
                  >
                    <div className="text-center">
                      {/* Only hour number - simplified display */}
                      <div 
                        className="font-medium leading-none"
                        style={{ fontSize }}
                      >
                        {slot.localHour}
                      </div>
                      {/* Date indicator - only show if column is wide enough */}
                      {showDateIndicator && slot.isNextDay && (
                        <div className="text-[7px] text-gray-400 mt-0.5 leading-none">+1d</div>
                      )}
                      {showDateIndicator && slot.isPreviousDay && (
                        <div className="text-[7px] text-gray-400 mt-0.5 leading-none">-1d</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full row (fallback - should not be used with new structure)
  return null;
};
