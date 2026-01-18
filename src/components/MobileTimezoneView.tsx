import { useRef, useEffect } from 'react';
import type { TimeZoneData } from '../types';

interface MobileTimezoneViewProps {
  timezoneData: TimeZoneData[];
  currentHourColumn: number | null;
  hoveredColumnIndex: number | null;
  columnWidth: number;
}

// Get time-of-day color styling
const getTimeOfDayStyle = (hour: number, isCurrentHour: boolean, isHovered: boolean): string => {
  if (isHovered && !isCurrentHour) {
    return 'bg-notion-hover text-notion-text';
  }
  
  if (hour >= 0 && hour < 8) {
    return 'bg-hour-night text-notion-textLight';
  } else if (hour >= 8 && hour < 17) {
    return 'bg-hour-business text-notion-text';
  } else if (hour >= 17 && hour < 21) {
    return 'bg-hour-evening text-notion-text';
  } else {
    return 'bg-hour-lateNight text-notion-textLight';
  }
};

export const MobileTimezoneView = ({
  timezoneData,
  currentHourColumn,
  hoveredColumnIndex,
  columnWidth,
}: MobileTimezoneViewProps) => {
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = 160; // Fixed width for mobile sidebar

  // Format location display
  const formatLocation = (data: TimeZoneData): string => {
    const { city } = data;
    if (city.state && (city.country === 'USA' || city.country === 'United States')) {
      return `${city.country}, ${city.state}`;
    }
    return city.country;
  };

  // Format offset display
  const formatOffset = (data: TimeZoneData): string | null => {
    if (data.offsetFromReference !== undefined && data.offsetFromReference !== 0) {
      return `${data.offsetFromReference >= 0 ? '+' : ''}${data.offsetFromReference}`;
    }
    return null;
  };

  // Extract time only (24h format: "21:33")
  const getTimeOnly = (formattedTime: string): string => {
    return formattedTime.split(' ')[0];
  };

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (timelineScrollRef.current && currentHourColumn !== null && timezoneData.length > 0) {
      const scrollPosition = currentHourColumn * columnWidth - (window.innerWidth / 2) + sidebarWidth;
      timelineScrollRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
    }
  }, [currentHourColumn, columnWidth, sidebarWidth, timezoneData.length]);

  return (
    <div className="flex w-full relative">
      {/* LEFT: Sidebar - Fixed, không scroll */}
      <div className="flex-shrink-0 bg-white z-10 border-r border-notion-borderLight" style={{ width: `${sidebarWidth}px` }}>
        {timezoneData.map((data) => {
          const offsetDisplay = formatOffset(data);
          const timeOnly = getTimeOnly(data.formattedTime);
          const locationDisplay = formatLocation(data);
          const timezoneLabel = data.timezoneAbbr || data.gmtOffset;

          return (
            <div
              key={data.city.id}
              className="h-[100px] p-3 border-b border-notion-borderLight flex flex-col justify-between"
            >
              {/* Top: Icon/Offset + City name */}
              <div className="flex items-center gap-2 mb-1">
                {data.isReference ? (
                  <svg 
                    className="w-4 h-4 flex-shrink-0 text-notion-textLight" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-label="Home city"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                ) : offsetDisplay ? (
                  <span className="text-xs font-medium text-notion-accent bg-notion-accentLight px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {offsetDisplay}
                  </span>
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-notion-text text-sm truncate">
                      {data.city.name}
                    </span>
                    <span className="text-xs text-notion-textLighter flex-shrink-0">
                      {timezoneLabel}
                    </span>
                  </div>
                  <span className="text-xs text-notion-textLighter truncate">
                    {locationDisplay}
                  </span>
                </div>
              </div>

              {/* Bottom: Current time + date */}
              <div>
                <div className="text-xl font-semibold text-notion-text tabular-nums leading-tight">
                  {timeOnly}
                </div>
                <div className="text-xs text-notion-textLighter leading-tight mt-0.5">
                  {data.formattedDate}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Timeline - Scroll cùng nhau */}
      <div 
        ref={timelineScrollRef}
        className="flex-1 overflow-x-auto relative"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        data-hours-grid
      >
        <div className="min-w-max relative" style={{ minWidth: `${24 * columnWidth}px` }}>
          {/* Current Time Line - spans all rows */}
          {timezoneData.length > 0 && currentHourColumn !== null && (
            <div
              className="absolute pointer-events-none z-20 transition-notion"
              style={{
                left: `${currentHourColumn * columnWidth}px`,
                top: '24px', // After date header
                width: `${columnWidth}px`,
                height: `${timezoneData.length * 100}px`, // Total height of all rows
                borderLeft: `2px solid ${hoveredColumnIndex !== null ? '#2F81F7' : '#D0D0D0'}`,
                borderRight: `2px solid ${hoveredColumnIndex !== null ? '#2F81F7' : '#D0D0D0'}`,
                boxSizing: 'border-box',
              }}
              aria-hidden="true"
            />
          )}

          {/* Timeline rows */}
          {timezoneData.map((data, rowIndex) => {
            const { hours } = data;

            return (
              <div
                key={data.city.id}
                className="h-[100px] flex items-end pb-2 border-b border-notion-borderLight relative"
                style={{ marginTop: rowIndex === 0 ? '24px' : '0' }}
              >
                {/* Hour cells row */}
                <div className="flex h-full items-end">
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
                          height: '100px',
                        }}
                      >
                        <div className="text-center">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
