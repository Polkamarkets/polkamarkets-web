import { matchPath, useLocation } from 'react-router-dom';

import { pages } from 'config';

export default function useMarketPath() {
  const location = useLocation();

  return matchPath(location.pathname, {
    path: pages.markets.pages.market.pathname
  });
}
