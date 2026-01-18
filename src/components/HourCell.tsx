import type { HourData } from '../types';
import { getTimeOfDayStyle, getTimeOfDayColor } from '../utils/formatHelpers';
import { HOUR_ROW_HEIGHT_DESKTOP, HOUR_ROW_HEIGHT_MOBILE } from '../constants/layout';

interface HourCellProps {
  slot: HourData;
  columnWidth: number;
  isHovered: boolean;
  isDesktop: boolean;
}

export const HourCell = ({ slot, columnWidth, isHovered, isDesktop }: HourCellProps) => {
  const isMidnight = slot.localHour === 0;
  
  // Get gradient background color based on local hour
  const bgColor = getTimeOfDayColor(slot.localHour);
  
  // Override with hover color if hovered (but not current hour)
  const finalBgColor = isHovered && !slot.isCurrentHour 
    ? undefined // Use Tailwind hover class instead
    : bgColor;

  return (
    <div
      className={`
        h-full flex items-center justify-center
        border-r border-notion-borderLight cursor-pointer transition-notion relative z-10
        ${getTimeOfDayStyle(slot.localHour, slot.isCurrentHour, isHovered)}
        ${isHovered && !slot.isCurrentHour ? 'hover:bg-notion-hover' : ''}
      `}
      style={{
        // Desktop: Use grid, no fixed width. Mobile: Fixed width for scrolling
        ...(isDesktop ? {} : {
          width: `${columnWidth}px`,
          minWidth: `${columnWidth}px`,
          maxWidth: `${columnWidth}px`,
          flexShrink: 0,
        }),
        height: isDesktop ? `${HOUR_ROW_HEIGHT_DESKTOP}px` : `${HOUR_ROW_HEIGHT_MOBILE}px`,
        ...(finalBgColor && { backgroundColor: finalBgColor }),
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
};
