import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { environment, features, ui } from 'config';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { toStartEnd } from 'helpers/date';
import { toMinMax } from 'helpers/string';
import difference from 'lodash/difference';
import inRange from 'lodash/inRange';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';
import uniqBy from 'lodash/uniqBy';
import without from 'lodash/without';
import { Market } from 'models/market';
import * as marketService from 'services/Polkamarkets/market';
import { MarketState } from 'types/market';

import type { FavoriteMarketsByNetwork } from 'contexts/favoriteMarkets';
import { sanitizeFilterKey } from 'contexts/filters/filters.util';

import { getCurrencyByTicker, getNetworkById } from './market';

dayjs.extend(isBetween);

const AVAILABLE_NETWORKS_IDS = Object.keys(environment.NETWORKS);

const fantasyTokenTicker =
  features.fantasy.enabled && environment.FEATURE_FANTASY_TOKEN_TICKER
    ? environment.FEATURE_FANTASY_TOKEN_TICKER
    : undefined;

const isMarketTokenFantasy = (market: Market) => {
  return !fantasyTokenTicker || market.token.symbol === fantasyTokenTicker;
};

const isMarketTokenFromSocialLoginNetwork = (market: Market) => {
  if (!ui.socialLogin.enabled) return true;

  return market.networkId.toString() === ui.socialLogin.networkId?.toString();
};

const isMarketFromAvailableNetwork = (market: Market) =>
  AVAILABLE_NETWORKS_IDS.includes(`${market.networkId}`);

const parseTournament = (tournament: string) => {
  const parts = tournament.split(',');
  if (parts.length >= 2) {
    const networkId = parts[1];
    const markets = parts.slice(2);

    return {
      networkId,
      markets: markets.length > 0 ? markets : []
    };
  }

  return null;
};

export interface MarketsIntialState {
  markets: Market[];
  isLoading: {
    open: boolean;
    closed: boolean;
    resolved: boolean;
    favorites: boolean;
    byIds: boolean;
  };
  error: {
    open: any;
    closed: any;
    resolved: any;
    favorites: any;
  };
  searchQuery: string;
  filterByVerified: boolean;
  sorterByEndingSoon: boolean;
  sorter: {
    value: string;
    sortBy: any | undefined;
  };
}

const initialState: MarketsIntialState = {
  markets: [],
  isLoading: {
    open: false,
    closed: false,
    resolved: false,
    favorites: false,
    byIds: false
  },
  error: {
    open: null,
    closed: null,
    resolved: null,
    favorites: null
  },
  searchQuery: '',
  filterByVerified: true,
  sorterByEndingSoon: true,
  sorter: {
    value: 'volumeEur',
    sortBy: undefined
  }
};

const marketsSlice = createSlice({
  name: 'markets',
  initialState,
  reducers: {
    request: (state, action) => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload]: true
      }
    }),
    success: {
      reducer: (
        state,
        action: PayloadAction<{
          type: MarketState | string;
          data: Market[];
        }>
      ) => ({
        ...state,
        markets: uniqBy(
          [...state.markets, ...action.payload.data],
          (market: Market) => `${market.networkId}${market.id}`
        ),
        isLoading: {
          ...state.isLoading,
          [action.payload.type]: false
        },
        error: {
          ...state.error,
          [action.payload.type]: null
        }
      }),
      prepare(type: MarketState | string, data: Market[]) {
        return {
          payload: {
            type,
            data: data
              .filter(isMarketFromAvailableNetwork)
              .filter(isMarketTokenFantasy)
              .filter(isMarketTokenFromSocialLoginNetwork)
              .map(market => {
                const network = getNetworkById(market.networkId);
                const currencyByTokenSymbol = getCurrencyByTicker(
                  market.token.symbol
                );

                return {
                  ...market,
                  network,
                  currency: network.currency,
                  token: {
                    ...market.token,
                    ticker: market.token.symbol,
                    iconName: currencyByTokenSymbol.iconName
                  }
                } as Market;
              })
          },
          type
        };
      }
    },
    error: (state, action) => ({
      ...state,
      markets: [],
      isLoading: {
        open: false,
        closed: false,
        resolved: false,
        favorites: false,
        byIds: false
      },
      error: {
        ...state.error,
        [action.payload.type]: action.payload.error
      }
    }),
    setSearchQuery: (state, action: PayloadAction<string>) => ({
      ...state,
      searchQuery: action.payload
    }),
    setFilterByVerified: (state, action: PayloadAction<boolean>) => ({
      ...state,
      filterByVerified: action.payload
    }),
    setSorterByEndingSoon: (state, action: PayloadAction<boolean>) => ({
      ...state,
      sorterByEndingSoon: action.payload
    }),
    setSorter: (state, action) => ({
      ...state,
      sorter: {
        value: action.payload.value,
        sortBy: action.payload.sortBy
      }
    }),
    changeMarketOutcomeData: (state, action) => ({
      ...state,
      markets: state.markets.map(market =>
        market.id === action.payload.marketId
          ? {
              ...market,
              outcomes: market.outcomes.map((outcome, outcomeIndex) =>
                outcomeIndex === action.payload.outcomeId
                  ? { ...outcome, ...action.payload.data }
                  : outcome
              )
            }
          : market
      )
    }),
    changeMarketQuestion: (state, action) => ({
      ...state,
      markets: state.markets.map(market =>
        market.id === action.payload.marketId
          ? {
              ...market,
              question: action.payload.question
            }
          : market
      )
    }),
    changeMarketVotesById: (state, action) => ({
      ...state,
      markets: state.markets.map(market =>
        market.id === action.payload.marketId
          ? {
              ...market,
              votes: action.payload.votes
            }
          : market
      )
    }),
    changeMarketData: (state, action) => ({
      ...state,
      markets: state.markets.map(market =>
        market.id === action.payload.marketId
          ? {
              ...market,
              ...action.payload.data
            }
          : market
      )
    })
  }
});

