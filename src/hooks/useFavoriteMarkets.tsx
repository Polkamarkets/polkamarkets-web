/* eslint-disable import/no-cycle */
import { useContext } from 'react';

import uniq from 'lodash/uniq';
import without from 'lodash/without';

import { FavoriteMarketsContext } from 'contexts/favoriteMarkets';

function useFavoriteMarkets() {
  const { favoriteMarkets, setFavoriteMarkets } = useContext(
    FavoriteMarketsContext
  );

  function addFavoriteMarket(networkId: string, marketId: string) {
    setFavoriteMarkets({
      ...favoriteMarkets,
      [networkId]: uniq([...(favoriteMarkets[networkId] || []), marketId])
    });
  }

  function removeFavoriteMarket(networkId: string, marketId: string) {
    setFavoriteMarkets({
      ...favoriteMarkets,
      [networkId]: [...without(favoriteMarkets[networkId] || [], marketId)]
    });
  }

  return {
    favoriteMarkets,
    addFavoriteMarket,
    removeFavoriteMarket
  };
}

export default useFavoriteMarkets;
