import { Link } from 'react-router-dom';

import { PolkamarketsLogo } from 'assets/icons';

import NavBarActions from './NavBarActions';
import NavBarLinks from './NavBarLinks';

export default function NavBar() {
  return (
    <header className="pm-l-layout__header">
      <Link to="/" aria-label="Homepage" className="pm-l-layout__header__logos">
        <PolkamarketsLogo />
      </Link>
      <NavBarLinks />
      <NavBarActions />
    </header>
  );
}

NavBar.displayName = 'NavBar';
