import { createContext, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Market, Outcome } from 'models/market';
import { TradeType } from 'redux/ducks/trade';
import type { UserOperation } from 'types/user';
import { create } from 'zustand';

import { Operation, ToastNotification } from 'components';

import useToastNotification from 'hooks/useToastNotification';

export type TradeContextState = {
  type: TradeType;
  status: 'pending' | 'success' | 'error';
  trade: {
    market: Market['id'];
    marketTitle: Market['title'];
    outcome: Outcome['id'];
    outcomeTitle: Outcome['title'];
    amount: number;
    ticker: string;
    network: Market['networkId'];
    location: string;
  };
  set: (newState: Partial<TradeContextState>) => void;
  reset: () => void;
};

const initialState: TradeContextState = {
  type: 'buy',
  status: 'pending',
  trade: {
    market: '',
    marketTitle: '',
    outcome: '',
    outcomeTitle: '',
    amount: 0,
    ticker: '',
    network: '',
    location: ''
  },
  set: _newState => {},
  reset: () => {}
};

const useTradeStore = create<TradeContextState>(set => ({
  ...initialState,
  set: (newState: Partial<TradeContextState>) =>
    set(state => ({ ...state, ...newState })),
  reset: () =>
    set(state => ({ ...initialState, set: state.set, reset: state.reset }))
}));

export const TradeContext = createContext<TradeContextState>(
  {} as TradeContextState
);

function TradeProvider({ children }) {
  const history = useHistory();
  const state = useTradeStore();
  const { show, close } = useToastNotification();

  const { type, status, trade } = state;

  useEffect(() => {
    if (status === 'success') {
      show(`${type}-success`);
    }
  }, [status, type, show]);

  useEffect(() => {
    if (status === 'error') {
      if (window.location.pathname !== trade.location) {
        history.push(trade.location);
      }
    }
  }, [history, status, trade.location]);

  const handleDissmiss = useCallback(() => {
    close(`${type}-success`);
  }, [close, type]);

  return (
    <>
      {status === 'success' ? (
        <ToastNotification id={`${type}-success`} duration={7000}>
          <Operation
            view="toast"
            status="pending"
            action={type as UserOperation['action']}
            marketTitle={trade.marketTitle}
            outcomeTitle={trade.outcomeTitle}
            value={trade.amount}
            ticker={trade.ticker}
            showViewAll
            dismissable
            onDismiss={handleDissmiss}
            style={{ width: 297 }}
            trade={state}
          />
        </ToastNotification>
      ) : null}
      <TradeContext.Provider
        value={{
          ...state
        }}
      >
        {children}
      </TradeContext.Provider>
    </>
  );
}

export { TradeProvider };
