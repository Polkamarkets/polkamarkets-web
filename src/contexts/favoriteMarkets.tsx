import { ReactNode, createContext } from 'react';

import { useLocalStorage } from 'hooks';

export type FavoriteMarketsByNetwork = { [key: string]: string[] };

type FavoriteMarkets = {
  favoriteMarkets: FavoriteMarketsByNetwork;
  setFavoriteMarkets: (_favoriteMarkets: FavoriteMarketsByNetwork) => void;
};

export const FavoriteMarketsContext = createContext<FavoriteMarkets>(
  {} as FavoriteMarkets
);

type FavoriteMarketsProviderProps = {
  children: ReactNode;
};

function FavoriteMarketsProvider({ children }: FavoriteMarketsProviderProps) {
  const [favoriteMarkets, setFavoriteMarkets] =
    useLocalStorage<FavoriteMarketsByNetwork>('favoriteMarketsByNetwork', {});

  return (
    <FavoriteMarketsContext.Provider
      value={{ favoriteMarkets, setFavoriteMarkets }}
    >
      {children}
    </FavoriteMarketsContext.Provider>
  );
}

export default FavoriteMarketsProvider;
