import { createContext, useContext, useMemo } from 'react';

import { environment, features } from 'config';
import useMedia from 'ui/useMedia';
import useUpdateEffect from 'ui/useUpdateEffect';

import { useLocalStorage } from 'hooks';

export const enum THEME_MODES {
  light = 'light',
  dark = 'dark',
  system = 'system'
}

export const IDLE_STYLES =
  "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important'}";
export const THEME_MODE_KEY = 'THEME_MODE_KEY';
export const THEME_MODE_DEFAULT: ThemeModes = (() => {
  switch (environment.UI_THEME_MODE?.toLowerCase()) {
    case THEME_MODES.light:
      return THEME_MODES.light;
    case THEME_MODES.dark:
      return THEME_MODES.dark;
    case THEME_MODES.system:
      return THEME_MODES.system;
    default:
      return THEME_MODES.dark;
  }
})();

export type ThemeModes = keyof typeof THEME_MODES;
export type ThemeProps = {
  device: {
    mode: Exclude<ThemeModes, THEME_MODES.system>;
    setMode: React.Dispatch<React.SetStateAction<ThemeModes>>;
  } & Record<'isTv' | 'isDesktop' | 'isTablet' | 'isMobileDevice', boolean>;
};
type ThemeProviderProps = Omit<
  React.ProviderProps<Record<string, never>>,
  'value'
>;

const ThemeContext = createContext<ThemeProps>({
  device: {
    mode: 'light',
    isTv: false,
    isDesktop: false,
    isTablet: false,
    isMobileDevice: false,
    setMode: () => { }
  }
});
ThemeContext.displayName = 'Theme';

function handleChangeTheme(arg: ThemeProps['device']['mode']) {
  document.documentElement.dataset.theme = arg;
  document.documentElement.classList.add(`theme--${arg}`);
  document.documentElement.classList.remove(
    `theme--${arg === 'dark' ? 'light' : 'dark'}`
  );
}

/**
 * Returns the theme object and provide a callback for theme mode change.
 * @returns {ThemeProps}
 */
export function useTheme(): ThemeProps {
  return useContext(ThemeContext);
}
export function isThemeDark(
  mode: ThemeProps['device']['mode']
): mode is 'dark' {
  return mode === 'dark';
}
export default function ThemeProvider(props: ThemeProviderProps) {
  const [mode, setMode] = useLocalStorage<ThemeModes>(
    THEME_MODE_KEY,
    THEME_MODE_DEFAULT
  );
  const isDark = useMedia('(prefers-color-scheme: dark)');
  const isTablet = useMedia('(min-width: 768px)');
  const isDesktop = useMedia('(min-width: 1024px)');
  const isTv = useMedia('(min-width: 1440px)');
  const isMobileDevice = useMedia('screen and (max-width: 767px)');
  const value: ThemeProps = useMemo(
    () => ({
      device: {
        mode: (() => {
          if (features.fantasy.enabled) return 'dark';
          if (mode === THEME_MODES.system) {
            if (isDark) return 'dark';
            return 'light';
          }
          return mode;
        })(),
        isTv,
        isDesktop,
        isTablet,
        isMobileDevice,
        setMode
      }
    }),
    [isDark, isDesktop, isTablet, isMobileDevice, isTv, setMode, mode]
  );

  handleChangeTheme(value.device.mode);
  useUpdateEffect(() => {
    let timer = 0;
    const style = document.createElement('style');

    style.appendChild(document.createTextNode(IDLE_STYLES));
    document.head.appendChild(style);
    (() => window.getComputedStyle(document.body))();
    timer = window.setTimeout(() => document.head.removeChild(style), 1);

    return () => window.clearTimeout(timer);
  }, [value.device.mode]);

  if (features.fantasy.enabled && typeof window !== 'undefined')
    window.localStorage.removeItem(THEME_MODE_KEY);

  return <ThemeContext.Provider value={value} {...props} />;
}
