import type { TimeSlot } from '../types/meetingScheduler';
import { generateGoogleCalendarUrl, shareViaEmail } from '../utils/meetingScheduler';

interface TimeSlotCardProps {
  slot: TimeSlot;
  variant: 'perfect' | 'sacrifice';
  onCopy?: () => void;
}

export const TimeSlotCard = ({ slot, variant, onCopy }: TimeSlotCardProps) => {
  const variantStyles = {
    perfect: 'border-notion-accentGreen/30 bg-notion-accentGreenLight/50',
    sacrifice: 'border-orange-200/50 bg-orange-50/50',
  };

  const copyTimes = () => {
    const text = slot.participants
      .map(p => `${p.city.name}: ${p.startTime} - ${p.endTime} (${p.date})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    onCopy?.();
  };

  const addToCalendar = () => {
    const url = generateGoogleCalendarUrl(slot);
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    shareViaEmail(slot);
  };

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]}`}>
      {/* Time for each participant */}
      <div className="space-y-2 mb-3">
        {slot.participants.map((p, idx) => {
          // Determine text color: Green if in working hours, Red if sacrifice
          const isSacrificing = !p.isInWorkingHours;
          const textColor = isSacrificing ? 'text-red-600' : 'text-notion-text';

          return (
            <div
              key={idx}
              className={`flex items-center justify-between text-sm ${textColor}`}
            >
              <span className="flex items-center gap-2">
                {p.isHost && <span>🏠</span>}
                {p.city.name}
                {isSacrificing && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    Outside hours
                  </span>
                )}
              </span>
              <span className="font-mono">
                {p.startTime} - {p.endTime}
                <span className="text-notion-textLight ml-2">{p.date}</span>
                {p.isNextDay && <span className="text-red-500 ml-1">⚠️</span>}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sacrifice summary */}
      {variant === 'sacrifice' && slot.sacrificeParticipants.length > 0 && (
        <div className="mb-3 p-2 bg-red-50 rounded border border-red-200/50">
          <p className="text-xs text-red-700">
            <strong>Sacrificing:</strong> {slot.sacrificeParticipants.map(c => c.name).join(', ')} 
            {slot.sacrificeParticipants.length === 1 ? ' is' : ' are'} outside working hours
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-notion-borderLight">
        <button
          onClick={addToCalendar}
          className="flex-1 py-2 text-xs bg-notion-accent text-white rounded-lg hover:opacity-90 transition-notion flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule
        </button>
        <button
          onClick={copyTimes}
          className="flex-1 py-2 text-xs border border-notion-border rounded-lg hover:bg-notion-hover transition-notion flex items-center justify-center gap-1 text-notion-text"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Times
        </button>
        <button
          onClick={shareEmail}
          className="flex-1 py-2 text-xs border border-notion-border rounded-lg hover:bg-notion-hover transition-notion flex items-center justify-center gap-1 text-notion-text"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
      </div>
    </div>
  );
};
