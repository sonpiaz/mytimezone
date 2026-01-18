import type { TimeZoneData } from '../types';

interface CurrentTimeLineProps {
  timezoneData: TimeZoneData[];
  currentHourColumn: number | null;
  hoveredColumnIndex: number | null;
  columnWidth: number;
  sidebarWidth: number;
}

export const CurrentTimeLine = ({
  timezoneData,
  currentHourColumn,
  hoveredColumnIndex,
  columnWidth,
  sidebarWidth,
}: CurrentTimeLineProps) => {
  // Determine which column to highlight
  // If hovering, show line at hovered column; otherwise show at current hour
  const activeColumn = hoveredColumnIndex !== null ? hoveredColumnIndex : currentHourColumn;

  if (activeColumn === null || timezoneData.length === 0) {
    return null;
  }

  // Calculate position: sidebar width + (column index * column width)
  // No margin needed since sidebar and timeline are in same row now
  const leftPosition = sidebarWidth + (activeColumn * columnWidth);

  // Calculate height: only hour rows, excluding date header rows
  // Each row has: date header (h-6 = 24px) + hour row (h-14 = 56px on desktop, h-16 = 64px on mobile) = 80px total
  // Line should only cover hour rows
  const dateHeaderHeight = 24; // h-6 = 24px
  // Detect mobile: if sidebarWidth < 400, it's likely mobile
  const isMobile = sidebarWidth < 400;
  const hourRowHeight = isMobile ? 64 : 56; // h-16 = 64px on mobile, h-14 = 56px on desktop
  const totalHourRowsHeight = timezoneData.length * hourRowHeight;

  // Determine if this is hovered column or current hour column
  const isHovered = hoveredColumnIndex !== null;

  return (
    <div
      className="absolute pointer-events-none z-20 transition-all duration-150 ease-out"
      style={{
        left: `${leftPosition}px`,
        top: `${dateHeaderHeight}px`, // Start after date header row
        width: `${columnWidth}px`,
        height: `${totalHourRowsHeight}px`, // Only height of hour rows
        borderLeft: `1px solid ${isHovered ? '#60a5fa' : '#9ca3af'}`, // solid border, blue-400 when hovered, gray-400 for current hour
        borderRight: `1px solid ${isHovered ? '#60a5fa' : '#9ca3af'}`,
        boxSizing: 'border-box',
      }}
      aria-hidden="true"
    />
  );
};
