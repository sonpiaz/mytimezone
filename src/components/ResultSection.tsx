import { useState } from 'react';
import type { TimeSlot } from '../types/meetingScheduler';
import { TimeSlotCard } from './TimeSlotCard';

interface ResultSectionProps {
  title: string;
  slots: TimeSlot[];
  variant: 'perfect' | 'sacrifice';
  onCopy?: () => void;
}

export const ResultSection = ({ title, slots, variant, onCopy }: ResultSectionProps) => {
  const [expanded, setExpanded] = useState(variant === 'perfect');

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-sm font-medium text-gray-700 mb-2 flex items-center justify-between"
      >
        {title} ({slots.length} {slots.length === 1 ? 'slot' : 'slots'})
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3">
          {slots.slice(0, 5).map((slot, index) => (
            <TimeSlotCard key={index} slot={slot} variant={variant} onCopy={onCopy} />
          ))}
          {slots.length > 5 && (
            <p className="text-xs text-gray-500 text-center">
              Showing top 5 of {slots.length} slots
            </p>
          )}
        </div>
      )}
    </div>
  );
};