export default marketsSlice.reducer;

const {
  request,
  success,
  error,
  setFilterByVerified,
  setSorterByEndingSoon,
  setSearchQuery,
  setSorter,
  changeMarketOutcomeData,
  changeMarketQuestion,
  changeMarketVotesById,
  changeMarketData
} = marketsSlice.actions;

export {
  setFilterByVerified,
  setSorterByEndingSoon,
  setSearchQuery,
  setSorter,
  changeMarketOutcomeData,
  changeMarketQuestion,
  changeMarketVotesById,
  changeMarketData
};

type MarketsSelectorArgs = {
  state: MarketsIntialState;
  filters: {
    favorites?: {
      checked: boolean;
      marketsByNetwork: FavoriteMarketsByNetwork;
    };
    states?: string[];
    networks: string[];
    tokens: string[];
    volume?: string;
    liquidity: string;
    endDate?: string;
    categories?: string[];
    tournaments?: string[];
  } & Record<string, any>;
};

export const marketsSelector = ({ state, filters }: MarketsSelectorArgs) => {
  const regExpFromSearchQuery = new RegExp(state.searchQuery, 'i');

  const extraFilters = omit(
    filters,
    difference(
      Object.keys(filters),
      ui.filters.extra.filters.map(filter => sanitizeFilterKey(filter.name))
    )
  ) as Record<string, string | string[] | undefined>;

  const filterMarketsByExtraFilters = (
    title: string,
    category: string,
    subcategory: string
  ) => {
    if (isEmpty(extraFilters)) return true;

    const validExtraFilters = Object.values(extraFilters).filter(
      f => !isUndefined(f) && !isEmpty(f)
    ) as (string | string[])[];

    if (isEmpty(validExtraFilters)) return true;

    return validExtraFilters.every(filter => {
      if (Array.isArray(filter)) {
        return filter.some(f => {
          const regExp = new RegExp(f, 'i');
          return (
            regExp.test(title) ||
            regExp.test(category) ||
            regExp.test(subcategory)
          );
        });
      }
      const regExp = new RegExp(filter, 'i');
      return (
        regExp.test(title) || regExp.test(category) || regExp.test(subcategory)
      );
    });
  };

  const filterByFavorite = (id, networkId) => {
    if (!filters.favorites) return true;

    return filters.favorites.checked
      ? filters.favorites.marketsByNetwork[`${networkId}`] &&
          filters.favorites.marketsByNetwork[`${networkId}`].includes(id)
      : true;
  };

  const filterByNetworkId = networkId =>
    !isEmpty(filters.networks)
      ? filters.networks.includes(`${networkId}`)
      : true;

  const filterByTokenSymbol = (tokenSymbol: string) => {
    if (isEmpty(filters.tokens)) {
      return true;
    }

    if (
      some(
        without(filters.tokens, 'other').map(token =>
          tokenSymbol.includes(token)
        )
      )
    ) {
      return true;
    }

    if (filters.tokens.includes('other')) {
      return !some(ui.filters.tokens.map(token => tokenSymbol.includes(token)));
    }

    return false;
  };

  const filterByState = marketState => {
    if (!filters.states) return true;

    return !isEmpty(filters.states)
      ? filters.states.includes(marketState)
      : true;
  };

  const filterByRange = (value: number, range: string) => {
    const { min, max } = toMinMax(range);

    if (!max) {
      return value >= min;
    }

    return inRange(value, min, max);
  };

  const filterByVolume = (volume: number) => {
    if (!filters.volume) return true;

    if (filters.volume !== 'any') {
      return filterByRange(volume, filters.volume);
    }

    return true;
  };

  const filterByLiquidity = (liquidity: number) => {
    if (!filters.liquidity) return true;

    if (filters.liquidity !== 'any') {
      return filterByRange(liquidity, filters.liquidity);
    }

    return true;
  };

  const filterByEndDate = (expiresAt: string) => {
    if (!filters.endDate) return true;

    if (filters.endDate === 'custom') {
      return true;
    }

    if (filters.endDate !== 'any') {
      const { start, end } = toStartEnd(filters.endDate);

      if (!start) return dayjs(expiresAt).utc().isBefore(end);
      if (!end) return dayjs(expiresAt).utc().isAfter(start);

      return dayjs(expiresAt).utc().isBetween(start, end);
    }

    return true;
  };

  const filterByCategory = (category: string) => {
    if (!filters.categories) return true;

    return !isEmpty(filters.categories)
      ? filters.categories
          .map(c => c.toLowerCase())
          .includes(category.toLowerCase())
      : true;
  };

  // const filterByisEndingSoon = expiresAt =>
  //   inRange(dayjs().diff(dayjs(expiresAt), 'hours'), -24, 1);

  const filterByTournament = (networkId: string, marketId: string): boolean => {
    if (!filters.tournaments) return true;

    if (isEmpty(filters.tournaments)) {
      return true;
    }

    const marketInTournament = filters.tournaments.some(tournament => {
      const parsedTournament = parseTournament(tournament);

      if (parsedTournament) {
        return (
          parsedTournament.networkId === networkId.toString() &&
          parsedTournament.markets.includes(marketId.toString())
        );
      }

      return false;
    });

    return marketInTournament;
  };

  function sorted(markets: Market[]) {
    if (state.sorter.sortBy) {
      // if (state.sorterByEndingSoon) {
      //   return [
      //     ...markets.filter(market => filterByisEndingSoon(market.expiresAt)),
      //     ...orderBy(
      //       markets.filter(market => !filterByisEndingSoon(market.expiresAt)),
      //       [state.sorter.value],
      //       [state.sorter.sortBy]
      //     )
      //   ];
      // }

      if (state.sorter.value === 'createdAt') {
        return [
          ...orderBy(
            markets.filter(market =>
              state.sorter.sortBy === 'desc'
                ? market.state === 'open'
                : market.state !== 'open'
            ),
            [state.sorter.value],
            [state.sorter.sortBy]
          ),
          ...orderBy(
            markets.filter(market =>
              state.sorter.sortBy === 'desc'
                ? market.state !== 'open'
                : market.state === 'open'
            ),
            [state.sorter.value],
            [state.sorter.sortBy]
          )
        ];
      }

      return orderBy(markets, [state.sorter.value], [state.sorter.sortBy]);
    }

    return markets;
  }

  return sorted(
    state.markets?.filter(
      market =>
        (market.category?.match(regExpFromSearchQuery) ||
          market.subcategory?.match(regExpFromSearchQuery) ||
          market.title?.match(regExpFromSearchQuery)) &&
        filterByFavorite(market.id, market.networkId) &&
        filterByNetworkId(market.networkId) &&
        filterByTokenSymbol(market.token.symbol) &&
        filterByState(market.state) &&
        filterByVolume(market.volumeEur) &&
        filterByLiquidity(market.liquidityEur) &&
        filterByEndDate(market.expiresAt) &&
        filterByCategory(market.category) &&
        filterByTournament(market.networkId, market.id) &&
        filterMarketsByExtraFilters(
          market.title,
          market.category,
          market.subcategory
        )
    )
  );
};

