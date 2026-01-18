import type { TimeSlot } from '../types/meetingScheduler';
import { generateGoogleCalendarUrl, generateMeetingLink } from '../utils/meetingScheduler';
import { useTranslation } from '../hooks/useTranslation';

interface TimeSlotCardProps {
  slot: TimeSlot;
  variant: 'perfect' | 'sacrifice';
  onCopy?: () => void;
  selectedDate: Date;
  duration: number;
  referenceTimezone: string;
  isLast?: boolean; // Để ẩn divider ở card cuối cùng
}

export const TimeSlotCard = ({ 
  slot, 
  variant, 
  onCopy,
  selectedDate,
  duration,
  referenceTimezone,
  isLast = false,
}: TimeSlotCardProps) => {
  const { t } = useTranslation();

  const addToCalendar = () => {
    const url = generateGoogleCalendarUrl(slot);
    window.open(url, '_blank');
  };

  const shareLink = () => {
    const meetingUrl = generateMeetingLink(
      slot,
      selectedDate,
      duration,
      referenceTimezone
    );
    navigator.clipboard.writeText(meetingUrl);
    // onCopy will show toast: "Meeting link copied! Share with participants"
    onCopy?.();
  };

  return (
    <div className="py-4">
      {/* Time for each participant */}
      <div className="space-y-2 mb-3">
        {slot.participants.map((p, idx) => {
          // Determine text color: Muted orange if sacrifice, dark gray if in hours
          const isSacrificing = !p.isInWorkingHours;
          const textColor = isSacrificing ? 'text-[#B35C00]' : 'text-[#37352F]';

          return (
            <div
              key={idx}
              className={`flex items-center justify-between text-sm ${textColor}`}
            >
              <span>{p.city.name}</span>
              <span className="font-mono">
                {p.startTime} - {p.endTime} <span className="text-notion-textLight ml-2">{p.date}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Sacrifice summary */}
      {variant === 'sacrifice' && slot.sacrificeParticipants.length > 0 && (
        <div className="mb-3 py-2 px-3 bg-[#F7F6F3] rounded-notion-md text-sm text-[#37352F]">
          <p className="text-xs leading-relaxed">
            <span className="font-medium">{slot.sacrificeParticipants.map(c => c.name).join(', ')}</span>{' '}
            {t('outsideWorkingHours')}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={addToCalendar}
          className="flex-1 py-2.5 text-xs font-medium bg-[#37352F] text-white rounded-notion-md hover:bg-[#5A5A5A] transition-all duration-150 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('schedule')}
        </button>
        <button
          onClick={shareLink}
          className="flex-1 py-2.5 text-xs font-medium bg-white text-notion-text border border-[#E3E3E3] rounded-notion-md hover:bg-[#F7F6F3] hover:border-[#D3D3D3] transition-all duration-150 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {t('shareMeeting')}
        </button>
      </div>
      
      {/* Divider giữa các cards - ẩn ở card cuối cùng */}
      {!isLast && (
        <div className="mt-4 border-t border-[#E3E3E3]"></div>
      )}
    </div>
  );
};
