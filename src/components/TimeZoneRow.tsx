import { useRef } from 'react';
import type { TimeZoneData } from '../types';
import { CitySidebar } from './CitySidebar';
import { TimelineGrid } from './TimelineGrid';
import { formatLocation, formatOffset, getTimeOnly } from '../utils/formatHelpers';

interface TimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isReference?: boolean;
  sidebarOnly?: boolean;
  timelineOnly?: boolean;
  fullRow?: boolean; // New: render full row with responsive layout
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
  fullRow = false,
  columnWidth = 60,
  sidebarWidth = 256,
  hoveredColumnIndex = null,
  isDesktop = true,
}: TimeZoneRowProps) => {
  const { city, gmtOffset, formattedTime, formattedDate, timezoneAbbr, hours } = data;
  const rowRef = useRef<HTMLDivElement>(null);
  
  // Format timezone label (GMT offset or abbreviation)
  const timezoneLabel = timezoneAbbr || gmtOffset;

  // Sidebar only (for fixed left column)
  if (sidebarOnly) {
    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`group bg-white rounded-xl border border-notion-border mb-3 overflow-hidden hover:shadow-notion-md transition-notion timezone-row ${
          isDragging ? 'cursor-grabbing opacity-50' : ''
        }`}
      >
        <CitySidebar
          data={data}
          onRemove={onRemove}
          t={t}
          dragHandleProps={dragHandleProps}
          isReference={isReference}
          sidebarWidth={sidebarWidth}
        />
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
        <TimelineGrid
          hours={hours}
          columnWidth={columnWidth}
          hoveredColumnIndex={hoveredColumnIndex}
          isDesktop={isDesktop}
        />
      </div>
    );
  }

  // Full row - Responsive layout: stacked on mobile, side-by-side on desktop
  if (fullRow) {
    const offsetDisplay = formatOffset(data);
    const timeOnly = getTimeOnly(formattedTime);
    const locationDisplay = formatLocation(city);

    // Find current hour column index
    const currentHourColumn = hours.findIndex(h => h.isCurrentHour);
    const activeColumn = hoveredColumnIndex !== null ? hoveredColumnIndex : currentHourColumn;
    const isHovered = hoveredColumnIndex !== null;

    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`group bg-white rounded-xl border border-notion-border mb-3 overflow-hidden hover:shadow-notion-md transition-notion timezone-row relative ${
          isDragging ? 'cursor-grabbing opacity-50' : ''
        }`}
      >
        {/* Mobile: flex-col (stacked), Desktop: flex-row (side-by-side) */}
        <div className="flex flex-col md:flex-row">
          {/* City Info Section - Full width on mobile, fixed width on desktop */}
          <div className="
            w-full
            md:w-[320px]
            md:flex-shrink-0
            p-4
            border-b border-notion-borderLight
            md:border-b-0 md:border-r
          ">
            <div className="flex items-center justify-between">
              {/* Left: drag handle + icon/offset + city info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
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

                {/* City + Country */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-notion-text text-sm truncate">
                      {city.name}
                    </span>
                    <span className="text-xs text-notion-textLighter flex-shrink-0">
                      {timezoneLabel}
                    </span>
                  </div>
                  <span className="text-xs text-notion-textLighter truncate mt-0.5">
                    {locationDisplay}
                  </span>
                </div>
              </div>
              
              {/* Right: current time + date */}
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-xl font-semibold text-notion-text whitespace-nowrap leading-tight tabular-nums">
                  {timeOnly}
                </div>
                <div className="text-xs text-notion-textLighter whitespace-nowrap leading-tight mt-0.5">
                  {formattedDate}
                </div>
              </div>

              {/* Remove button - appears on hover */}
              <button
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 text-notion-textPlaceholder hover:text-notion-textLight hover:bg-notion-hover p-1 rounded-md transition-all ml-2 flex-shrink-0"
                aria-label={t('remove')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Timeline Section - Full width on mobile, scrollable */}
          <div 
            className="w-full md:flex-1 overflow-x-auto"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex flex-col flex-shrink-0 min-w-max">
              {/* Date Labels Row (empty - labels in hour 0 cell) */}
              <div className="flex h-6 text-xs text-notion-textLight border-b border-notion-borderLight">
                {hours.map((slot) => (
                  <div
                    key={`date-${slot.columnIndex}`}
                    className="flex flex-col items-center justify-end flex-shrink-0"
                    style={{
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`,
                    }}
                  />
                ))}
              </div>
              
              {/* Hour Numbers Row */}
              <TimelineGrid
                hours={hours}
                columnWidth={columnWidth}
                hoveredColumnIndex={hoveredColumnIndex}
                isDesktop={isDesktop}
              />
            </div>
            
            {/* Current Time Line - Mobile only (for fullRow mode) */}
            {activeColumn !== -1 && activeColumn !== null && (
              <div
                className="absolute pointer-events-none z-20 transition-notion"
                style={{
                  left: `${activeColumn * columnWidth}px`,
                  top: '24px', // After date header
                  width: `${columnWidth}px`,
                  height: isDesktop ? '56px' : '64px',
                  borderLeft: `2px solid ${isHovered ? '#2F81F7' : '#D0D0D0'}`,
                  borderRight: `2px solid ${isHovered ? '#2F81F7' : '#D0D0D0'}`,
                  boxSizing: 'border-box',
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not be used
  return null;
};
