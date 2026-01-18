import type { TimeZoneData } from '../types';
import { formatOffset, getTimeOnly } from '../utils/formatHelpers';

interface CitySidebarProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isReference: boolean;
  sidebarWidth?: number; // Kept for backward compatibility but not used
}

export const CitySidebar = ({
  data,
  onRemove,
  t,
  dragHandleProps,
  isReference,
}: CitySidebarProps) => {
  const { city, formattedTime, formattedDate } = data;
  const offsetDisplay = formatOffset(data);
  const timeOnly = getTimeOnly(formattedTime);

  return (
    <div className="flex flex-shrink-0 items-center gap-1.5 px-2 w-full h-[80px]">
      {/* Drag handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-[#9B9A97] hover:text-[#37352F] transition-colors flex-shrink-0"
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

      {/* Home icon or Offset badge */}
      {isReference ? (
        <svg
          className="w-4 h-4 flex-shrink-0 text-[#37352F]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-label="Home city"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ) : offsetDisplay ? (
        <span className="text-xs font-medium text-[#2F81F7] bg-[#E3F2FD] px-1.5 py-0.5 rounded flex-shrink-0">
          {offsetDisplay}
        </span>
      ) : null}

      {/* City name */}
      <span className="font-medium text-[#37352F] text-xs flex-1 min-w-0 truncate">{city.name}</span>

      {/* Time + Date - cùng 1 line hoặc 2 lines compact */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <span className="font-semibold text-[#37352F] text-xs tabular-nums whitespace-nowrap">
          {timeOnly}
        </span>
        <span className="text-[10px] text-[#9B9A97] whitespace-nowrap">
          {formattedDate}
        </span>
      </div>

      {/* Remove button - chỉ hiện khi hover */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-[#9B9A97] hover:text-[#37352F] hover:bg-[#F7F6F3] p-1 rounded transition-all text-sm leading-none flex-shrink-0"
        aria-label={t('remove')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