export function getMarkets(marketState: MarketState, networkId?: string) {
  return async dispatch => {
    dispatch(request(marketState));
    try {
      const response = await marketService.getMarkets({
        state: marketState,
        networkId
      });
      const { data } = response;
      dispatch(success(marketState, data));
    } catch (err) {
      dispatch(error({ type: marketState, error: err }));
    }
  };
}

export function getFavoriteMarketsByNetwork(ids: string[], networkId) {
  return async dispatch => {
    dispatch(request('favorites'));
    try {
      const response = await marketService.getMarketsByIds({ ids, networkId });
      const { data } = response;
      dispatch(success('favorites', data));
    } catch (err) {
      dispatch(error({ type: 'favorites', error: err }));
    }
  };
}

export function getFavoriteMarkets(favoriteMarkets: FavoriteMarketsByNetwork) {
  return async dispatch => {
    return Promise.all(
      Object.keys(omitBy(favoriteMarkets, isEmpty)).map(networkId =>
        dispatch(
          getFavoriteMarketsByNetwork(favoriteMarkets[networkId], networkId)
        )
      )
    );
  };
}

export function getMarketsByIds(ids: string[], networkId: number) {
  return async dispatch => {
    dispatch(request('byIds'));
    try {
      const response = await marketService.getMarketsByIds({
        ids,
        networkId: networkId.toString()
      });
      const { data } = response;
      dispatch(success('byIds', data));
    } catch (err) {
      dispatch(error({ type: 'byIds', error: err }));
    }
  };
}
