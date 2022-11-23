import { Link } from 'react-router-dom';

import { useMedia } from 'ui';

import { PolkamarketsLogo } from 'assets/icons';

import NavBarActions from './NavBarActions';
import NavBarActionsNetwork from './NavBarActionsNetwork';
import NavBarActionsTheme from './NavBarActionsTheme';
import NavBarLinks from './NavBarLinks';

export default function NavBar() {
  const isDesktop = useMedia('(min-width: 1024px)');

  return (
    <header className="pm-l-layout__header">
      <Link to="/" aria-label="Homepage" className="pm-l-layout__header__logos">
        <PolkamarketsLogo />
      </Link>
      {isDesktop && <NavBarLinks />}
      <NavBarActions isDesktop={isDesktop}>
        <NavBarActionsTheme />
        {isDesktop && <NavBarActionsNetwork />}
      </NavBarActions>
    </header>
  );
}

NavBar.displayName = 'NavBar';
