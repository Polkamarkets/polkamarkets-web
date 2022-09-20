import { Dispatch } from 'react';
import { useDispatch } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import polkamarketsApi from 'services/Polkamarkets';

import liquidity from './ducks/liquidity';
import market from './ducks/market';
import markets from './ducks/markets';
import polkamarkets from './ducks/polkamarkets';
import portfolio from './ducks/portfolio';
import trade from './ducks/trade';
import ui from './ducks/ui';

const store = configureStore({
  reducer: {
    trade,
    market,
    liquidity,
    markets,
    portfolio,
    polkamarkets,
    ui,
    [polkamarketsApi.reducerPath]: polkamarketsApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat([thunkMiddleware, polkamarketsApi.middleware]),
  devTools: true
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch | Dispatch<any>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
