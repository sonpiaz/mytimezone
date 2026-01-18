/**
 * Layout constants - Magic numbers moved here for maintainability
 */

// Breakpoints
export const BREAKPOINT_DESKTOP = 1024; // px
export const BREAKPOINT_MOBILE = 640; // px

// Sidebar widths
export const SIDEBAR_WIDTH_DESKTOP = 300; // px - Compact sidebar for desktop
export const SIDEBAR_WIDTH_MOBILE = 340; // px - Increased to fit time/date fully
export const SIDEBAR_WIDTH_MOBILE_VIEW = 160; // px - Fixed width for mobile sidebar

// Column widths
export const MIN_COLUMN_WIDTH = 20; // px - Minimum for readability
export const MAX_COLUMN_WIDTH = 50; // px - Increased to allow larger columns on wide screens
export const MOBILE_COLUMN_WIDTH = 24; // px
export const DEFAULT_COLUMN_WIDTH = 60; // px

// Row heights
export const ROW_HEIGHT_DESKTOP = 80; // px (sidebar + timeline)
export const ROW_HEIGHT_MOBILE = 88; // px (sidebar + timeline)
export const HOUR_ROW_HEIGHT_DESKTOP = 56; // px (h-14)
export const HOUR_ROW_HEIGHT_MOBILE = 64; // px (h-16)
export const DATE_HEADER_HEIGHT = 24; // px (h-6)
export const MOBILE_ROW_HEIGHT = 100; // px

// Padding and spacing
export const CONTAINER_PADDING = 64; // px - margins and padding
export const SIDEBAR_PADDING = 16; // px (p-4)

// Timeline
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const MILLISECONDS_PER_MINUTE = 60000;

// Drag & Drop
export const DRAG_ACTIVATION_DISTANCE = 8; // px
