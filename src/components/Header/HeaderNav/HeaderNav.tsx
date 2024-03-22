import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { pages, ui, features } from 'config';
import { useTheme } from 'ui';

import * as Logos from 'assets/icons';

import AuthModal from 'components/AuthModal';
import { Button } from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import NetworkSelector from 'components/NetworkSelector';
import Text from 'components/Text';

import useAppSelector from 'hooks/useAppSelector';

import { ExploreMenu } from '../ExploreMenu/ExploreMenu';
import styles from './HeaderNav.module.scss';

const headerNavMenu = Object.values(pages)
  .filter(page => page.enabled && page.navigation)
  .reverse();

function HeaderNavModal({
  children
}: {
  children: (arg: () => void) => React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const handleHide = useCallback(() => setShow(false), []);

  return (
    <>
      <Button
        className={styles.menu}
        size="xs"
        variant="ghost"
        onClick={() => setShow(true)}
      >
        <Icon name="Menu" size="lg" title="Open Menu" />
      </Button>
      <Modal
        show={show}
        fullScreen
        fullWidth
        className={{
          dialog: styles.dialog
        }}
      >
        <header className={styles.header}>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleHide}
            className={styles.hide}
          >
            <Icon name="Cross" size="lg" title="Close Menu" />
          </Button>
        </header>
        {children(handleHide)}
      </Modal>
    </>
  );
}
function HeaderNavMenu() {
  return <ExploreMenu />;
}
function HeaderNavMenuModal() {
  return <HeaderNavModal>{_handleHide => <HeaderNavMenu />}</HeaderNavModal>;
}
export default function HeaderNav() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const theme = useTheme();
  const showLeftMenu =
    theme.device.isDesktop &&
    !theme.device.isTv &&
    !!headerNavMenu.length &&
    !!ui.layout.navbar.items.length;

  const headerLogo = () => {
    const LogoDesktopComponent = ui.logo.desktop
      ? Logos[ui.logo.desktop]
      : null;
    const LogoMobileComponent = ui.logo.mobile ? Logos[ui.logo.mobile] : null;
    if (LogoDesktopComponent && !LogoMobileComponent) {
      return <LogoDesktopComponent />;
    }

    if (theme.device.isDesktop && LogoDesktopComponent) {
      return <LogoDesktopComponent />;
    }

    if (!theme.device.isDesktop && LogoMobileComponent) {
      return <LogoMobileComponent />;
    }

    return <Logos.PolkamarketsLogo />;
  };

  return (
    <nav className={styles.root}>
      {showLeftMenu && <HeaderNavMenuModal />}
      <Link
        to="/"
        aria-label="Homepage"
        className={cn(styles.logos, {
          [styles.logosGutter]: showLeftMenu
        })}
      >
        {headerLogo()}
      </Link>
      {theme.device.isTv && <HeaderNavMenu />}
      {!theme.device.isDesktop && ui.layout.header.networkSelector.enabled && (
        <NetworkSelector size="sm" responsive className={styles.network} />
      )}
      {!theme.device.isDesktop && features.fantasy.enabled && !isLoggedIn && (
        <AuthModal variant="primary" size="sm">
          <Icon name="Profile" size="md" />
          <Text as="span" scale="caption">
            Sign In
          </Text>
        </AuthModal>
      )}
      {!theme.device.isDesktop &&
        ((features.fantasy.enabled &&
          (!!ui.layout.header.helpUrl || !!ui.layout.onboarding)) ||
          !!headerNavMenu.length ||
          !!ui.layout.navbar.items.length) && <HeaderNavMenuModal />}
    </nav>
  );
}
