import { useEffect, useState } from 'react';
import type { TimeZoneData } from '../types';

interface CurrentTimeLineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  timezoneData: TimeZoneData[];
  currentHourColumn: number;
  columnWidth: number;
  sidebarWidth: number;
}

export const CurrentTimeLine = ({ containerRef, timezoneData, currentHourColumn, columnWidth, sidebarWidth }: CurrentTimeLineProps) => {
  const [lineStyle, setLineStyle] = useState<React.CSSProperties | null>(null);

  const calculatePosition = () => {
    if (!containerRef.current || timezoneData.length === 0) {
      setLineStyle(null);
      return;
    }

    const rows = containerRef.current.querySelectorAll('[data-timezone-row]');
    if (rows.length === 0) {
      setLineStyle(null);
      return;
    }

    // Current time line should be at the current hour column in reference timezone
    const firstRow = rows[0] as HTMLElement;
    const firstGrid = firstRow?.querySelector('[data-hours-grid]') as HTMLElement;
    if (!firstGrid || !containerRef.current) {
      setLineStyle(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const firstGridRect = firstGrid.getBoundingClientRect();
    const timelineWidth = firstGridRect.width;
    const columnWidth = timelineWidth / 24;
    
    // Calculate position for current hour column
    const xPosition = firstGridRect.left - containerRect.left + (currentHourColumn * columnWidth) + (columnWidth / 2);

    // Calculate total height: from top of first row to bottom of last row
    const firstRowRect = (rows[0] as HTMLElement).getBoundingClientRect();
    const lastRowRect = (rows[rows.length - 1] as HTMLElement).getBoundingClientRect();
    const totalHeight = lastRowRect.bottom - firstRowRect.top;
    const topPosition = firstRowRect.top;

    setLineStyle({
      left: `${xPosition}px`,
      top: `${topPosition}px`,
      height: `${totalHeight}px`,
      transform: 'translateX(-50%)',
    });
  };

  useEffect(() => {
    calculatePosition();

    // Update every minute (60 seconds) as specified
    const interval = setInterval(calculatePosition, 60000);

    // Also update on scroll/resize
    const handleUpdate = () => calculatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [containerRef, timezoneData, currentHourColumn, columnWidth, sidebarWidth]);

  if (!lineStyle || !containerRef.current) return null;

  return (
    <div
      className="absolute w-[3px] bg-gray-900 pointer-events-none z-20"
      style={{
        ...lineStyle,
        transition: 'left 0.3s ease-out',
      }}
    />
  );
};
