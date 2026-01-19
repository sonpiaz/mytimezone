// src/utils/storageHelpers.ts

const CITIES_KEY = 'mytimezone_cities';
const MEETING_SETTINGS_KEY = 'mytimezone_meeting_settings';

export interface MeetingSettings {
  workingHoursStart: number;
  workingHoursEnd: number;
  meetingDuration: number;
}

const DEFAULT_MEETING_SETTINGS: MeetingSettings = {
  workingHoursStart: 9,
  workingHoursEnd: 18,
  meetingDuration: 60,
};

// Cities
export const saveCities = (slugs: string[]): void => {
  try {
    localStorage.setItem(CITIES_KEY, JSON.stringify(slugs));
  } catch (e) {
    console.error('Failed to save cities:', e);
  }
};

export const loadCities = (): string[] | null => {
  try {
    const saved = localStorage.getItem(CITIES_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load cities:', e);
    return null;
  }
};

// Meeting Settings
export const saveMeetingSettings = (settings: Partial<MeetingSettings>): void => {
  try {
    const current = loadMeetingSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(MEETING_SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save meeting settings:', e);
  }
};

export const loadMeetingSettings = (): MeetingSettings => {
  try {
    const saved = localStorage.getItem(MEETING_SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_MEETING_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load meeting settings:', e);
  }
  return DEFAULT_MEETING_SETTINGS;
};
