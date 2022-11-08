import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Market } from 'models/market';
import * as marketService from 'services/Polkamarkets/market';
import { Currency } from 'types/currency';
import { Network } from 'types/network';

import NETWORKS from 'hooks/useNetwork/networks';

const chartViewsEnum = [
  { id: 'marketOverview', name: 'Market Overview', color: 'default' },
  { id: 'tradingView', name: 'TradingView', color: 'default' }
];

function toHex(value: string) {
  return `0x${Number(value).toString(16)}`;
}

function getNetworkById(id: string) {
  return NETWORKS[toHex(id)];
}

export interface MarketInitialState {
  market: Market;
  chartViews: Array<any>;
  chartViewType: string;
  isLoading: boolean;
  isLoadingPriceCharts: boolean;
  error: any;
}

const initialState: MarketInitialState = {
  market: {
    id: '',
    slug: '',
    category: '',
    subcategory: '',
    resolutionSource: null,
    imageUrl: '',
    bannerUrl: '',
    title: '',
    volume: 0,
    volumeEur: 0,
    shares: 0,
    liquidity: 0,
    liquidityEur: 0,
    liquidityPrice: 0,
    createdAt: '',
    expiresAt: '',
    state: 'open',
    verified: false,
    voided: false,
    questionId: '',
    networkId: '',
    network: {} as Network,
    currency: {} as Currency,
    votes: { up: 0, down: 0 },
    resolvedOutcomeId: -1,
    outcomes: [
      {
        id: '-1',
        marketId: '',
        title: '',
        price: 0,
        priceChange24h: 0,
        change: {
          type: '',
          chartData: []
        },
        priceCharts: [],
        shares: 0
      },
      {
        id: '-2',
        marketId: '',
        title: '',
        price: 0,
        priceChange24h: 0,
        change: {
          type: '',
          chartData: []
        },
        priceCharts: [],
        shares: 0
      }
    ],
    tradingViewSymbol: null,
    fee: 0,
    question: {
      id: '0x0000000000000000000000000000000000000000000000000000000000000000',
      bond: 0,
      bestAnswer:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      isFinalized: false,
      isClaimed: false,
      finalizeTs: 0
    },
    news: []
  },
  chartViews: chartViewsEnum,
  chartViewType: 'marketOverview',
  isLoading: false,
  isLoadingPriceCharts: false,
  error: null
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    request: state => ({
      ...state,
      isLoading: true,
      error: null
    }),
    success: {
      reducer: (state, action: PayloadAction<Market>) => ({
        ...state,
        market: action.payload,
        isLoading: false
      }),
      prepare: (market: Market) => {
        const network = getNetworkById(market.networkId);
        return {
          payload: {
            ...market,
            network,
            currency: network.currency,
            outcomes: market.outcomes.map(outcome => ({
              ...outcome,
              price: Number(outcome.price.toFixed(3))
            }))
          }
        };
      }
    },
    error: (state, action) => ({
      ...state,
      market: initialState.market,
      isLoading: false,
      error: action.payload
    }),
    marketSelected: {
      reducer: (state, action: PayloadAction<Market>) => ({
        ...state,
        market: action.payload
      }),
      prepare: (market: Market) => {
        const network = getNetworkById(market.networkId);
        return {
          payload: {
            ...market,
            currency: network.currency,
            outcomes: market.outcomes.map(outcome => ({
              ...outcome,
              price: Number(outcome.price.toFixed(3))
            }))
          }
        };
      }
    },
    clearMarket: state => ({
      ...state,
      market: initialState.market
    }),
    setChartViewType: (state, action: PayloadAction<string>) => ({
      ...state,
      chartViewType: action.payload
    }),
    changeOutcomeData: (state, action) => ({
      ...state,
      market: {
        ...state.market,
        outcomes: state.market.outcomes.map((outcome, index) =>
          index === action.payload.outcomeId
            ? { ...outcome, ...action.payload.data }
            : outcome
        )
      }
    }),
    changeQuestion: (state, action) => ({
      ...state,
      market: {
        ...state.market,
        question: action.payload
      }
    }),
    changeVotes: (state, action) => ({
      ...state,
      market: {
        ...state.market,
        votes: action.payload
      }
    }),
    changeData: (state, action) => ({
      ...state,
      market: {
        ...state.market,
        ...action.payload.data
      }
    }),
    priceChartsRequest: state => ({
      ...state,
      isLoadingPriceCharts: true,
      error: null
    }),
    priceChartsSuccess: (state, action: PayloadAction<Market>) => ({
      ...state,
      isLoadingPriceCharts: false,
      error: null,
      market: {
        ...state.market,
        outcomes: action.payload.outcomes
      }
    }),
    priceChartsError: (state, action) => ({
      ...state,
      isLoadingPriceCharts: false,
      error: action.payload
    })
  }
});

export default marketSlice.reducer;

const {
  request,
  success,
  error,
  marketSelected,
  clearMarket,
  changeOutcomeData,
  changeQuestion,
  changeVotes,
  changeData,
  setChartViewType,
  priceChartsRequest,
  priceChartsSuccess,
  priceChartsError
} = marketSlice.actions;

export {
  marketSelected,
  clearMarket,
  changeOutcomeData,
  changeQuestion,
  changeVotes,
  changeData,
  setChartViewType
};

export function getMarket(marketSlug: string) {
  return async dispatch => {
    dispatch(request());
    try {
      const response = await marketService.getMarket(marketSlug);
      const { data } = response;
      dispatch(success(data));
    } catch (err) {
      dispatch(error(err));
    }
  };
}

export function getMarketPriceCharts(marketSlug: string) {
  return async dispatch => {
    dispatch(priceChartsRequest());
    try {
      const response = await marketService.getMarket(marketSlug);
      const { data } = response;
      dispatch(priceChartsSuccess(data));
    } catch (err) {
      dispatch(priceChartsError(err));
    }
  };
}
