import { useState, useEffect, createContext, ReactNode } from 'react';

import dayjs from 'dayjs';

import type { LanguageContextState, LanguageCode } from './useLanguage.type';

export const LanguageContext = createContext<LanguageContextState>(
  {} as LanguageContextState
);

type LanguageProviderProps = {
  children: ReactNode;
};

function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<string>(
    document.documentElement.lang
  );

  const [loadedLanguages, setLoadedLanguages] = useState<string[]>(['en']);

  useEffect(() => {
    function loadLanguage(lang: string) {
      if (!loadedLanguages.includes(lang)) {
        import(`dayjs/locale/${lang}.js`);
        setLoadedLanguages([...loadedLanguages, lang]);
      }
    }

    function updateLanguage() {
      loadLanguage(document.documentElement.lang);
      setLanguage(document.documentElement.lang);
      dayjs.locale(document.documentElement.lang);
    }

    const observer = new MutationObserver(updateLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    return () => {
      observer.disconnect();
    };
  }, [loadedLanguages]);

  return (
    <LanguageContext.Provider
      value={{
        language: language as LanguageCode
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
