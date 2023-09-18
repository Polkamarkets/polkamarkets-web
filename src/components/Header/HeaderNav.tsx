import { useCallback, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import type ReactRouterDom from 'react-router-dom';

import { pages, community, ui } from 'config';
import { shiftSlash } from 'helpers/string';
import isEmpty from 'lodash/isEmpty';
import { useTheme } from 'ui';
import Button from 'ui/Button';

import * as Logos from 'assets/icons';
import { ReactComponent as V2Badge } from 'assets/icons/svgs/v2-badge.svg';

import CreateMarket from 'components/CreateMarket';
import Feature from 'components/Feature';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import NetworkSelector from 'components/NetworkSelector';
import Text from 'components/Text';

import headerNavClasses from './HeaderNav.module.scss';

const LogoComponent = ui.logo ? Logos[ui.logo] : null;

function HeaderNavModal({
  children
}: {
  children: ((arg: () => void) => React.ReactNode) | React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const handleHide = useCallback(() => setShow(false), []);

  return (
    <>
      <Button $color="text" $variant="text" onClick={() => setShow(true)}>
        <Icon name="Menu" size="lg" title="Open Menu" />
      </Button>
      <Modal
        show={show}
        fullScreen
        fullWidth
        className={{
          dialog: headerNavClasses.dialog
        }}
      >
        <header className={headerNavClasses.header}>
          <Button
            $color="text"
            $variant="text"
            onClick={handleHide}
            className={headerNavClasses.hide}
          >
            <Icon name="Cross" size="lg" title="Close Menu" />
          </Button>
        </header>
        {typeof children === 'function' ? children(handleHide) : children}
        <footer className={headerNavClasses.footer}>
          {ui.layout.header.communityUrls.enabled && !isEmpty(community) ? (
            <>
              <Text
                color="gray"
                scale="tiny-uppercase"
                fontWeight="bold"
                className={headerNavClasses.title}
              >
                Join our community
              </Text>
              <ul className={headerNavClasses.socials}>
                {community.map(social => (
                  <li key={social.name}>
                    <Text
                      // @ts-ignore
                      as="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={headerNavClasses.social}
                    >
                      <Icon
                        title={social.name}
                        name={social.name}
                        className={headerNavClasses.icon}
                      />
                    </Text>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <Feature name="regular">
            <CreateMarket
              fullwidth
              className={headerNavClasses.createMarket}
              onCreateClick={handleHide}
            />
          </Feature>
        </footer>
      </Modal>
    </>
  );
}
function HeaderNavMenu({
  NavLinkProps
}: {
  NavLinkProps?: Omit<ReactRouterDom.NavLinkProps, 'to'>;
}) {
  return (
    <ul className={headerNavClasses.list}>
      {Object.values(pages)
        .filter(page => page.enabled && page.navigation)
        .reverse()
        .map(page => (
          <li key={page.name} className={headerNavClasses.item}>
            <NavLink
              to={page.pathname}
              className={headerNavClasses.link}
              activeClassName={headerNavClasses.active}
              isActive={(_, location) => {
                if (
                  location.pathname === pages.home.pathname ||
                  /^\/markets/.test(location.pathname)
                ) {
                  return page.pathname === pages.home.pathname;
                }

                if (pages.clubs.enabled && /^\/clubs/.test(location.pathname)) {
                  return page.pathname === pages.clubs.pathname;
                }

                if (
                  pages.tournaments.enabled &&
                  /^\/tournaments/.test(location.pathname)
                ) {
                  return page.pathname === pages.tournaments.pathname;
                }

                return new RegExp(shiftSlash(location.pathname)).test(
                  shiftSlash(page.pathname)
                );
              }}
              {...NavLinkProps}
            >
              {page.name}
            </NavLink>
          </li>
        ))}
    </ul>
  );
}
function HeaderNavMenuModal() {
  return (
    <HeaderNavModal>
      {handleHide => <HeaderNavMenu NavLinkProps={{ onClick: handleHide }} />}
    </HeaderNavModal>
  );
}
export default function HeaderNav() {
  const theme = useTheme();

  return (
    <nav className={headerNavClasses.root}>
      {theme.device.isDesktop && !theme.device.isTv && <HeaderNavMenuModal />}
      <Link to="/" aria-label="Homepage" className={headerNavClasses.logos}>
        {LogoComponent ? (
          <LogoComponent />
        ) : (
          <>
            <Logos.PolkamarketsLogo />
            <V2Badge className={headerNavClasses.logosBadge} />
          </>
        )}
      </Link>
      {theme.device.isTv ? (
        <HeaderNavMenu />
      ) : (
        !theme.device.isDesktop && (
          <>
            {ui.layout.header.networkSelector.enabled ? (
              <NetworkSelector
                $color="text"
                $variant="outline"
                responsive
                className={headerNavClasses.network}
              />
            ) : null}
            <HeaderNavMenuModal />
          </>
        )
      )}
    </nav>
  );
}
