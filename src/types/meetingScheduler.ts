import type { City } from './index';

export interface Participant {
  city: City;
  isSelected: boolean;
  isHost: boolean;
}

export interface WorkingHours {
  start: number;  // 9 = 9:00
  end: number;     // 18 = 18:00
}

export interface ParticipantTime {
  city: City;
  startTime: string;      // "08:00"
  endTime: string;        // "09:00"
  date: string;           // "Sat, Jan 18"
  isNextDay: boolean;     // true if different day from host
  isInWorkingHours: boolean;
  isHost: boolean;
}

export interface TimeSlot {
  startHour: number;  // Hour in reference timezone
  endHour: number;
  participants: ParticipantTime[];
  quality: 'perfect' | 'sacrifice';
  score: number;  // 0-100, higher is better
  sacrificeParticipants: City[]; // Cities that need to sacrifice (outside working hours)
}

export interface SchedulerResult {
  perfect: TimeSlot[];    // All in working hours
  sacrifice: TimeSlot[];  // Some participants outside working hours
  noResult: boolean;
}
