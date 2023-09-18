import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { pages, environment, ui } from 'config';

import BetaTesting from 'components/BetaTesting';
import BetaWarning from 'components/BetaWarning';
import Footer from 'components/Footer';
import Header from 'components/Header';
import SEO from 'components/SEO';
import WrongNetwork from 'components/WrongNetwork';

import { useAppSelector, useMarketPath, useNetwork } from 'hooks';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { network } = useNetwork();
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const location = useLocation();
  const marketPath = useMarketPath();
  const [page] = Object.values(pages).filter(
    ({ pathname }) => pathname === location.pathname
  );
  const isHomePathname =
    location.pathname === pages.home.pathname || marketPath;
  const isAllowedNetwork =
    !isLoggedIn || Object.keys(environment.NETWORKS).includes(network.id);

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      {page?.meta && <SEO {...page.meta} />}
      {ui.layout.disclaimer.enabled && <BetaWarning />}
      {ui.layout.alert.enabled && <BetaTesting network={network} />}
      {!ui.socialLogin.enabled && !isAllowedNetwork && (
        <WrongNetwork network={network} />
      )}
      <Header $gutterBottom={!isHomePathname} />
      {children}
      <Footer $gutterTop={!isHomePathname} />
      <div id="toast-notification-portal" />
    </>
  );
}
