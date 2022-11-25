import { Link } from 'react-router-dom';

import cn from 'classnames';
import { Container, useMedia } from 'ui';

import { PolkamarketsLogo } from 'assets/icons';

import NavBarClasses from './NavBar.module.scss';
import NavBarActionsInfo from './NavBarActionsInfo';
import NavBarActionsNetwork from './NavBarActionsNetwork';
import NavBarActionsTheme from './NavBarActionsTheme';
import NavBarLinks from './NavBarLinks';

export default function NavBar() {
  const isDesktop = useMedia('(min-width: 1024px)');

  return (
    <Container as="header" className="pm-l-layout__header">
      <Link to="/" aria-label="Homepage" className="pm-l-layout__header__logos">
        <PolkamarketsLogo />
      </Link>
      {isDesktop && <NavBarLinks />}
      <div
        className={cn('pm-l-layout__header__actions', NavBarClasses.actions)}
      >
        {isDesktop && <NavBarActionsInfo />}
        <NavBarActionsTheme />
        {isDesktop && <NavBarActionsNetwork />}
      </div>
    </Container>
  );
}

NavBar.displayName = 'NavBar';
