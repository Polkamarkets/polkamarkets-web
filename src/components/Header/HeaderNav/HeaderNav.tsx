import { Link } from 'react-router-dom';

import { ui } from 'config';
import { useTheme } from 'ui';

import * as Logos from 'assets/icons';

import { ExploreMenu } from '../ExploreMenu/ExploreMenu';
import styles from './HeaderNav.module.scss';

export default function HeaderNav() {
  const theme = useTheme();

  const headerLogo = () => {
    const LogoDesktopComponent = ui.logo.desktop
      ? Logos[ui.logo.desktop]
      : Logos.ForelandLogo;
    const LogoMobileComponent = ui.logo.mobile
      ? Logos[ui.logo.mobile]
      : Logos.ForelandMobileLogo;
    if (LogoDesktopComponent && !LogoMobileComponent) {
      return <LogoDesktopComponent />;
    }

    return theme.device.isDesktop ? (
      <LogoDesktopComponent />
    ) : (
      <LogoMobileComponent />
    );
  };

  return (
    <nav className={styles.root}>
      <Link to="/" aria-label="Homepage" className={styles.logos}>
        {headerLogo()}
      </Link>
      {!theme.device.isMobileDevice && <ExploreMenu />}
    </nav>
  );
}
