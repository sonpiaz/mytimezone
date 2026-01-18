import { useEffect, useState } from 'react';
import {
  BREAKPOINT_DESKTOP,
  MIN_COLUMN_WIDTH,
  MOBILE_COLUMN_WIDTH,
  SIDEBAR_WIDTH_DESKTOP,
  SIDEBAR_WIDTH_MOBILE,
  CONTAINER_PADDING,
  HOURS_PER_DAY,
} from '../constants/layout';

interface TimelineLayout {
  columnWidth: number;
  isDesktop: boolean;
  sidebarWidth: number;
}

export const useTimelineLayout = (): TimelineLayout => {
  const [layout, setLayout] = useState<TimelineLayout>(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : BREAKPOINT_DESKTOP;
    const isDesktop = viewportWidth >= BREAKPOINT_DESKTOP;
    
      if (isDesktop) {
        // Calculate available width: viewport - sidebar - container padding
        const availableWidth = viewportWidth - SIDEBAR_WIDTH_DESKTOP - CONTAINER_PADDING;
        // Calculate column width to fit exactly 24 columns
        const calculatedWidth = availableWidth / HOURS_PER_DAY;
        // Only clamp if too small, allow larger columns on wide screens
        const clampedWidth = Math.max(MIN_COLUMN_WIDTH, calculatedWidth);
        
        return {
          columnWidth: clampedWidth,
          isDesktop: true,
          sidebarWidth: SIDEBAR_WIDTH_DESKTOP,
        };
      }
    
    return {
      columnWidth: MOBILE_COLUMN_WIDTH,
      isDesktop: false,
      sidebarWidth: SIDEBAR_WIDTH_MOBILE,
    };
  });

  useEffect(() => {
    const calculateLayout = () => {
      const viewportWidth = window.innerWidth;
      const isDesktop = viewportWidth >= BREAKPOINT_DESKTOP;
      
      if (isDesktop) {
        // Calculate available width: viewport - sidebar - container padding
        const availableWidth = viewportWidth - SIDEBAR_WIDTH_DESKTOP - CONTAINER_PADDING;
        // Calculate column width to fit exactly 24 columns
        const calculatedWidth = availableWidth / HOURS_PER_DAY;
        // Only clamp if too small, allow larger columns on wide screens
        const clampedWidth = Math.max(MIN_COLUMN_WIDTH, calculatedWidth);
        
        setLayout({
          columnWidth: clampedWidth,
          isDesktop: true,
          sidebarWidth: SIDEBAR_WIDTH_DESKTOP,
        });
      } else {
        setLayout({
          columnWidth: MOBILE_COLUMN_WIDTH,
          isDesktop: false,
          sidebarWidth: SIDEBAR_WIDTH_MOBILE,
        });
      }
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  return layout;
};
