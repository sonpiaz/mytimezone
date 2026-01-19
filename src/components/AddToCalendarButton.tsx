import { useState, useRef, useEffect } from 'react';
import { DateTime } from 'luxon';
import {
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  downloadICS,
  generateShareText,
  copyToClipboard,
  type CalendarEventParams,
} from '../utils/calendarUtils';

interface TimezoneInfo {
  cityName: string;
  timezone: string;
  localTime: string;
}

interface AddToCalendarButtonProps {
  title: string;
  startTime: DateTime;
  duration: number;
  timezones: TimezoneInfo[];
  description?: string;
  onSuccess?: () => void;
}

export function AddToCalendarButton({
  title,
  startTime,
  duration,
  timezones,
  description,
  onSuccess,
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const eventParams: CalendarEventParams = { title, startTime, duration, timezones, description };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(eventParams);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    onSuccess?.();
  };

  const handleOutlook = () => {
    const url = generateOutlookUrl(eventParams);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    onSuccess?.();
  };

  const handleAppleCalendar = () => {
    downloadICS(eventParams);
    setIsOpen(false);
    onSuccess?.();
  };

  const handleDownloadICS = () => {
    downloadICS(eventParams);
    setIsOpen(false);
    onSuccess?.();
  };

  const handleCopyDetails = async () => {
    const text = generateShareText(eventParams);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#191919] text-white rounded-md hover:bg-[#333333] transition-colors font-medium text-sm"
      >
        <CalendarIcon className="w-4 h-4" />
        Add to Calendar
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E9E9E7] py-1 z-50">
          {/* Google Calendar */}
          <button
            onClick={handleGoogleCalendar}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <GoogleCalendarIcon className="w-5 h-5" />
            <span className="text-[#37352F] text-sm">Google Calendar</span>
          </button>

          {/* Outlook */}
          <button
            onClick={handleOutlook}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <OutlookIcon className="w-5 h-5" />
            <span className="text-[#37352F] text-sm">Outlook</span>
          </button>

          {/* Apple Calendar */}
          <button
            onClick={handleAppleCalendar}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <AppleIcon className="w-5 h-5" />
            <span className="text-[#37352F] text-sm">Apple Calendar</span>
          </button>

          <div className="border-t border-[#E9E9E7] my-1" />

          {/* Download ICS */}
          <button
            onClick={handleDownloadICS}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <DownloadIcon className="w-5 h-5 text-[#9B9A97]" />
            <span className="text-[#37352F] text-sm">Download .ics</span>
          </button>

          {/* Copy Details */}
          <button
            onClick={handleCopyDetails}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <CopyIcon className="w-5 h-5 text-[#9B9A97]" />
            <span className="text-[#37352F] text-sm">
              {copied ? '✓ Copied!' : 'Copy meeting details'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// Icons (inline SVG components)
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" opacity="0" />
      <path fill="#4285F4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.1" />
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" stroke="#4285F4" strokeWidth="1.5" />
      <path fill="#EA4335" d="M16 7H8v2h8V7z" />
      <path fill="#FBBC04" d="M16 11H8v2h8v-2z" />
      <path fill="#34A853" d="M16 15H8v2h8v-2z" />
    </svg>
  );
}

function OutlookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20">
      <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576a.806.806 0 01-.587.234h-8.652v-6.55l1.538 1.127a.41.41 0 00.48.01l7.02-4.696a.164.164 0 01.253.031.168.168 0 01.026.09v-.08a.66.66 0 01.16.78z" />
      <path fill="#0078D4" d="M15.87 8.042l-1.347.98v-4.76l.692-.474.655.474v3.78z" />
      <path fill="#28A8EA" d="M24 5.363v1.317a.66.66 0 01-.16.093l-7.02 4.696a.41.41 0 01-.48-.01l-1.538-1.127v-6.07h8.012c.23 0 .424.078.578.234A.79.79 0 0124 5.071v.291z" />
      <path fill="#0364B8" d="M14.522 10.332v8.343c0 .394-.32.714-.714.714H0V7.05c0-.394.32-.714.714-.714h13.094c.394 0 .714.32.714.714v3.282z" />
      <path fill="#0078D4" d="M10.428 9.047c-.688-.508-1.558-.762-2.61-.762-1.097 0-1.996.29-2.697.867-.7.578-1.052 1.343-1.052 2.294 0 .952.338 1.71 1.014 2.275.676.565 1.543.848 2.6.848 1.1 0 1.994-.264 2.68-.79.686-.528 1.03-1.248 1.03-2.162 0-.978-.322-1.74-.965-2.285v-.285zm-2.642 4.27c-.578 0-1.04-.183-1.388-.55-.348-.366-.522-.87-.522-1.51 0-.656.178-1.167.534-1.534.356-.367.826-.55 1.408-.55.578 0 1.034.176 1.37.528.334.353.502.857.502 1.514 0 .672-.166 1.19-.498 1.555-.332.364-.796.547-1.392.547h-.014z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
