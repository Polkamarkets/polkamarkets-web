import { useCallback, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import cn from 'classnames';
import { pages, community, ui, features } from 'config';
import isEmpty from 'lodash/isEmpty';
import { useTheme } from 'ui';

import * as Logos from 'assets/icons';

import { Button } from 'components/Button';
import CreateMarket from 'components/CreateMarket';
import Feature from 'components/Feature';
import HelpButton from 'components/Header/HelpButton';
import ProfileSignin from 'components/Header/ProfileSignin';
import HowToPlayButton from 'components/HowToPlayButton';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import NetworkSelector from 'components/NetworkSelector';
import Text from 'components/Text';

import useAppSelector from 'hooks/useAppSelector';

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
        <footer className={styles.footer}>
          {ui.layout.header.communityUrls.enabled && !isEmpty(community) ? (
            <div>
              <Text
                color="gray"
                scale="tiny-uppercase"
                fontWeight="bold"
                className={styles.title}
              >
                Join our community
              </Text>
              <ul className={styles.socials}>
                {community.map(social => (
                  <li key={social.name}>
                    <Text
                      // @ts-ignore
                      as="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social}
                    >
                      <Icon
                        title={social.name}
                        name={social.name}
                        className={styles.icon}
                      />
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Feature name="regular">
            <CreateMarket
              fullwidth
              className={styles.createMarket}
              onCreateClick={handleHide}
            />
          </Feature>
        </footer>
      </Modal>
    </>
  );
}
function HeaderNavMenu({
  onMenuItemClick,
  children
}: React.PropsWithChildren<{
  onMenuItemClick?(): void;
}>) {
  return (
    <ul className={styles.list}>
      <li className={styles.item}>
        <NavLink
          to="/"
          className={styles.link}
          activeClassName={styles.active}
          onClick={onMenuItemClick}
        >
          Communities
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          to="/"
          className={styles.link}
          activeClassName={styles.active}
          onClick={onMenuItemClick}
        >
          Contests
        </NavLink>
      </li>

      {children}
    </ul>
  );
}
function HeaderNavMenuModal() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  return (
    <HeaderNavModal>
      {handleHide => (
        <HeaderNavMenu onMenuItemClick={handleHide}>
          {features.fantasy.enabled &&
            !isLoggedIn &&
            (ui.layout.header.helpUrl || ui.layout.onboarding) && (
              <>
                {ui.layout.header.helpUrl && (
                  <li className={styles.item}>
                    <HelpButton
                      $outline
                      $fullWidth
                      onClick={handleHide}
                      href={ui.layout.header.helpUrl}
                    />
                  </li>
                )}
                {!!ui.layout.onboarding && (
                  <li className={styles.item}>
                    <HowToPlayButton $outline $fullWidth />
                  </li>
                )}
              </>
            )}
        </HeaderNavMenu>
      )}
    </HeaderNavModal>
  );
}
export default function HeaderNav() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const theme = useTheme();
  const showLeftMenu =
    theme.device.isDesktop &&
    !theme.device.isTv &&
    !!headerNavMenu.length &&
    !!ui.layout.navbar.items.length;

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
        <Logos.PolkamarketsLogo />
      </Link>
      {theme.device.isTv && <HeaderNavMenu />}
      {!theme.device.isDesktop && ui.layout.header.networkSelector.enabled && (
        <NetworkSelector size="sm" responsive className={styles.network} />
      )}
      {!theme.device.isDesktop && features.fantasy.enabled && !isLoggedIn && (
        <ProfileSignin variant="normal" color="primary" size="xs">
          <Icon name="Profile" size="md" />
          <Text as="span" scale="caption">
            Sign In
          </Text>
        </ProfileSignin>
      )}
      {!theme.device.isDesktop &&
        ((features.fantasy.enabled &&
          (!!ui.layout.header.helpUrl || !!ui.layout.onboarding)) ||
          !!headerNavMenu.length ||
          !!ui.layout.navbar.items.length) && <HeaderNavMenuModal />}
    </nav>
  );
}
