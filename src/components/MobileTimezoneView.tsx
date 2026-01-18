import { useRef, useEffect } from 'react';
import type { TimeZoneData } from '../types';
import { HourCell } from './HourCell';
import { SortableTimeZoneRow } from './SortableTimeZoneRow';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SIDEBAR_WIDTH_MOBILE_VIEW, MOBILE_ROW_HEIGHT, DATE_HEADER_HEIGHT, HOURS_PER_DAY } from '../constants/layout';

interface MobileTimezoneViewProps {
  timezoneData: TimeZoneData[];
  currentHourColumn: number | null;
  hoveredColumnIndex: number | null;
  columnWidth: number;
  onRemoveCity: (cityId: string) => void;
  t: (key: string) => string;
}

export const MobileTimezoneView = ({
  timezoneData,
  currentHourColumn,
  hoveredColumnIndex,
  columnWidth,
  onRemoveCity,
  t,
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
      {/* LEFT: Sidebar - Fixed, không scroll - With SortableContext for drag & drop */}
      <div 
        className="flex-shrink-0 bg-white z-10 border-r border-notion-borderLight" 
        style={{ width: `${SIDEBAR_WIDTH_MOBILE_VIEW}px` }}
      >
        <SortableContext
          items={timezoneData.map((data) => data.city.id)}
          strategy={verticalListSortingStrategy}
        >
          {timezoneData.map((data) => (
            <div 
              key={data.city.id}
              className="border-b border-[#F0F0F0]"
              style={{ minHeight: '80px', height: '80px' }}
            >
              <SortableTimeZoneRow
                data={data}
                onRemove={() => onRemoveCity(data.city.id)}
                t={t}
                sidebarOnly={true}
                sidebarWidth={SIDEBAR_WIDTH_MOBILE_VIEW}
                hoveredColumnIndex={null}
                isDesktop={false}
              />
            </div>
          ))}
        </SortableContext>
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
                className="flex items-end border-b border-notion-borderLight relative"
                style={{ 
                  minHeight: '80px', 
                  height: '80px',
                  marginTop: rowIndex === 0 ? `${DATE_HEADER_HEIGHT}px` : '0' 
                }}
              >
                {/* Hour cells row */}
                <div className="flex h-full items-end w-full">
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
