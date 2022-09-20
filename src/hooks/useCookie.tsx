// https://medium.com/swlh/react-hooks-usecookie-hook-26ac06ff36b0

import { useCallback } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getItem = key =>
  document.cookie.split('; ').reduce((total, currentCookie) => {
    const [storedKey, storedValue] = currentCookie.split('=');

    return key === storedKey ? decodeURIComponent(storedValue) : total;
  }, '');

const setItem = (key, value) => {
  const now = dayjs();
  const expiresAt = now.add(1, 'hour');

  document.cookie = `${key}=${value}; expires=${expiresAt
    .utc()
    .toString()}; path=/`;
};

export default function useCookie(
  key,
  defaultValue
): [string, (_value: unknown) => void] {
  const cookie = getItem(key);
  const setCookie = useCallback(value => setItem(key, value), [key]);

  return [cookie || defaultValue, setCookie];
}
