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

  // Calculate height: total height of all rows (including date header)
  // Each row has: date header (h-6 = 24px) + hour row (h-14 = 56px on desktop, h-16 = 64px on mobile) = 80px total
  // Detect mobile: if sidebarWidth < 400, it's likely mobile
  const isMobile = sidebarWidth < 400;
  const dateHeaderHeight = 24; // h-6 = 24px
  const hourRowHeight = isMobile ? 64 : 56; // h-16 = 64px on mobile, h-14 = 56px on desktop
  const rowHeight = dateHeaderHeight + hourRowHeight; // Total height per row: 80px (desktop) or 88px (mobile)
  const totalHeight = timezoneData.length * rowHeight; // Total height of all rows

  // Determine if this is hovered column or current hour column
  const isHovered = hoveredColumnIndex !== null;

  return (
    <div
      className="absolute pointer-events-none z-20 transition-notion"
      style={{
        left: `${leftPosition}px`,
        top: `${dateHeaderHeight}px`, // Start after first date header row
        width: `${columnWidth}px`,
        height: `${totalHeight - dateHeaderHeight}px`, // Height covering all hour rows (exclude first date header)
        borderLeft: `2px solid ${isHovered ? '#2F81F7' : '#D0D0D0'}`, // Notion accent blue when hovered, subtle gray for current hour
        borderRight: `2px solid ${isHovered ? '#2F81F7' : '#D0D0D0'}`,
        boxSizing: 'border-box',
      }}
      aria-hidden="true"
    >
      {/* Optional: small triangle indicator at top */}
      {isHovered && (
        <div 
          className="absolute -top-1 -left-[6px] w-0 h-0 
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[7px] border-t-[#2F81F7]"
        />
      )}
    </div>
  );
};
