import { useState } from 'react';
import { DateTime } from 'luxon';
import type { TimeSlot } from '../types/meetingScheduler';
import { getMeetingDateTime } from '../utils/meetingScheduler';
import { AddToCalendarButton } from './AddToCalendarButton';
import { useTranslation } from '../hooks/useTranslation';
import { getFlagEmoji } from '../utils/flagEmoji';

interface TimeSlotCardProps {
  slot: TimeSlot;
  variant: 'perfect' | 'sacrifice';
  onCopy?: () => void;
  selectedDate: Date;
  duration: number;
  referenceTimezone: string;
  isLast?: boolean; // Để ẩn divider ở card cuối cùng
  isFirst?: boolean; // Để style primary button cho slot đầu tiên
  meetingTitle?: string;
}

export const TimeSlotCard = ({ 
  slot, 
  variant: _variant, 
  onCopy,
  selectedDate,
  duration,
  referenceTimezone: _referenceTimezone,
  isLast = false,
  isFirst = false,
  meetingTitle = 'Team Meeting',
}: TimeSlotCardProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Generate meeting text to share (with full details)
  const generateMeetingText = (): string => {
    const lines = slot.participants.map(p => {
      const flag = getFlagEmoji(p.city.country);
      return `${flag} ${p.city.name}: ${p.startTime} - ${p.endTime}, ${p.date}`;
    });

    // Get city slugs for URL
    const citySlugs = slot.participants.map(p => p.city.slug).join(',');
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}?cities=${citySlugs}`;

    return `Meeting Time:\n${lines.join('\n')}\n\nView timezones: ${shareUrl}`;
  };

  // Handle share click with proper error handling
  const shareLink = async () => {
    const meetingText = generateMeetingText();
    
    try {
      // Try modern clipboard API (requires HTTPS or localhost)
      await navigator.clipboard.writeText(meetingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // onCopy will show toast: "Meeting link copied! Share with participants"
      onCopy?.();
    } catch (err) {
      // Fallback for older browsers or HTTP (not HTTPS)
      try {
        const textArea = document.createElement('textarea');
        textArea.value = meetingText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, meetingText.length); // For mobile devices
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy?.();
      } catch (fallbackErr) {
        console.error('Failed to copy to clipboard:', fallbackErr);
        // Still show feedback even if copy fails
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="py-4">
      {/* Best badge for first slot */}
      {isFirst && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-xs font-medium">
          <span>✨</span>
          <span>{t('best') || 'Best'}</span>
        </div>
      )}
      
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


      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        {/* Add to Calendar button - Using new AddToCalendarButton component */}
        {(() => {
          // Prepare timezone info for AddToCalendarButton
          const meetingData = getMeetingDateTime(slot, selectedDate);
          const startDateTime = DateTime.fromJSDate(meetingData.startTime);
          const durationMinutes = duration * 60;
          
          const timezones = slot.participants.map(p => {
            const localTime = DateTime.fromJSDate(meetingData.startTime)
              .setZone(p.city.timezone)
              .toFormat('h:mm a');
            
            // Get timezone abbreviation
            const tzAbbr = DateTime.fromJSDate(meetingData.startTime)
              .setZone(p.city.timezone)
              .toFormat('ZZZZ');
            
            return {
              cityName: p.city.name,
              timezone: p.city.timezone,
              localTime: `${localTime} (${tzAbbr})`,
            };
          });

          return (
            <AddToCalendarButton
              title={meetingTitle}
              startTime={startDateTime}
              duration={durationMinutes}
              timezones={timezones}
              description={meetingData.description}
              onSuccess={() => {
                onCopy?.();
              }}
            />
          );
        })()}
        
        {/* Share Meeting button - với feedback khi copy */}
        <button
          onClick={shareLink}
          className={`flex-1 py-2.5 text-sm font-medium bg-transparent border rounded-md transition-all duration-150 flex items-center justify-center gap-1.5 ${
            copied
              ? 'text-[#059669] border-[#10B981] bg-[#ECFDF5]'
              : 'text-[#37352F] border-[#E5E5E5] hover:bg-[#F7F7F5] hover:border-[#D1D1D1]'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('copied') || 'Copied!'}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {t('shareMeeting')}
            </>
          )}
        </button>
      </div>
      
      {/* Divider giữa các cards - ẩn ở card cuối cùng */}
      {!isLast && (
        <div className="mt-4 border-t border-[#E3E3E3]"></div>
      )}
    </div>
  );
};
