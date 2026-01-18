import type { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header
    title: 'My Timezone',
    subtitle: 'Xem và so sánh múi giờ của các thành phố trên thế giới',
    findBestTime: 'Tìm Giờ Họp',
    shareView: 'Chia Sẻ',
    feedback: 'Góp ý',
    
    // Add City
    addCity: 'Thêm thành phố',
    searchPlaceholder: '+ Thành phố hoặc múi giờ',
    noCitiesFound: 'Không tìm thấy thành phố',
    noCities: 'Chưa có thành phố nào. Hãy thêm thành phố để bắt đầu.',
    
    // DateNavigator
    today: 'Hôm nay',
    
    // Meeting Scheduler
    findBestMeetingTime: 'Tìm Giờ Họp Tốt Nhất',
    participants: 'Người tham gia',
    workingHours: 'Giờ làm việc',
    meetingDuration: 'Thời lượng họp',
    date: 'Ngày',
    findBestTimes: 'Tìm Giờ Tốt Nhất',
    schedule: 'Lên Lịch',
    shareMeeting: 'Chia Sẻ Cuộc Họp',
    outsideWorkingHours: 'sẽ họp ngoài giờ làm việc',
    outsideWorkingHoursSingle: 'sẽ họp ngoài giờ làm việc',
    showingTopSlots: 'Hiển thị {count} trong {total} khung giờ',
    selectAtLeastTwo: 'Vui lòng chọn ít nhất 2 người tham gia',
    noGoodTimeFound: 'Không tìm thấy giờ họp phù hợp cho ngày này',
    tryExpandingHours: 'Thử mở rộng giờ làm việc',
    tryAnotherDay: 'Thử chọn ngày khác',
    tryRemovingParticipant: 'Thử bỏ một người tham gia',
    
    // Time units
    minutes: 'phút',
    hour: 'giờ',
    hours: 'giờ',
    
    // Toast
    linkCopied: 'Đã sao chép link!',
    meetingLinkCopied: 'Đã sao chép link cuộc họp!',
    cityAdded: 'Đã thêm thành phố',
    cityRemoved: 'Đã xóa thành phố',
    errorAddingCity: 'Lỗi khi thêm thành phố',
    errorRemovingCity: 'Lỗi khi xóa thành phố',
    copied: 'Đã sao chép!',
    
    // Common
    remove: 'Xóa',
    selectCity: 'Chọn thành phố',
    searchCity: 'Tìm kiếm thành phố...',
    gmt: 'GMT',
    currentTime: 'Giờ hiện tại',
    language: 'Ngôn ngữ',
  },
  en: {
    // Header
    title: 'My Timezone',
    subtitle: 'View and compare time zones of cities around the world',
    findBestTime: 'Find Best Time',
    shareView: 'Share View',
    feedback: 'Feedback',
    
    // Add City
    addCity: 'Add City',
    searchPlaceholder: '+ Place or timezone',
    noCitiesFound: 'No cities found',
    noCities: 'No cities added. Add a city to get started.',
    
    // DateNavigator
    today: 'Today',
    
    // Meeting Scheduler
    findBestMeetingTime: 'Find Best Meeting Time',
    participants: 'Participants',
    workingHours: 'Working hours',
    meetingDuration: 'Meeting duration',
    date: 'Date',
    findBestTimes: 'Find Best Times',
    schedule: 'Schedule',
    shareMeeting: 'Share Meeting',
    outsideWorkingHours: 'will meet outside working hours',
    outsideWorkingHoursSingle: 'will meet outside working hours',
    showingTopSlots: 'Showing top {count} of {total} slots',
    selectAtLeastTwo: 'Please select at least 2 participants',
    noGoodTimeFound: 'No good time found for this day',
    tryExpandingHours: 'Expanding working hours',
    tryAnotherDay: 'Checking another day',
    tryRemovingParticipant: 'Removing a participant',
    
    // Time units
    minutes: 'min',
    hour: 'hr',
    hours: 'hrs',
    
    // Toast
    linkCopied: 'Link copied!',
    meetingLinkCopied: 'Meeting link copied! Share with participants',
    cityAdded: 'City added',
    cityRemoved: 'City removed',
    errorAddingCity: 'Error adding city',
    errorRemovingCity: 'Error removing city',
    copied: 'Copied!',
    
    // Common
    remove: 'Remove',
    selectCity: 'Select City',
    searchCity: 'Type to search city...',
    gmt: 'GMT',
    currentTime: 'Current Time',
    language: 'Language',
  },
};

/**
 * Get translation with optional parameter replacement
 * Example: t('showingTopSlots', { count: 5, total: 24 }) -> "Showing top 5 of 24 slots"
 */
export const getTranslation = (lang: Language, key: string, params?: Record<string, string | number>): string => {
  let translation = translations[lang][key] || key;
  
  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{${paramKey}}`, String(paramValue));
    });
  }
  
  return translation;
};
