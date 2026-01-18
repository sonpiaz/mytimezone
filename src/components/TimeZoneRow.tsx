import { useRef } from 'react';
import type { TimeZoneData } from '../types';

// Get time-of-day color styling based on hour
// Note: Current hour is marked by border line (CurrentTimeLine component), not background color
const getTimeOfDayStyle = (hour: number, isCurrentHour: boolean, isHovered: boolean): string => {
  // Hover state (but not current hour - current hour uses border line)
  if (isHovered && !isCurrentHour) {
    return 'bg-blue-100 text-gray-700';
  }
  
  // Time-of-day colors (applied to all hours, including current hour)
  if (hour >= 0 && hour < 8) {
    // Night/Early morning (0:00 - 8:00) - Gray
    return 'bg-gray-100 text-gray-400';
  } else if (hour >= 8 && hour < 17) {
    // Business hours (8:00 - 17:00) - Light Green
    return 'bg-green-50 text-green-700';
  } else if (hour >= 17 && hour < 21) {
    // Evening (17:00 - 21:00) - Light Amber/Yellow
    return 'bg-amber-50 text-amber-700';
  } else {
    // Late night (21:00 - 24:00) - Slate Gray
    return 'bg-slate-100 text-slate-500';
  }
};

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
  hoveredColumnIndex?: number | null;
  isDesktop?: boolean;
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
  hoveredColumnIndex = null,
  isDesktop = true,
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

    // Extract time and date from formattedTime (now 24h format: "21:33")
    const timeOnly = formattedTime.split(' ')[0]; // e.g., "21:33"
    
    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`bg-white border-b border-gray-200 transition-apple ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className={`flex flex-shrink-0 items-start ${sidebarWidth && sidebarWidth < 400 ? 'h-24 py-3' : 'h-20 py-2'}`}>
          {/* Two-line layout with fixed-width columns for alignment */}
          <div 
            className="flex-shrink-0 flex items-start w-full px-4 border-r border-apple-border relative z-10 bg-white"
            style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}
          >
            {/* Column 1: Drag handle + Remove button (stacked vertically) */}
            <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
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

              {/* Remove button - below drag handle */}
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors text-sm leading-none flex-shrink-0"
                aria-label={t('remove')}
              >
                ×
              </button>
            </div>

            {/* Column 2: Icon/Offset */}
            <div className="flex items-center gap-2 w-12 flex-shrink-0">
              {/* Home icon OR offset number */}
              {isReference ? (
                <svg 
                  className="w-4 h-4 flex-shrink-0" 
                  viewBox="0 0 24 24" 
                  fill="black"
                  aria-label="Home city"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              ) : offsetDisplay ? (
                <span className="text-xs text-blue-600 font-medium flex-shrink-0">
                  {offsetDisplay}
                </span>
              ) : null}
            </div>

            {/* Column 3: City + Country - FIXED WIDTH for vertical alignment */}
            <div className="flex flex-col w-40 flex-shrink-0">
              {/* Line 1: City name + Timezone badge */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                  {city.name}
                </span>
                <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                  {timezoneLabel}
                </span>
              </div>
              
              {/* Line 2: Country/State - aligned vertically */}
              <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                {locationDisplay}
              </span>
            </div>

            {/* Column 4: Time + Date - RIGHT ALIGNED with gap */}
            <div className="flex flex-col items-end ml-auto flex-shrink-0 min-w-[120px] pr-1">
              {/* Line 1: Time */}
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap leading-tight">
                {timeOnly}
              </span>
              
              {/* Line 2: Date - with gap from time */}
              <span className="text-xs text-gray-500 whitespace-nowrap leading-tight mt-1">
                {formattedDate}
              </span>
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
        className={`bg-white border-b border-gray-200 transition-apple ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className="flex flex-col flex-shrink-0">
          {/* Date Labels Row - REMOVED: Date labels now show inside hour 0 cell instead */}
          <div className="flex h-6 text-xs text-gray-500 border-b border-gray-100">
            {hours.map((slot) => {
              // Date labels are now shown inside the hour 0 cell, not in a separate row
              return (
                <div
                  key={`date-${slot.columnIndex}`}
                  className="flex flex-col items-center justify-end flex-shrink-0"
                  style={{
                    width: `${columnWidth}px`,
                    minWidth: `${columnWidth}px`,
                    maxWidth: `${columnWidth}px`,
                  }}
                >
                  {/* Empty - date labels moved to hour cell */}
                </div>
              );
            })}
          </div>
          
          {/* Hour Numbers Row - Taller on mobile for better touch targets */}
          <div className={`flex flex-shrink-0 ${isDesktop ? 'h-14' : 'h-16'}`}>
            <div className="flex-1 flex items-center">
              <div
                className="flex min-w-max relative h-full"
                data-hours-grid
              >
                {hours.map((slot) => {
                  // Font size adjusted for narrower columns (20-30px)
                  const fontSize = columnWidth >= 24 ? '11px' : '10px';
                  const isHovered = hoveredColumnIndex === slot.columnIndex;
                  const isMidnight = slot.localHour === 0;
                  
                  return (
                    <div
                      key={slot.columnIndex}
                      className={`
                        h-full flex items-center justify-center
                        border-r-0 cursor-pointer transition-colors relative z-10 rounded-lg
                        ${getTimeOfDayStyle(slot.localHour, slot.isCurrentHour, isHovered)}
                      `}
                      style={{
                        width: `${columnWidth}px`,
                        minWidth: `${columnWidth}px`,
                        maxWidth: `${columnWidth}px`,
                        flexShrink: 0,
                        height: isDesktop ? '56px' : '64px', // h-14 on desktop, h-16 on mobile
                      }}
                    >
                      <div className="text-center">
                        {/* At midnight (hour 0): Show date label instead of number (2 lines only) */}
                        {isMidnight && slot.dayName && slot.dateLabel ? (
                          <div className="flex flex-col items-center justify-center leading-tight">
                            <span className="text-xs text-gray-500 leading-none font-medium uppercase">
                              {slot.dayName}
                            </span>
                            <span className="text-xs text-gray-500 leading-none mt-0.5">
                              {slot.dateLabel}
                            </span>
                          </div>
                        ) : (
                          /* Normal hour: Show hour number */
                          <div 
                            className="font-medium leading-none text-xs"
                            style={{ fontSize }}
                          >
                            {slot.localHour}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full row (fallback - should not be used with new structure)
  return null;
};
