import { DateTime } from 'luxon';

export interface CalendarEventParams {
  title: string;
  startTime: DateTime;
  duration: number; // minutes
  timezones: Array<{
    cityName: string;
    timezone: string;
    localTime: string;
  }>;
}

/**
 * Generate timezone reference text for calendar description
 * Format: City Name: Start - End TZ (Date)
 * Example: San Francisco: 3:00 PM - 4:00 PM PST (Sun, Jan 18)
 * Input format: "3:00 PM - 4:00 PM PST (Sun, Jan 18)"
 */
export function generateTimezoneReference(
  timezones: Array<{ cityName: string; timezone: string; localTime: string }>
): string {
  // localTime format: "3:00 PM - 4:00 PM PST (Sun, Jan 18)" or "11:00 PM - 12:00 AM GMT (Sun, Jan 18 - Mon, Jan 19)"
  const lines = timezones.map(tz => {
    // Format is already correct: "Start - End TZ (Date)"
    // Just prepend city name
    return `${tz.cityName}: ${tz.localTime}`;
  });
  
  return `🌍 Time Zone Reference:
${lines.join('\n')}

___________
Scheduled with → https://mytimezone.online
___________`;
}

/**
 * Generate Google Calendar URL
 * Docs: https://github.com/nicholasnjps/add-to-calendar
 */
export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // Format: YYYYMMDDTHHmmssZ (UTC)
  const startUtc = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const endUtc = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  
  // Only use timezone reference, no duplicate description
  const tzReference = generateTimezoneReference(timezones);
  
  const urlParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
    details: tzReference,
  });
  
  return `https://calendar.google.com/calendar/render?${urlParams.toString()}`;
}

/**
 * Generate Outlook Calendar URL (Office 365)
 */
export function generateOutlookUrl(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // Outlook uses ISO format
  const startIso = startTime.toUTC().toISO();
  const endIso = endTime.toUTC().toISO();
  
  // Only use timezone reference, no duplicate description
  const tzReference = generateTimezoneReference(timezones);
  
  const urlParams = new URLSearchParams({
    subject: title,
    startdt: startIso || '',
    enddt: endIso || '',
    body: tzReference,
    path: '/calendar/action/compose',
    rru: 'addevent',
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${urlParams.toString()}`;
}

/**
 * Generate ICS file content for Apple Calendar / download
 */
export function generateICSContent(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // ICS format: YYYYMMDDTHHmmssZ
  const startUtc = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const endUtc = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const nowUtc = DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  
  // Only use timezone reference, no duplicate description
  const tzReference = generateTimezoneReference(timezones);
  
  // Escape special characters for ICS
  const escapedDescription = tzReference
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
  
  const escapedTitle = title.replace(/,/g, '\\,').replace(/;/g, '\\;');
  
  // Generate unique ID
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@mytimezone.online`;
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Time Zone//mytimezone.online//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${nowUtc}
DTSTART:${startUtc}
DTEND:${endUtc}
SUMMARY:${escapedTitle}
DESCRIPTION:${escapedDescription}
URL:https://mytimezone.online
END:VEVENT
END:VCALENDAR`;
}

/**
 * Download ICS file
 */
export function downloadICS(params: CalendarEventParams): void {
  const icsContent = generateICSContent(params);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${params.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate copy-paste text for Slack/Email
 */
export function generateShareText(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones } = params;
  
  const dateStr = startTime.toFormat('cccc, LLLL d, yyyy');
  
  const tzLines = timezones.map(tz => {
    const startLocal = startTime.setZone(tz.timezone);
    const endLocal = startLocal.plus({ minutes: duration });
    const startStr = startLocal.toFormat('h:mm a');
    const endStr = endLocal.toFormat('h:mm a');
    const abbr = startLocal.toFormat('ZZZZ'); // PST, GMT, etc.
    const dateLabel = startLocal.toFormat('EEE, MMM d'); // Sun, Jan 18
    
    // Handle next day indicator
    const endDateStr = endLocal.toFormat('M/d');
    const startDateStr = startLocal.toFormat('M/d');
    const nextDayIndicator = endDateStr !== startDateStr;
    const nextDayDate = nextDayIndicator ? endLocal.toFormat('EEE, MMM d') : '';
    
    // Format: "City: Start - End TZ (Date)"
    // Example: "San Francisco: 3:00 PM - 4:00 PM PST (Sun, Jan 18)"
    // Or: "Singapore: 11:00 PM - 12:00 AM SGT (Sun, Jan 18 - Mon, Jan 19)"
    const datePart = nextDayIndicator 
      ? `(${dateLabel} - ${nextDayDate})`
      : `(${dateLabel})`;
    
    return `${tz.cityName}: ${startStr} - ${endStr} ${abbr} ${datePart}`;
  }).join('\n');
  
  return `📅 ${title}
📆 ${dateStr}

🌍 Time Zone Reference:
${tzLines}

___________
Scheduled with → https://mytimezone.online
___________`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}
