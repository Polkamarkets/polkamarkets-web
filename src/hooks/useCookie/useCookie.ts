import { useCallback, useMemo } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Hook with cookie getter and setter, that uses the Document interface object.
 * @param {string} key The cookie name.
 * @param {string} defaultValue The default value that will be returned if no cookie was found with the provided cookie's name.
 * @returns {[string | null, (newValue: string) => void]} An array with the first value being the returned cookie or null, and the second as a callback for a setter of a new cookie.
 */
export default function useCookie<V>(key: string, defaultValue?: V) {
  const value = useMemo(
    () =>
      document.cookie?.split('; ').reduce((total, currentCookie) => {
        const [storedKey, storedValue] = currentCookie.split('=');

        return key === storedKey ? decodeURIComponent(storedValue) : total;
      }, ''),
    [key]
  );
  const setCookie = useCallback(
    (newValue: V) => {
      const expiresAt = dayjs().add(1, 'hour').utc().toString();

      document.cookie = `${key}=${newValue}; expires=${expiresAt}; path=/`;
    },
    [key]
  );

  return [value || defaultValue || null, setCookie] as const;
}
