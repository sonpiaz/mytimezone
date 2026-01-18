import { useRef, useEffect } from 'react';
import type { TimeZoneData } from '../types';
import { HourCell } from './HourCell';
import { formatLocation, formatOffset, getTimeOnly } from '../utils/formatHelpers';
import { SIDEBAR_WIDTH_MOBILE_VIEW, MOBILE_ROW_HEIGHT, DATE_HEADER_HEIGHT, HOURS_PER_DAY } from '../constants/layout';

interface MobileTimezoneViewProps {
  timezoneData: TimeZoneData[];
  currentHourColumn: number | null;
  hoveredColumnIndex: number | null;
  columnWidth: number;
}

export const MobileTimezoneView = ({
  timezoneData,
  currentHourColumn,
  hoveredColumnIndex,
  columnWidth,
}: MobileTimezoneViewProps) => {
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (timelineScrollRef.current && currentHourColumn !== null && timezoneData.length > 0) {
      const scrollPosition = currentHourColumn * columnWidth - (window.innerWidth / 2) + SIDEBAR_WIDTH_MOBILE_VIEW;
      timelineScrollRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
    }
  }, [currentHourColumn, columnWidth, timezoneData.length]);

  return (
    <div className="flex w-full relative">
      {/* LEFT: Sidebar - Fixed, không scroll */}
      <div className="flex-shrink-0 bg-white z-10 border-r border-notion-borderLight" style={{ width: `${SIDEBAR_WIDTH_MOBILE_VIEW}px` }}>
        {timezoneData.map((data) => {
          const offsetDisplay = formatOffset(data);
          const timeOnly = getTimeOnly(data.formattedTime);
          const locationDisplay = formatLocation(data.city);
          const timezoneLabel = data.timezoneAbbr || data.gmtOffset;

          return (
            <div
              key={data.city.id}
              style={{ height: `${MOBILE_ROW_HEIGHT}px` }}
              className="p-3 border-b border-notion-borderLight flex flex-col justify-between"
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
        <div className="min-w-max relative" style={{ minWidth: `${HOURS_PER_DAY * columnWidth}px` }}>
          {/* Current Time Line - spans all rows (only show if currentHourColumn is not null) */}
          {timezoneData.length > 0 && currentHourColumn !== null && (
            <div
              className="absolute pointer-events-none z-20 transition-notion"
              style={{
                left: `${currentHourColumn * columnWidth}px`,
                top: `${DATE_HEADER_HEIGHT}px`,
                width: `${columnWidth}px`,
                height: `${timezoneData.length * MOBILE_ROW_HEIGHT}px`,
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
                style={{ marginTop: rowIndex === 0 ? `${DATE_HEADER_HEIGHT}px` : '0' }}
              >
                {/* Hour cells row */}
                <div className="flex h-full items-end">
                  {hours.map((slot) => (
                    <HourCell
                      key={slot.columnIndex}
                      slot={slot}
                      columnWidth={columnWidth}
                      isHovered={hoveredColumnIndex === slot.columnIndex}
                      isDesktop={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
