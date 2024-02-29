import { Fragment, useCallback, useState } from 'react';

import cn from 'classnames';
import {
  Adornment,
  List,
  ListItem,
  THEME_MODE_KEY,
  THEME_MODE_DEFAULT,
  isThemeDark,
  useTheme,
  Popover,
  ThemeModes
} from 'ui';

import { Button } from 'components/Button';
import Icon from 'components/Icon';
import type { IconProps } from 'components/Icon';
import Text from 'components/Text';

import { useLocalStorage } from 'hooks';

import themeSelectorClasses from './ThemeSelector.module.scss';

const modes = {
  Light: 'Sun',
  Dark: 'Moon',
  System: 'Sparkles'
};

export default function ThemeSelector() {
  const theme = useTheme();
  const [modeStored] = useLocalStorage(THEME_MODE_KEY, THEME_MODE_DEFAULT);
  const [show, setShow] = useState<HTMLButtonElement | null>(null);
  const handleShow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setShow(event.currentTarget),
    []
  );
  const handleHide = useCallback(() => setShow(null), []);
  const handleTheme = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      theme.device.setMode(
        event.currentTarget.name.toLowerCase() as ThemeModes
      );
      handleHide();
    },
    [handleHide, theme.device]
  );
  const iconName = `${isThemeDark(theme.device.mode) ? 'Moon' : 'Sun'}Outlined`;

  return (
    <>
      <Button
        aria-label="Switch theme"
        variant="ghost"
        onClick={handleShow}
        size="sm"
        className={cn(themeSelectorClasses.root)}
      >
        <Icon
          className={themeSelectorClasses.icon}
          name={iconName as IconProps['name']}
          size="lg"
        />
        {isThemeDark(theme.device.mode) ? 'Dark' : 'Light'}
      </Button>
      <Popover position="bottomRight" onHide={handleHide} show={show}>
        {!theme.device.isDesktop && (
          <header className={themeSelectorClasses.header}>
            <Text
              scale="heading"
              fontWeight="bold"
              className={themeSelectorClasses.headerTitle}
            >
              Select Theme Mode
            </Text>
            <Adornment $edge="end">
              <Button
                size="xs"
                variant="ghost"
                color="default"
                aria-label="Hide"
                onClick={handleHide}
              >
                <Icon name="Cross" size="lg" />
              </Button>
            </Adornment>
          </header>
        )}
        <List className={themeSelectorClasses.list}>
          {Object.keys(modes).map(mode => (
            <Fragment key={mode}>
              <ListItem
                className={themeSelectorClasses.listItem}
                $actived={mode.toLowerCase() === modeStored}
                ButtonProps={{
                  name: mode,
                  className: themeSelectorClasses.listItemButton,
                  onClick: handleTheme
                }}
              >
                <Adornment
                  $edge="start"
                  $size={theme.device.isDesktop ? 'sm' : 'md'}
                >
                  <Icon
                    name={modes[mode]}
                    size={theme.device.isDesktop ? 'lg' : 'xl'}
                  />
                </Adornment>
                <Text
                  scale={theme.device.isDesktop ? 'caption' : 'body'}
                  fontWeight="semibold"
                >
                  {mode}
                </Text>
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Popover>
    </>
  );
}
