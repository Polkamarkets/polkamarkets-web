import { NavLink } from 'react-router-dom';

const marketsPathname = 'Markets';
const pathnames = [marketsPathname, 'Portfolio', 'Achievements', 'Leaderboard'];

export default function NavBarLinks() {
  return (
    <nav className="pm-l-layout__header__nav">
      {pathnames.map(_pathname => {
        const pathname = `/${
          _pathname === marketsPathname ? '' : _pathname.toLowerCase()
        }`;

        return (
          <NavLink
            key={_pathname}
            to={pathname}
            className="pm-l-layout__header__nav-link"
            activeClassName="active"
            isActive={(_, location) => location.pathname === pathname}
          >
            {_pathname}
          </NavLink>
        );
      })}
    </nav>
  );
}
