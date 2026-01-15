import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Start with Spanish by default
  const [language, setLanguageState] = useState<Language>('es');

  // Initialize language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    
    const validLanguages: Language[] = ['es', 'en', 'pt', 'fr'];
    if (savedLanguage && validLanguages.includes(savedLanguage as Language)) {
      setLanguageState(savedLanguage as Language);
      document.documentElement.setAttribute('lang', savedLanguage);
    } else {
      // Default to Spanish
      setLanguageState('es');
      document.documentElement.setAttribute('lang', 'es');
      localStorage.setItem('app-language', 'es');
    }
  }, []);

  // Apply language to DOM whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

