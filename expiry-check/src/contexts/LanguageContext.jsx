import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n/index.js';

const STORAGE_KEY = 'ec-lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'en'
  );

  function setLanguage(lang) {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
    const dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }

  // Apply on mount
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir  = dir;
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
