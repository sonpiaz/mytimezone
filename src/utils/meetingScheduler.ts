import { DateTime } from 'luxon';
import type { Participant, WorkingHours, TimeSlot, SchedulerResult, ParticipantTime } from '../types/meetingScheduler';
import type { City } from '../types';

export const findBestMeetingTimes = (
  participants: Participant[],
  workingHours: WorkingHours,
  duration: number,  // in hours
  date: Date
): SchedulerResult => {
  const slots: TimeSlot[] = [];
  const selectedParticipants = participants.filter(p => p.isSelected);
  
  if (selectedParticipants.length < 2) {
    return {
      perfect: [],
      sacrifice: [],
      noResult: true,
    };
  }
  
  const referenceCity = selectedParticipants.find(p => p.isHost)?.city || selectedParticipants[0].city;
  
  // Check each hour of the day (0-23)
  for (let hour = 0; hour <= 24 - duration; hour++) {
    const slot = evaluateTimeSlot(
      hour,
      hour + duration,
      selectedParticipants,
      workingHours,
      date,
      referenceCity
    );
    slots.push(slot);
  }
  
  // Sort by score (highest first)
  slots.sort((a, b) => b.score - a.score);
  
  // Categorize results (2-tier: Perfect or Sacrifice)
  const perfect = slots.filter(s => s.quality === 'perfect');
  const sacrifice = slots.filter(s => s.quality === 'sacrifice');
  
  return {
    perfect,
    sacrifice,
    noResult: perfect.length === 0 && sacrifice.length === 0,
  };
};

const evaluateTimeSlot = (
  startHour: number,
  endHour: number,
  participants: Participant[],
  workingHours: WorkingHours,
  date: Date,
  referenceCity: City
): TimeSlot => {
  const participantTimes: ParticipantTime[] = [];
  const sacrificeParticipants: City[] = [];
  let totalScore = 0;
  let perfectCount = 0;
  
  for (const participant of participants) {
    // Create DateTime in reference timezone
    const refDateTime = DateTime.fromJSDate(date, { zone: referenceCity.timezone })
      .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 });
    
    // Convert to participant's timezone
    const localDateTime = refDateTime.setZone(participant.city.timezone);
    const localEndDateTime = localDateTime.plus({ hours: endHour - startHour });
    
    const localStartHour = localDateTime.hour;
    const localEndHour = localEndDateTime.hour;
    
    // Check if in working hours
    // Meeting is in working hours if:
    // - Start hour >= working start AND
    // - End hour <= working end (but end hour is exclusive, so we check < end)
    // - Both start and end are within the same day (no day change)
    const isInWorkingHours = 
      localStartHour >= workingHours.start && 
      localEndHour < workingHours.end &&
      localDateTime.day === localEndDateTime.day; // Same day check
    
    // Check if different day
    const isNextDay = localDateTime.day !== refDateTime.day || localDateTime.month !== refDateTime.month;
    
    // Calculate score (2-tier: Perfect or Sacrifice)
    let participantScore = 100;
    
    if (isInWorkingHours) {
      // PERFECT: In working hours - score 100
      participantScore = 100;
      perfectCount++;
    } else {
      // SACRIFICE: Outside working hours - score based on how far outside
      const hoursBeforeStart = Math.max(0, workingHours.start - localStartHour);
      const hoursAfterEnd = Math.max(0, localEndHour - workingHours.end);
      const hoursOutside = Math.max(hoursBeforeStart, hoursAfterEnd);
      
      // Penalty: -10 to -50 points (càng xa working hours càng penalty cao)
      participantScore = Math.max(50, 100 - hoursOutside * 10);
      sacrificeParticipants.push(participant.city);
    }
    
    totalScore += participantScore;
    
    participantTimes.push({
      city: participant.city,
      startTime: localDateTime.toFormat('HH:mm'),
      endTime: localEndDateTime.toFormat('HH:mm'),
      date: localDateTime.toFormat('EEE, MMM d'),
      isNextDay,
      isInWorkingHours,
      isHost: participant.isHost,
    });
  }
  
  // Calculate average score
  const avgScore = totalScore / participants.length;
  
  // Determine quality (2-tier: Perfect or Sacrifice)
  const quality: TimeSlot['quality'] = perfectCount === participants.length ? 'perfect' : 'sacrifice';
  
  return {
    startHour,
    endHour,
    participants: participantTimes,
    quality,
    score: avgScore,
    sacrificeParticipants,
  };
};

