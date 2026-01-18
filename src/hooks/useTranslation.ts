import { useState } from 'react';
import type { Language } from '../types';
import { getTranslation } from '../constants/translations';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('vi')) return 'vi';
    return 'en';
  });

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  return { language, t, toggleLanguage };
};
