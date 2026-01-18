import { useState, useCallback } from 'react';

export interface CellPosition {
  left: number;      // Left position relative to container
  width: number;     // Cell width
  columnIndex: number; // Column index for reference
}

export const useHoveredHour = () => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoveredCellPosition, setHoveredCellPosition] = useState<CellPosition | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((mouseX: number, columnIndex: number) => {
    setHoveredColumnIndex(columnIndex);
    setHoveredHour(columnIndex);
    setHoverPosition(mouseX);
    setIsHovering(true);
  }, []);

  const handleCellHover = useCallback((position: CellPosition) => {
    setHoveredCellPosition(position);
    setHoveredColumnIndex(position.columnIndex);
    setHoveredHour(position.columnIndex);
    setIsHovering(true);
  }, []);

  const handleColumnLeave = useCallback(() => {
    setHoveredColumnIndex(null);
    setHoveredHour(null);
    setHoverPosition(null);
    setHoveredCellPosition(null);
    setIsHovering(false);
  }, []);

  return {
    hoveredHour,
    hoveredColumnIndex,
    hoverPosition,
    hoveredCellPosition,
    isHovering,
    handleMouseMove,
    handleCellHover,
    handleColumnLeave,
  };
};
