import { useCallback, useMemo } from 'react';

import { camelize } from 'humps';
import isEmpty from 'lodash/isEmpty';
import {
  getFavoriteMarkets,
  getMarkets,
  getMarketsByIds,
  marketsSelector
} from 'redux/ducks/markets';

import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import useFavoriteMarkets from './useFavoriteMarkets';
import useFilters from './useFilters';

export default function useMarkets(fetchByIds?: {
  ids: string[];
  networkId: number;
}) {
  const dispatch = useAppDispatch();
  const { favoriteMarkets } = useFavoriteMarkets();
  const { state: filtersState } = useFilters();
  const rawMarkets = useAppSelector(state => state.markets);
  const { isLoading, error } = rawMarkets;

  const selectedMarkets = marketsSelector({
    state: rawMarkets,
    filters: {
      favorites: {
        checked: filtersState.toggles.favorites,
        marketsByNetwork: favoriteMarkets
      },
      states: filtersState.dropdowns.states as string[],
      networks: filtersState.dropdowns.networks as string[],
      tokens: filtersState.dropdowns.tokens as string[],
      volume: filtersState.dropdowns.volume as string,
      liquidity: filtersState.dropdowns.liquidity as string,
      endDate: filtersState.dropdowns.endDate as string,
      categories: filtersState.dropdowns.categories as string[],
      tournaments: filtersState.dropdowns.tournaments as string[],
      ...Object.keys(filtersState.dropdowns).reduce((acc, filter) => {
        acc[`${camelize(filter)}`] = filtersState.dropdowns[filter];
        return acc;
      }, {})
    }
  });

  const markets = useMemo(() => {
    if (!fetchByIds || isEmpty(fetchByIds.ids)) return selectedMarkets;
    return selectedMarkets.filter(
      market =>
        fetchByIds.ids.includes(market.id) &&
        market.networkId.toString() === fetchByIds.networkId.toString()
    );
  }, [fetchByIds, selectedMarkets]);

  const fetch = useCallback(async () => {
    if (fetchByIds) {
      if (!isEmpty(fetchByIds.ids)) {
        dispatch(getMarketsByIds(fetchByIds.ids, fetchByIds.networkId));
      }
    } else {
      dispatch(getMarkets('open'));
      dispatch(getMarkets('closed'));
      dispatch(getMarkets('resolved'));
      dispatch(getFavoriteMarkets(favoriteMarkets));
    }
  }, [dispatch, favoriteMarkets, fetchByIds]);

  const state = useMemo(() => {
    if (Object.values(isLoading).some(Boolean)) return 'loading';
    if (
      Object.values(error).some(
        value => value !== null && value.message !== 'canceled'
      )
    )
      return 'error';
    if (!markets.length) return 'warning';
    return 'success';
  }, [error, isLoading, markets.length]);

  return {
    data: markets,
    fetch,
    state
  } as const;
}

export type UseMarkets = ReturnType<typeof useMarkets>;
