import { useRef, useEffect } from 'react';

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  meetingData: {
    title: string;
    startTime: Date;
    endTime: Date;
    description: string;
  };
}

export const CalendarPopup = ({ isOpen, onClose, meetingData }: CalendarPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { title, startTime, endTime, description } = meetingData;

  // Format dates for URLs
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };
  
  const formatOutlookDate = (date: Date): string => {
    return date.toISOString();
  };

  const formatYahooDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '').slice(0, 15);
  };

  // Calendar URLs
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}&details=${encodeURIComponent(description)}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${formatOutlookDate(startTime)}&enddt=${formatOutlookDate(endTime)}&body=${encodeURIComponent(description)}`;

  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(title)}&st=${formatYahooDate(startTime)}&et=${formatYahooDate(endTime)}&desc=${encodeURIComponent(description)}`;

  // iCal download
  const generateICS = () => {
    const formatICSDate = (date: Date): string => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Time Zone//EN
BEGIN:VEVENT
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:${title.replace(/,/g, '\\,')}
DESCRIPTION:${description.replace(/,/g, '\\,').replace(/\n/g, '\\n')}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const calendarOptions = [
    {
      name: 'Google Calendar',
      icon: (
        <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#E5E5E5]">
          <span className="text-xs font-bold text-[#4285F4]">G</span>
        </div>
      ),
      bgColor: 'bg-white hover:bg-[#F7F7F5] border border-[#E5E5E5]',
      url: googleUrl,
    },
    {
      name: 'Outlook.com',
      icon: (
        <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#E5E5E5]">
          <span className="text-xs font-bold text-[#0078D4]">⊞</span>
        </div>
      ),
      bgColor: 'bg-white hover:bg-[#F7F7F5] border border-[#E5E5E5]',
      url: outlookUrl,
    },
    {
      name: 'Yahoo',
      icon: (
        <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#E5E5E5]">
          <span className="text-xs font-bold text-[#6001D2]">Y</span>
        </div>
      ),
      bgColor: 'bg-white hover:bg-[#F7F7F5] border border-[#E5E5E5]',
      url: yahooUrl,
    },
    {
      name: 'iCal (Apple / Outlook)',
      icon: (
        <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#E5E5E5]">
          <svg className="w-4 h-4 text-[#37352F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      bgColor: 'bg-white hover:bg-[#F7F7F5] border border-[#E5E5E5]',
      action: generateICS,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={popupRef}
        className="bg-white rounded-xl shadow-lg border border-[#E9E9E7] p-6 w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#F7F7F5] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#37352F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#191919]">Add to Calendar</h3>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {calendarOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                if (option.action) {
                  option.action();
                } else if (option.url) {
                  window.open(option.url, '_blank');
                  onClose();
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${option.bgColor}`}
            >
              {option.icon}
              <span className="text-sm font-medium text-[#37352F]">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F7F7F5] rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
