import { filteredMarketsSelector } from 'redux/ducks/markets';

import { useAppSelector, useFavoriteMarkets } from 'hooks';
import useCategories from 'hooks/useCategories';

import HomeCategories from './HomeCategories';
import HomeMobileInfo from './HomeMobileInfo';
import HomeTabs from './HomeTabs';

function Home() {
  const categories = useCategories();
  const markets = useAppSelector(state =>
    filteredMarketsSelector(state.markets, categories)
  );

  const { favoriteMarkets } = useFavoriteMarkets();

  const openMarkets = markets.filter(market => market.state === 'open');
  const closedMarkets = markets.filter(market => market.state === 'closed');
  const resolvedMarkets = markets.filter(market => market.state === 'resolved');
  const favoritesMarkets = markets.filter(
    market =>
      favoriteMarkets[`${market.networkId}`] &&
      favoriteMarkets[`${market.networkId}`].includes(market.id)
  );

  return (
    <div className="pm-p-home">
      <HomeMobileInfo />
      <HomeCategories />
      <HomeTabs
        openMarkets={openMarkets}
        closedMarkets={closedMarkets}
        resolvedMarkets={resolvedMarkets}
        favoritesMarkets={favoritesMarkets}
      />
    </div>
  );
}

export default Home;
