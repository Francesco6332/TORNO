import { ReactNode, useEffect, useMemo, useState } from 'react';
import { I18nContext } from './context';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  Language,
  translations,
} from './translations';

const isLanguage = (value: string | null): value is Language => value === 'it' || value === 'en';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return navigator.language.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LANGUAGE;
};

const interpolate = (
  text: string,
  values: Record<string, string | number> = {}
): string => {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.split(`{{${key}}}`).join(String(value)),
    text
  );
};

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string, values?: Record<string, string | number>) => {
        const text = translations[language][key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
        return interpolate(text, values);
      },
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
