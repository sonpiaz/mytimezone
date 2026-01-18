import { useRef } from 'react';
import type { TimeZoneData } from '../types';

// Get time-of-day color styling based on hour (Notion-style softer pastels)
// Note: Current hour is marked by border line (CurrentTimeLine component), not background color
const getTimeOfDayStyle = (hour: number, isCurrentHour: boolean, isHovered: boolean): string => {
  // Hover state (but not current hour - current hour uses border line)
  if (isHovered && !isCurrentHour) {
    return 'bg-notion-hover text-notion-text';
  }
  
  // Time-of-day colors (applied to all hours, including current hour)
  if (hour >= 0 && hour < 8) {
    // Night/Early morning (0:00 - 8:00) - Very light warm gray
    return 'bg-hour-night text-notion-textLight';
  } else if (hour >= 8 && hour < 17) {
    // Business hours (8:00 - 17:00) - Very light green
    return 'bg-hour-business text-notion-text';
  } else if (hour >= 17 && hour < 21) {
    // Evening (17:00 - 21:00) - Very light amber
    return 'bg-hour-evening text-notion-text';
  } else {
    // Late night (21:00 - 24:00) - Light cool gray
    return 'bg-hour-lateNight text-notion-textLight';
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
        className={`group bg-white rounded-xl border border-notion-border mb-3 overflow-hidden hover:shadow-notion-md transition-notion timezone-row ${
          isDragging ? 'cursor-grabbing opacity-50' : ''
        }`}
      >
        <div className={`flex flex-shrink-0 items-center ${sidebarWidth && sidebarWidth < 400 ? 'h-24' : 'h-20'} p-4`}>
          {/* Column 1: Drag handle + Remove button (stacked vertically) */}
          <div className="flex flex-col items-center gap-1 w-8 flex-shrink-0 mr-3">
            {/* Drag Handle */}
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing text-notion-textPlaceholder hover:text-notion-textLight transition-colors flex-shrink-0"
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

            {/* Remove button - below drag handle, appears on hover */}
            <button
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 text-notion-textPlaceholder hover:text-notion-textLight hover:bg-notion-hover p-1 rounded-md transition-all text-sm leading-none flex-shrink-0"
              aria-label={t('remove')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Column 2: Icon/Offset */}
          <div className="flex items-center gap-2 w-auto flex-shrink-0 mr-3">
            {/* Home icon OR offset badge */}
            {isReference ? (
              <svg 
                className="w-4 h-4 flex-shrink-0 text-notion-textLight" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-label="Home city"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            ) : offsetDisplay ? (
              <span className="text-xs font-medium text-notion-accent bg-notion-accentLight px-2 py-0.5 rounded-full flex-shrink-0">
                {offsetDisplay}
              </span>
            ) : null}
          </div>

          {/* Column 3: City + Country */}
          <div className="flex flex-col flex-1 min-w-0 mr-4">
            {/* Line 1: City name + Timezone badge */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-notion-text text-sm truncate">
                {city.name}
              </span>
              <span className="text-xs text-notion-textLighter flex-shrink-0">
                {timezoneLabel}
              </span>
            </div>
            
            {/* Line 2: Country/State */}
            <span className="text-xs text-notion-textLighter truncate mt-0.5">
              {locationDisplay}
            </span>
          </div>

          {/* Column 4: Time + Date - RIGHT ALIGNED */}
          <div className="flex flex-col items-end flex-shrink-0 min-w-[100px]">
            {/* Line 1: Time */}
            <span className="text-lg font-semibold text-notion-text whitespace-nowrap leading-tight tabular-nums">
              {timeOnly}
            </span>
            
            {/* Line 2: Date */}
            <span className="text-xs text-notion-textLighter whitespace-nowrap leading-tight mt-0.5">
              {formattedDate}
            </span>
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
        className={`bg-white transition-notion ${
          isDragging ? 'cursor-grabbing opacity-50' : ''
        }`}
      >
        <div className="flex flex-col flex-shrink-0">
          {/* Date Labels Row - REMOVED: Date labels now show inside hour 0 cell instead */}
          <div className="flex h-6 text-xs text-notion-textLight border-b border-notion-borderLight">
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
                  const isHovered = hoveredColumnIndex === slot.columnIndex;
                  const isMidnight = slot.localHour === 0;
                  
                  return (
                    <div
                      key={slot.columnIndex}
                      className={`
                        h-full flex items-center justify-center
                        border-r border-notion-borderLight cursor-pointer transition-notion relative z-10
                        ${getTimeOfDayStyle(slot.localHour, slot.isCurrentHour, isHovered)}
                        hover:bg-notion-hover
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
                            <span className="text-[10px] text-notion-textLight leading-none font-medium uppercase">
                              {slot.dayName}
                            </span>
                            <span className="text-[10px] text-notion-textLighter leading-none mt-0.5 uppercase">
                              {slot.dateLabel}
                            </span>
                          </div>
                        ) : (
                          /* Normal hour: Show hour number */
                          <span className="font-medium leading-none text-sm text-notion-text tabular-nums">
                            {slot.localHour}
                          </span>
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
