import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TimeZoneRow } from './TimeZoneRow';
import type { TimeZoneData } from '../types';

interface SortableTimeZoneRowProps {
  data: TimeZoneData;
  onRemove: () => void;
  t: (key: string) => string;
  onColumnHover?: (columnIndex: number) => void;
  onMouseMove?: (mouseX: number, columnIndex: number) => void;
  onColumnLeave: () => void;
  sidebarOnly?: boolean;
  timelineOnly?: boolean;
  columnWidth?: number;
  sidebarWidth?: number;
  hoveredColumnIndex?: number | null;
}

export const SortableTimeZoneRow = ({
  data,
  onRemove,
  t,
  onColumnHover,
  onMouseMove,
  onColumnLeave,
  sidebarOnly = false,
  timelineOnly = false,
  columnWidth = 60,
  sidebarWidth = 256,
  hoveredColumnIndex = null,
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
        onColumnHover={onColumnHover}
        onMouseMove={onMouseMove}
        onColumnLeave={onColumnLeave}
        isReference={data.isReference}
        sidebarOnly={sidebarOnly}
        timelineOnly={timelineOnly}
        columnWidth={columnWidth}
        sidebarWidth={sidebarWidth}
        hoveredColumnIndex={hoveredColumnIndex}
      />
    </div>
  );
};
