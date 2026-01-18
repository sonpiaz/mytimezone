import type { TimeZoneData } from '../types';
import { formatLocation, formatOffset, getTimeOnly } from '../utils/formatHelpers';
import { SIDEBAR_WIDTH_MOBILE } from '../constants/layout';

interface CitySidebarProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isReference: boolean;
  sidebarWidth?: number;
}

export const CitySidebar = ({
  data,
  onRemove,
  t,
  dragHandleProps,
  isReference,
  sidebarWidth = SIDEBAR_WIDTH_MOBILE,
}: CitySidebarProps) => {
  const { city, formattedTime, formattedDate, timezoneAbbr, gmtOffset } = data;
  const offsetDisplay = formatOffset(data);
  const timeOnly = getTimeOnly(formattedTime);
  const locationDisplay = formatLocation(city);
  const timezoneLabel = timezoneAbbr || gmtOffset;
  const isMobileSidebar = sidebarWidth < 400;
  const isCompactSidebar = sidebarWidth <= 300; // Desktop compact sidebar

  return (
    <div
      className={`flex flex-shrink-0 items-center ${isMobileSidebar ? 'h-24' : 'h-20'} ${isCompactSidebar ? 'p-3' : 'p-4'}`}
    >
      {/* Column 1: Drag handle + Remove button */}
      <div className={`flex flex-col items-center gap-1 ${isCompactSidebar ? 'w-6 mr-2' : 'w-8 mr-3'} flex-shrink-0`}>
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-notion-textPlaceholder hover:text-notion-textLight transition-colors flex-shrink-0"
            aria-label="Drag to reorder"
          >
            <svg width="10" height="14" viewBox="0 0 12 16" fill="currentColor">
              <circle cx="3" cy="4" r="1.5" />
              <circle cx="9" cy="4" r="1.5" />
              <circle cx="3" cy="8" r="1.5" />
              <circle cx="9" cy="8" r="1.5" />
              <circle cx="3" cy="12" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
            </svg>
          </div>
        )}

        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-notion-textPlaceholder hover:text-notion-textLight hover:bg-notion-hover p-1 rounded-md transition-all text-sm leading-none flex-shrink-0"
          aria-label={t('remove')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Column 2: Icon/Offset */}
      <div className={`flex items-center ${isCompactSidebar ? 'gap-1.5 mr-2' : 'gap-2 mr-3'} w-auto flex-shrink-0`}>
        {isReference ? (
          <svg
            className="w-4 h-4 flex-shrink-0 text-notion-textLight"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label="Home city"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        ) : offsetDisplay ? (
          <span className="text-xs font-medium text-notion-accent bg-notion-accentLight px-2 py-0.5 rounded-full flex-shrink-0">
            {offsetDisplay}
          </span>
        ) : null}
      </div>

      {/* Column 3: City + Country */}
      <div className={`flex flex-col flex-1 min-w-0 ${isCompactSidebar ? 'mr-2' : 'mr-4'}`}>
        <div className={`flex items-center ${isCompactSidebar ? 'gap-1.5' : 'gap-2'}`}>
          <span className={`font-semibold text-notion-text ${isCompactSidebar ? 'text-xs' : 'text-sm'} truncate`}>{city.name}</span>
          <span className="text-xs text-notion-textLighter flex-shrink-0">{timezoneLabel}</span>
        </div>
        <span className="text-xs text-notion-textLighter truncate mt-0.5">{locationDisplay}</span>
      </div>

      {/* Column 4: Time + Date */}
      <div className={`flex flex-col items-end flex-shrink-0 ${isCompactSidebar ? 'min-w-[80px]' : 'min-w-[100px]'}`}>
        <span className={`${isCompactSidebar ? 'text-base' : 'text-lg'} font-semibold text-notion-text whitespace-nowrap leading-tight tabular-nums`}>
          {timeOnly}
        </span>
        <span className="text-xs text-notion-textLighter whitespace-nowrap leading-tight mt-0.5">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