// Generate Google Calendar URL
export const generateGoogleCalendarUrl = (slot: TimeSlot): string => {
  const hostParticipant = slot.participants.find(p => p.isHost) || slot.participants[0];
  
  const title = encodeURIComponent('Team Meeting');
  const details = encodeURIComponent(
    slot.participants
      .map(p => `${p.city.name}: ${p.startTime} - ${p.endTime} (${p.date})`)
      .join('\n')
  );
  
  // Parse the date and time from host participant
  const hostDateStr = hostParticipant.date; // "Sat, Jan 18"
  const hostStartTime = hostParticipant.startTime; // "08:00"
  const hostEndTime = hostParticipant.endTime; // "09:00"
  
  // Find the city's timezone
  const hostCity = hostParticipant.city;
  
  // Get current year (or try to parse from date string)
  const now = DateTime.now();
  const year = now.year;
  
  // Try to parse date - format: "EEE, MMM d" (e.g., "Sat, Jan 18")
  // We need to construct a full date string
  let startDateTime: DateTime;
  let endDateTime: DateTime;
  
  try {
    // Try parsing with current year
    const dateTimeStr = `${hostDateStr} ${year} ${hostStartTime}`;
    startDateTime = DateTime.fromFormat(dateTimeStr, 'EEE, MMM d yyyy HH:mm', { zone: hostCity.timezone });
    
    // If parsing fails or date is in the past, try next year
    if (!startDateTime.isValid || startDateTime < now) {
      const dateTimeStrNext = `${hostDateStr} ${year + 1} ${hostStartTime}`;
      startDateTime = DateTime.fromFormat(dateTimeStrNext, 'EEE, MMM d yyyy HH:mm', { zone: hostCity.timezone });
    }
    
    const endTimeStr = `${hostDateStr} ${startDateTime.year} ${hostEndTime}`;
    endDateTime = DateTime.fromFormat(endTimeStr, 'EEE, MMM d yyyy HH:mm', { zone: hostCity.timezone });
    
    // If end time is before start time, it's next day
    if (endDateTime <= startDateTime) {
      endDateTime = endDateTime.plus({ days: 1 });
    }
  } catch (error) {
    // Fallback: use current date/time
    startDateTime = DateTime.now().setZone(hostCity.timezone).set({ hour: parseInt(hostStartTime.split(':')[0]), minute: parseInt(hostStartTime.split(':')[1]) });
    endDateTime = startDateTime.plus({ hours: slot.endHour - slot.startHour });
  }
  
  // Convert to UTC for Google Calendar (format: YYYYMMDDTHHmmssZ)
  const startUTC = startDateTime.toUTC().toFormat('yyyyMMdd\'T\'HHmmss\'Z\'');
  const endUTC = endDateTime.toUTC().toFormat('yyyyMMdd\'T\'HHmmss\'Z\'');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}`;
};

// Generate meeting link
export const generateMeetingLink = (
  slot: TimeSlot,
  selectedDate: Date,
  duration: number,
  referenceTimezone: string
): string => {
  // Get host participant time
  const hostParticipant = slot.participants.find(p => p.isHost) || slot.participants[0];
  const hostCity = hostParticipant.city;
  
  // Parse the date and time from host participant
  const hostDateStr = hostParticipant.date; // "Sat, Jan 18"
  const hostStartTime = hostParticipant.startTime; // "08:00"
  
  // Get current year
  const now = DateTime.now();
  const year = now.year;
  
  // Create DateTime object
  let startDateTime: DateTime;
  
  try {
    // Try parsing with current year
    const dateTimeStr = `${hostDateStr} ${year} ${hostStartTime}`;
    startDateTime = DateTime.fromFormat(dateTimeStr, 'EEE, MMM d yyyy HH:mm', { zone: hostCity.timezone });
    
    // If parsing fails or date is in the past, try next year
    if (!startDateTime.isValid || startDateTime < now) {
      const dateTimeStrNext = `${hostDateStr} ${year + 1} ${hostStartTime}`;
      startDateTime = DateTime.fromFormat(dateTimeStrNext, 'EEE, MMM d yyyy HH:mm', { zone: hostCity.timezone });
    }
  } catch (error) {
    // Fallback: use selectedDate with slot startHour
    startDateTime = DateTime.fromJSDate(selectedDate, { zone: hostCity.timezone })
      .set({ hour: parseInt(hostStartTime.split(':')[0]), minute: parseInt(hostStartTime.split(':')[1]) });
  }
  
  // Format as ISO timestamp
  const isoTimestamp = startDateTime.toISO();
  if (!isoTimestamp) {
    // Fallback to current time if parsing fails
    return `${window.location.origin}/m?t=${new Date().toISOString()}&tz=${referenceTimezone}&d=${duration}h`;
  }
  
  // Format duration (e.g., "1h", "1.5h", "30m")
  const durationStr = duration === 0.5 ? '30m' : `${duration}h`;
  
  // Generate URL
  const baseUrl = window.location.origin;
  const meetingUrl = `${baseUrl}/m?t=${encodeURIComponent(isoTimestamp)}&tz=${encodeURIComponent(referenceTimezone)}&d=${durationStr}`;
  
  return meetingUrl;
};
