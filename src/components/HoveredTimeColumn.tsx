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
    if (columnIndex === null || !isActive || !containerRef.current) {
      setLineStyle(null);
      return;
    }

    const updateLinePosition = () => {
      if (!containerRef.current) {
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
      });
    };

    updateLinePosition();
    window.addEventListener('scroll', updateLinePosition, true);
    window.addEventListener('resize', updateLinePosition);

    return () => {
      window.removeEventListener('scroll', updateLinePosition, true);
      window.removeEventListener('resize', updateLinePosition);
    };
  }, [columnIndex, isActive, containerRef, columnWidth, sidebarWidth]);

  if (!lineStyle || !isActive) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-all duration-150"
      style={{
        ...lineStyle,
        width: '4px',
        background: '#3b82f6',
        opacity: 0.3,
        borderRadius: '9999px',
      }}
    />
  );
};
