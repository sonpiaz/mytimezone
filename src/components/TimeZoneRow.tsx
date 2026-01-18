import { useRef } from 'react';
import type { TimeZoneData } from '../types';

interface TimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  onColumnHover?: (columnIndex: number) => void;
  onMouseMove?: (mouseX: number, columnIndex: number) => void;
  onColumnLeave?: () => void;
  isReference?: boolean;
  sidebarOnly?: boolean;
  timelineOnly?: boolean;
  columnWidth?: number;
  sidebarWidth?: number;
  hoveredColumnIndex?: number | null;
}

export const TimeZoneRow = ({
  data,
  onRemove,
  t,
  dragHandleProps,
  isDragging = false,
  onColumnHover,
  onMouseMove,
  onColumnLeave,
  isReference = false,
  sidebarOnly = false,
  timelineOnly = false,
  columnWidth = 60,
  sidebarWidth = 256,
  hoveredColumnIndex = null,
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
    return (
      <div
        ref={rowRef}
        data-timezone-row
        className={`bg-white border-b border-apple-border transition-apple ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <div className="flex h-24 flex-shrink-0">
          {/* Left Side - City Info & Time */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 pr-4 border-r border-apple-border p-4"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Left: Drag Handle */}
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Drag to reorder"
              >
                <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                  <circle cx="3" cy="4" r="1.5" />
                  <circle cx="9" cy="4" r="1.5" />
                  <circle cx="3" cy="10" r="1.5" />
                  <circle cx="9" cy="10" r="1.5" />
                  <circle cx="3" cy="16" r="1.5" />
                  <circle cx="9" cy="16" r="1.5" />
                </svg>
              </div>
            )}

            {/* Middle: City info */}
            <div className="flex-1 min-w-0">
              {/* Top row: GMT offset + home icon */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-medium">
                  {timezoneLabel}
                </span>
                {isReference && (
                  <span className="text-sm">🏠</span>
                )}
              </div>
              
              {/* City name - Large and bold */}
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                {city.name}
              </h3>
              
              {/* Country/State - Small and gray */}
              <p className="text-xs text-gray-500 mt-0.5">
                {locationDisplay}
              </p>
            </div>

            {/* Right: Current time display */}
            <div className="text-right flex-shrink-0">
              {/* Current time - Large */}
              <div className="text-lg font-semibold text-gray-900 leading-tight">
                {formattedTime.split(' ')[0]}
              </div>
              
              {/* Day and date - Small, blue */}
              <div className="text-xs text-blue-600 mt-0.5">
                {formattedDate}
              </div>
            </div>
            
            {/* Far right: Remove button */}
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-600 transition-colors ml-2 text-xl leading-none"
              aria-label={t('remove')}
            >
              ×
            </button>
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
        <div className="flex h-24 flex-shrink-0">
          <div className="flex-1 flex items-center">
            <div
              onMouseMove={(e) => {
                if (!onMouseMove) return;
                const gridRect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - gridRect.left;
                const columnIndex = Math.floor(mouseX / columnWidth);
                const clampedColumnIndex = Math.max(0, Math.min(23, columnIndex));
                // Calculate position relative to container for hover line
                const container = e.currentTarget.closest('[data-timezone-container]');
                if (container) {
                  const containerRect = (container as HTMLElement).getBoundingClientRect();
                  const absoluteX = e.clientX - containerRect.left;
                  onMouseMove(absoluteX, clampedColumnIndex);
                }
              }}
              onMouseLeave={onColumnLeave}
              className="flex min-w-max relative h-full"
              data-hours-grid
            >
              {hours.map((slot) => {
                // Simplified display: only hour number
                // Font size adjusted for narrower columns (20-30px)
                const fontSize = columnWidth >= 24 ? '13px' : '12px';
                const showDateIndicator = columnWidth >= 24;
                const isHovered = hoveredColumnIndex === slot.columnIndex;
                
                return (
                  <div
                    key={slot.columnIndex}
                    className={`
                      h-full flex flex-col items-center justify-center
                      border-r border-gray-200 cursor-pointer transition-all duration-200 relative z-10
                      ${
                        slot.isCurrentHour
                          ? 'bg-blue-500 text-white shadow-md rounded-lg'
                          : isHovered && !slot.isCurrentHour
                          ? 'bg-blue-100 rounded-lg shadow-sm'
                          : slot.isBusinessHour
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                    style={{
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`,
                      flexShrink: 0,
                    }}
                    onMouseEnter={() => onColumnHover?.(slot.columnIndex)}
                  >
                    <div className="text-center">
                      {/* Only hour number - simplified display */}
                      <div 
                        className="font-medium leading-tight"
                        style={{ fontSize }}
                      >
                        {slot.localHour}
                      </div>
                      {/* Date indicator - only show if column is wide enough */}
                      {showDateIndicator && slot.isNextDay && (
                        <div className="text-[8px] text-gray-400 mt-0.5 leading-tight">+1d</div>
                      )}
                      {showDateIndicator && slot.isPreviousDay && (
                        <div className="text-[8px] text-gray-400 mt-0.5 leading-tight">-1d</div>
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
