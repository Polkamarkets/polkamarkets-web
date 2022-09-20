/* eslint-disable import/no-cycle */
import { useCallback, useContext, useEffect } from 'react';

import { actions, ThemeContext, ThemeDispatchContext } from 'contexts/theme';

import useLocalStorage from './useLocalStorage';

function useTheme() {
  const { theme } = useContext(ThemeContext);
  const dispatch = useContext(ThemeDispatchContext);
  const [localStorageTheme, setLocalStorageTheme] = useLocalStorage(
    'theme',
    'dark'
  );
  const setTheme = useCallback(
    newTheme => {
      dispatch({ type: actions.SET_THEME, payload: newTheme });
    },
    [dispatch]
  );

  useEffect(() => {
    setLocalStorageTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return {
    theme: localStorageTheme || theme,
    setTheme
  };
}

export default useTheme;
