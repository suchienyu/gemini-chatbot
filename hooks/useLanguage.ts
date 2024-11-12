// src/hooks/useLanguage.ts
'use client';

import { useState, useEffect } from 'react';
import { Language, DEFAULT_LANGUAGE, getTranslation, TranslationKey } from '@/lib/utils';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else if (browserLanguage === 'zh' || browserLanguage === 'en') {
      setLanguage(browserLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key:TranslationKey, params: Record<string, string> = {}) => {
    return getTranslation(language, key, params);
  };

  return {
    language,
    changeLanguage,
    t
  };
}