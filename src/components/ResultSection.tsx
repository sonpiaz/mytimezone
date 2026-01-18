import type { TimeSlot } from '../types/meetingScheduler';
import { TimeSlotCard } from './TimeSlotCard';
import { useTranslation } from '../hooks/useTranslation';
import { getTranslation } from '../constants/translations';

interface ResultSectionProps {
  title: string;
  slots: TimeSlot[];
  variant: 'perfect' | 'sacrifice';
  onCopy?: () => void;
  selectedDate: Date;
  duration: number;
  referenceTimezone: string;
}

export const ResultSection = ({ 
  title, 
  slots, 
  variant, 
  onCopy,
  selectedDate,
  duration,
  referenceTimezone,
}: ResultSectionProps) => {
  const { language } = useTranslation();
  
  // Limit to TOP 5 slots
  const topSlots = slots.slice(0, 5);

  return (
    <div className="mb-6">
      {title && (
        <h4 className="text-sm font-medium text-notion-text mb-3">
          {title}
        </h4>
      )}
      
      <div>
        {topSlots.map((slot, index) => (
          <TimeSlotCard 
            key={index} 
            slot={slot} 
            variant={variant} 
            onCopy={onCopy}
            selectedDate={selectedDate}
            duration={duration}
            referenceTimezone={referenceTimezone}
            isLast={index === topSlots.length - 1}
          />
        ))}
        {slots.length > 5 && (
          <p className="text-xs text-notion-textLight text-center pt-2">
            {getTranslation(language, 'showingTopSlots', { count: 5, total: slots.length })}
          </p>
        )}
      </div>
    </div>
  );
};
