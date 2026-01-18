import type { TimeZoneData } from '../types';
import { DATE_HEADER_HEIGHT, HOUR_ROW_HEIGHT_DESKTOP, HOUR_ROW_HEIGHT_MOBILE } from '../constants/layout';

interface CurrentTimeLineProps {
  timezoneData: TimeZoneData[];
  currentHourColumn: number | null;
  hoveredColumnIndex: number | null;
  columnWidth: number;
  sidebarWidth: number;
  showCurrentTime?: boolean; // Only show current time line if viewing today
}

export const CurrentTimeLine = ({
  timezoneData,
  currentHourColumn,
  hoveredColumnIndex,
  columnWidth,
  sidebarWidth,
  showCurrentTime = true,
}: CurrentTimeLineProps) => {
  // Only show indicator when viewing "Today"
  if (!showCurrentTime || timezoneData.length === 0) {
    return null;
  }

  // Determine active column: hover position OR current hour
  const activeColumn = hoveredColumnIndex !== null ? hoveredColumnIndex : currentHourColumn;
  
  // If no active column, don't show
  if (activeColumn === null) {
    return null;
  }

  // Calculate position: sidebar width + (column index * column width)
  const leftPosition = sidebarWidth + (activeColumn * columnWidth);

  // Detect mobile: if sidebarWidth < 400, it's likely mobile
  const isMobile = sidebarWidth < 400;
  const hourRowHeight = isMobile ? HOUR_ROW_HEIGHT_MOBILE : HOUR_ROW_HEIGHT_DESKTOP;
  
  // Calculate total height: number of cities × hour row height
  // Each city has one hour row (date header is separate, not included in the box)
  // IMPORTANT: Each timezone row has:
  // - Date header: 24px (DATE_HEADER_HEIGHT) - NOT included in box
  // - Hour row: 56px desktop / 64px mobile (HOUR_ROW_HEIGHT) - INCLUDED in box
  // - Margin between rows: mb-3 = 12px - NOT included in box (spacing between rows)
  const totalHeight = timezoneData.length * hourRowHeight;
  
  // Debug: Log to verify calculation (only in development)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('CurrentTimeLine Debug:', {
      citiesCount: timezoneData.length,
      hourRowHeight,
      totalHeight,
      activeColumn,
      isHovered: hoveredColumnIndex !== null,
      currentHour: currentHourColumn,
    });
  }

  // World Time Buddy style: Black border box around the entire column
  // Follow hover position if hovering, otherwise show at current hour
  // IMPORTANT: Ensure this is rendered outside any overflow containers
  return (
    <div
      className="absolute pointer-events-none z-30 transition-all duration-200 ease-out"
      style={{
        left: `${leftPosition}px`,
        top: `${DATE_HEADER_HEIGHT}px`, // Start after date header row
        width: `${columnWidth}px`,
        height: `${totalHeight}px`,
        minHeight: `${totalHeight}px`, // Ensure minimum height
        border: '2px solid #1a1a1a', // Black border (World Time Buddy style)
        borderRadius: '6px', // Slightly rounded corners
        boxSizing: 'border-box',
        backgroundColor: 'transparent', // No fill, only border
        // Ensure it's not clipped by parent overflow
        position: 'absolute',
      }}
      aria-hidden="true"
      aria-label={hoveredColumnIndex !== null ? "Hovered time indicator" : "Current time indicator"}
    />
  );
};
