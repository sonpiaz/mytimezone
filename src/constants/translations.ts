import type { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    title: 'Múi Giờ Thế Giới',
    subtitle: 'Xem và so sánh múi giờ của các thành phố trên thế giới',
    addCity: 'Thêm thành phố',
    share: 'Chia sẻ',
    feedback: 'Góp ý',
    remove: 'Xóa',
    copied: 'Đã sao chép!',
    selectCity: 'Chọn thành phố',
    searchCity: 'Tìm kiếm thành phố...',
    noCitiesFound: 'Không tìm thấy thành phố',
    noCities: 'Chưa có thành phố nào. Hãy thêm thành phố để bắt đầu.',
    cityAdded: 'Đã thêm thành phố',
    cityRemoved: 'Đã xóa thành phố',
    errorAddingCity: 'Lỗi khi thêm thành phố',
    errorRemovingCity: 'Lỗi khi xóa thành phố',
    gmt: 'GMT',
    workingHours: 'Giờ làm việc',
    currentTime: 'Giờ hiện tại',
    language: 'Ngôn ngữ',
  },
  en: {
    title: 'World Time Zones',
    subtitle: 'View and compare time zones of cities around the world',
    addCity: 'Add City',
    share: 'Share',
    feedback: 'Feedback',
    remove: 'Remove',
    copied: 'Copied!',
    selectCity: 'Select City',
    searchCity: 'Type to search city...',
    noCitiesFound: 'No cities found',
    noCities: 'No cities added. Add a city to get started.',
    cityAdded: 'City added',
    cityRemoved: 'City removed',
    errorAddingCity: 'Error adding city',
    errorRemovingCity: 'Error removing city',
    gmt: 'GMT',
    workingHours: 'Working Hours',
    currentTime: 'Current Time',
    language: 'Language',
  },
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang][key] || key;
};
