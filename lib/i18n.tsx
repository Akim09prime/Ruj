
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lang, I18nString } from '../types';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (str: I18nString | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('carvello-lang');
    return (stored as Lang) || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('carvello-lang', lang);
  }, [lang]);

  const t = (str: I18nString | string): string => {
    if (typeof str === 'string') return str;
    return str[lang] || str['ro'];
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
