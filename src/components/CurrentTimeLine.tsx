import { useRef, useEffect, useState } from 'react';
import { DATE_HEADER_HEIGHT } from '../constants/layout';

/**
 * Single Time Indicator Component
 * 
 * Renders ONE indicator that:
 * - Shows at current hour when not hovering
 * - Moves to hovered column when hovering
 * - Covers ALL cities dynamically
 * 
 * CRITICAL FIX: Uses DOM position directly instead of math calculation
 */
interface TimeIndicatorProps {
  cellPosition: { left: number; width: number } | null; // DOM position from hovered/current cell
  totalCities: number;               // Total number of cities (for dynamic height)
  isMobile?: boolean;                // Mobile layout flag
  showIndicator?: boolean;            // Only show when viewing "Today"
}

export const TimeIndicator = ({
  cellPosition,
  totalCities,
  isMobile = false,
  showIndicator = true,
}: TimeIndicatorProps) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [actualRowHeight, setActualRowHeight] = useState(0);
  const [topPosition, setTopPosition] = useState(0);

  // Don't show if disabled or no cities
  if (!showIndicator || totalCities === 0) {
    return null;
  }

  // Don't show if no valid position
  if (!cellPosition) {
    return null;
  }

  // CRITICAL FIX: Measure ACTUAL position and height from DOM
  useEffect(() => {
    const container = document.querySelector('[data-timezone-container]');
    
    if (container) {
      const containerRect = container.getBoundingClientRect();
      
      // Find all timeline rows to measure height
      const timelineRows = container.querySelectorAll('[data-timezone-row]');
      
      if (timelineRows.length > 0) {
        const firstRow = timelineRows[0] as HTMLElement;
        const lastRow = timelineRows[timelineRows.length - 1] as HTMLElement;
        
        const firstRect = firstRow.getBoundingClientRect();
        const lastRect = lastRow.getBoundingClientRect();
        
        // Calculate height: bottom of last row - top of first row
        const measuredTotalHeight = lastRect.bottom - firstRect.top;
        
        // Top position: first row top relative to container + date header height
        const topRelativeToContainer = firstRect.top - containerRect.top + DATE_HEADER_HEIGHT;
        
        // Height: total height minus date header
        const indicatorHeight = measuredTotalHeight - DATE_HEADER_HEIGHT;
        
        setTopPosition(topRelativeToContainer);
        setActualRowHeight(indicatorHeight);
        
        // Debug log
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.log('=== INDICATOR POSITION DEBUG ===');
          console.log('Container top:', containerRect.top);
          console.log('First row top:', firstRect.top);
          console.log('Top relative to container:', topRelativeToContainer);
          console.log('Indicator height:', indicatorHeight);
          console.log('Cell position left:', cellPosition.left);
          console.log('Cell position width:', cellPosition.width);
        }
      }
    }
  }, [totalCities, isMobile, cellPosition]);

  // Don't render until we have actual measurements
  if (actualRowHeight === 0 || !cellPosition) {
    return null;
  }

  return (
    <div
      ref={indicatorRef}
      className="absolute pointer-events-none z-30"
      style={{
        left: `${cellPosition.left}px`, // CRITICAL: Use DOM position directly
        top: `${topPosition}px`, // Measured from DOM
        width: `${cellPosition.width}px`, // CRITICAL: Use actual cell width
        height: `${actualRowHeight}px`, // Measured from DOM
        border: '2px solid #1a1a1a', // Black border (World Time Buddy style)
        borderRadius: '6px',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        transition: 'left 0.1s ease-out, width 0.1s ease-out', // Smooth movement
      }}
      aria-hidden="true"
      aria-label="Time indicator"
    />
  );
};
