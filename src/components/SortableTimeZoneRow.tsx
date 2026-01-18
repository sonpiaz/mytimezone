import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TimeZoneRow } from './TimeZoneRow';
import type { TimeZoneData } from '../types';

interface SortableTimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  sidebarOnly?: boolean;
  timelineOnly?: boolean;
  fullRow?: boolean;
  columnWidth?: number;
  sidebarWidth?: number;
  hoveredColumnIndex?: number | null;
  isDesktop?: boolean;
}

export const SortableTimeZoneRow = ({
  data,
  onRemove,
  t,
  sidebarOnly = false,
  timelineOnly = false,
  fullRow = false,
  columnWidth = 60,
  sidebarWidth = 256,
  hoveredColumnIndex = null,
  isDesktop = true,
}: SortableTimeZoneRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.city.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TimeZoneRow
        data={data}
        onRemove={onRemove}
        t={t}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        isReference={data.isReference}
        sidebarOnly={sidebarOnly}
        timelineOnly={timelineOnly}
        fullRow={fullRow}
        columnWidth={columnWidth}
        sidebarWidth={sidebarWidth}
        hoveredColumnIndex={hoveredColumnIndex}
        isDesktop={isDesktop}
      />
    </div>
  );
};
