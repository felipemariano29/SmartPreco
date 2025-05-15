'use client';

import { defaultLocale, getTranslations, type Locale, locales } from '@/i18n.config';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { IntlProvider } from './intl-provider';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side only code
    const storedLocale = localStorage.getItem('language') as Locale | null;
    const browserLocale = navigator.language as Locale;
    const preferredLocale = 
      (storedLocale && locales.includes(storedLocale)) ? storedLocale :
      (locales.includes(browserLocale)) ? browserLocale :
      defaultLocale;
    
    setLocale(preferredLocale);
    
    // Load translations
    void getTranslations(preferredLocale)
      .then(loadedMessages => {
        setMessages(loadedMessages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load translations:', error);
        // Fallback to default locale if loading fails
        return getTranslations(defaultLocale);
      })
      .then(fallbackMessages => {
        if (fallbackMessages) {
          setMessages(fallbackMessages);
          setLoading(false);
        }
      });
  }, []);

  if (loading) {
    // Simple loading state
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
} 