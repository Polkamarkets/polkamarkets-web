import { useContext } from 'react';

import isEmpty from 'lodash/isEmpty';

import { LanguageContext } from './useLanguage.context';

function useLanguage() {
  const context = useContext(LanguageContext);

  if (isEmpty(context)) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context.language;
}

export default useLanguage;
