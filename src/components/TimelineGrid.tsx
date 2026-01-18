import type { HourData } from '../types';
import { HourCell } from './HourCell';

interface TimelineGridProps {
  hours: HourData[];
  columnWidth: number;
  hoveredColumnIndex: number | null;
  isDesktop: boolean;
}

export const TimelineGrid = ({
  hours,
  columnWidth,
  hoveredColumnIndex,
  isDesktop,
}: TimelineGridProps) => {
  return (
    <div className="flex flex-col flex-shrink-0">
      {/* Date Labels Row - Empty (labels shown in hour 0 cell) */}
      <div 
        className={`${isDesktop ? 'grid grid-cols-24' : 'flex'} h-6 text-xs text-notion-textLight border-b border-notion-borderLight`}
        style={isDesktop ? {
          gridTemplateColumns: 'repeat(24, 1fr)',
        } : {}}
      >
        {hours.map((slot) => (
          <div
            key={`date-${slot.columnIndex}`}
            className="flex flex-col items-center justify-end flex-shrink-0"
            style={isDesktop ? {} : {
              width: `${columnWidth}px`,
              minWidth: `${columnWidth}px`,
              maxWidth: `${columnWidth}px`,
            }}
          />
        ))}
      </div>

      {/* Hour Numbers Row */}
      <div className={`flex flex-shrink-0 ${isDesktop ? 'h-14' : 'h-16'}`}>
        <div className={`flex-1 flex items-center ${isDesktop ? '' : 'min-w-max'}`}>
          <div 
            className={`${isDesktop ? 'grid grid-cols-24 w-full' : 'flex min-w-max'} relative h-full`}
            data-hours-grid
            style={isDesktop ? {
              gridTemplateColumns: 'repeat(24, 1fr)',
            } : {}}
          >
            {hours.map((slot) => (
              <HourCell
                key={slot.columnIndex}
                slot={slot}
                columnWidth={columnWidth}
                isHovered={hoveredColumnIndex === slot.columnIndex}
                isDesktop={isDesktop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
