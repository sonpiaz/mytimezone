import { useEffect, useState } from 'react';

interface HoveredTimeColumnProps {
  columnIndex: number | null;
  hoverPosition?: number | null; // Optional, not used anymore but kept for compatibility
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  columnWidth: number;
  sidebarWidth: number;
}

export const HoveredTimeColumn = ({ columnIndex, containerRef, isActive, columnWidth, sidebarWidth }: HoveredTimeColumnProps) => {
  const [lineStyle, setLineStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    // Clear line immediately if not active or no column index
    if (columnIndex === null || !isActive) {
      setLineStyle(null);
      return;
    }

    if (!containerRef.current) {
      setLineStyle(null);
      return;
    }

    const updateLinePosition = () => {
      // Double check conditions before updating
      if (!containerRef.current || columnIndex === null || !isActive) {
        setLineStyle(null);
        return;
      }

      const rows = containerRef.current.querySelectorAll('[data-timezone-row]');
      if (rows.length === 0) {
        setLineStyle(null);
        return;
      }

      // Calculate line position at the center of the column
      // Position = sidebarWidth + (columnIndex * columnWidth) + (columnWidth / 2)
      const linePosition = sidebarWidth + (columnIndex * columnWidth) + (columnWidth / 2);

      // Calculate total height: from top of first row to bottom of last row
      // Only calculate based on actual rows, not the entire container
      const firstRowRect = (rows[0] as HTMLElement).getBoundingClientRect();
      const lastRowRect = (rows[rows.length - 1] as HTMLElement).getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const totalHeight = lastRowRect.bottom - firstRowRect.top;
      const topPosition = firstRowRect.top - containerRect.top;

      setLineStyle({
        left: `${linePosition}px`,
        top: `${topPosition}px`,
        height: `${totalHeight}px`,
        width: '2px',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      });
    };

    updateLinePosition();
    window.addEventListener('scroll', updateLinePosition, true);
    window.addEventListener('resize', updateLinePosition);

    return () => {
      window.removeEventListener('scroll', updateLinePosition, true);
      window.removeEventListener('resize', updateLinePosition);
      // Clear line style when effect cleans up
      setLineStyle(null);
    };
  }, [columnIndex, isActive, containerRef, columnWidth, sidebarWidth]);

  // Return null if not active, columnIndex is null, or no lineStyle
  if (!isActive || columnIndex === null || !lineStyle) return null;

  return (
    <div
      className="absolute pointer-events-none z-30 transition-all duration-150"
      style={{
        ...lineStyle,
        width: '2px',
        background: '#6b7280',
        opacity: 0.6,
        borderRadius: '9999px',
      }}
    />
  );
};
