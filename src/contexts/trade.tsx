import { createContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Market, Outcome } from 'models/market';
import { TradeType } from 'redux/ducks/trade';
import { create } from 'zustand';

import { Button, Toast, ToastNotification } from 'components';

import useToastNotification from 'hooks/useToastNotification';

export type TradeContextState = {
  type: TradeType;
  status: 'pending' | 'success' | 'error';
  trade: {
    market: Market['id'];
    outcome: Outcome['id'];
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
    outcome: '',
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

  return (
    <>
      {status === 'success' ? (
        <ToastNotification id={`${type}-success`} duration={5000}>
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => close(`${type}-success`)}
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
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
