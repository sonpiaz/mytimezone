import { useEffect, useState } from 'react';

interface TimelineLayout {
  columnWidth: number;
  isDesktop: boolean;
  sidebarWidth: number;
}

const BREAKPOINT_DESKTOP = 1024;
const MIN_COLUMN_WIDTH = 20;
const MAX_COLUMN_WIDTH = 30;
const MOBILE_COLUMN_WIDTH = 24;

export const useTimelineLayout = (): TimelineLayout => {
  const [layout, setLayout] = useState<TimelineLayout>(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isDesktop = viewportWidth >= BREAKPOINT_DESKTOP;
    
    if (isDesktop) {
      const sidebarWidth = 320; // Increased for compact layout
      const padding = 64; // margins and padding
      const availableWidth = viewportWidth - sidebarWidth - padding;
      const calculatedWidth = Math.floor(availableWidth / 24);
      // Target ~24px per column, allow some flexibility
      const clampedWidth = Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, calculatedWidth));
      
      return {
        columnWidth: clampedWidth,
        isDesktop: true,
        sidebarWidth,
      };
    }
    
    return {
      columnWidth: MOBILE_COLUMN_WIDTH,
      isDesktop: false,
      sidebarWidth: 280, // Increased for compact layout
    };
  });

  useEffect(() => {
    const calculateLayout = () => {
      const viewportWidth = window.innerWidth;
      const isDesktop = viewportWidth >= BREAKPOINT_DESKTOP;
      
      if (isDesktop) {
        const sidebarWidth = 320; // Increased for compact layout
        const padding = 64; // margins and padding
        const availableWidth = viewportWidth - sidebarWidth - padding;
        const calculatedWidth = Math.floor(availableWidth / 24);
        // Target ~24px per column, allow some flexibility
        const clampedWidth = Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, calculatedWidth));
        
        setLayout({
          columnWidth: clampedWidth,
          isDesktop: true,
          sidebarWidth,
        });
      } else {
        setLayout({
          columnWidth: MOBILE_COLUMN_WIDTH,
          isDesktop: false,
          sidebarWidth: 280, // Increased for compact layout
        });
      }
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  return layout;
};
