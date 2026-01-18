import { useState, useCallback } from 'react';

export const useHoveredHour = () => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((mouseX: number, columnIndex: number) => {
    setHoveredColumnIndex(columnIndex);
    setHoveredHour(columnIndex);
    setHoverPosition(mouseX);
    setIsHovering(true);
  }, []);

  const handleColumnLeave = useCallback(() => {
    setHoveredColumnIndex(null);
    setHoveredHour(null);
    setHoverPosition(null);
    setIsHovering(false);
  }, []);

  return {
    hoveredHour,
    hoveredColumnIndex,
    hoverPosition,
    isHovering,
    handleMouseMove,
    handleColumnLeave,
  };
};
