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
  description?: string;
}

/**
 * Generate timezone reference text for calendar description
 * Includes time range for each timezone (no duplicates)
 * Note: localTime already includes time range from TimeSlotCard
 */
export function generateTimezoneReference(
  timezones: Array<{ cityName: string; timezone: string; localTime: string }>
): string {
  const lines = timezones.map(tz => `• ${tz.cityName}: ${tz.localTime}`);
  
  return `🌍 Time Zone Reference:
${lines.join('\n')}

━━━━━━━━━━━━━━━━━━━━
Scheduled with mytimezone.online
Compare time zones → https://mytimezone.online
━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Generate Google Calendar URL
 * Docs: https://github.com/nicholasnjps/add-to-calendar
 */
export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones, description } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // Format: YYYYMMDDTHHmmssZ (UTC)
  const startUtc = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const endUtc = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  
  const tzReference = generateTimezoneReference(timezones);
  const fullDescription = description 
    ? `${description}\n\n${tzReference}`
    : tzReference;
  
  const urlParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
    details: fullDescription,
  });
  
  return `https://calendar.google.com/calendar/render?${urlParams.toString()}`;
}

/**
 * Generate Outlook Calendar URL (Office 365)
 */
export function generateOutlookUrl(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones, description } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // Outlook uses ISO format
  const startIso = startTime.toUTC().toISO();
  const endIso = endTime.toUTC().toISO();
  
  const tzReference = generateTimezoneReference(timezones);
  const fullDescription = description 
    ? `${description}\n\n${tzReference}`
    : tzReference;
  
  const urlParams = new URLSearchParams({
    subject: title,
    startdt: startIso || '',
    enddt: endIso || '',
    body: fullDescription,
    path: '/calendar/action/compose',
    rru: 'addevent',
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${urlParams.toString()}`;
}

/**
 * Generate ICS file content for Apple Calendar / download
 */
export function generateICSContent(params: CalendarEventParams): string {
  const { title, startTime, duration, timezones, description } = params;
  
  const endTime = startTime.plus({ minutes: duration });
  
  // ICS format: YYYYMMDDTHHmmssZ
  const startUtc = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const endUtc = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const nowUtc = DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  
  const tzReference = generateTimezoneReference(timezones);
  const fullDescription = description 
    ? `${description}\n\n${tzReference}`
    : tzReference;
  
  // Escape special characters for ICS
  const escapedDescription = fullDescription
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
    
    // Handle next day indicator
    const endDateStr = endLocal.toFormat('M/d');
    const startDateStr = startLocal.toFormat('M/d');
    const nextDayIndicator = endDateStr !== startDateStr ? ' +1' : '';
    
    return `• ${tz.cityName}: ${startStr} - ${endStr}${nextDayIndicator} (${abbr})`;
  }).join('\n');
  
  return `📅 ${title}
📆 ${dateStr}

🌍 Time zones:
${tzLines}

━━━━━━━━━━━━━━━━━━━━
Scheduled with mytimezone.online
https://mytimezone.online`;
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
