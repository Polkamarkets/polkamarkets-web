import { useContext } from 'react';

import { environment } from 'config';
import isEmpty from 'lodash/isEmpty';

import { LanguageContext } from './useLanguage.context';
import { LanguageCode } from './useLanguage.type';

function useLanguage() {
  const context = useContext(LanguageContext);

  if (environment.DEFAULT_LANGUAGE) {
    return environment.DEFAULT_LANGUAGE as LanguageCode;
  }

  if (isEmpty(context)) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context.language;
}

export default useLanguage;
