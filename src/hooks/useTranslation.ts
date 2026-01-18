import { useState, useEffect } from 'react';
import type { Language } from '../types';
import { getTranslation } from '../constants/translations';

/**
 * Detect user language with priority:
 * 1. localStorage (user manual selection)
 * 2. Browser/Device language
 * 3. Fallback: English
 */
function detectUserLanguage(): Language {
  // 1. Check localStorage (user đã chọn manual)
  try {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'vi' || savedLang === 'en') {
      return savedLang;
    }
  } catch (error) {
    // localStorage not available, continue to browser detection
  }
  
  // 2. Browser/Device language
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  
  if (browserLang) {
    const langLower = browserLang.toLowerCase();
    // Check for Vietnamese
    if (langLower.startsWith('vi')) {
      return 'vi';
    }
  }
  
  // 3. Fallback: English
  return 'en';
}

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(detectUserLanguage);

  // Save language preference to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      // localStorage not available, ignore
    }
  }, [language]);

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  return { language, t, toggleLanguage };
};
