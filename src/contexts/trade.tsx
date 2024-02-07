import { createContext, useCallback, useEffect } from 'react';

import { Market, Outcome } from 'models/market';
import { TradeType } from 'redux/ducks/trade';
import type { UserOperation } from 'types/user';
import { create } from 'zustand';

import { Button, Operation, Toast, ToastNotification } from 'components';

import { useDrawer } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

export type TradeContextState = {
  type: TradeType;
  status: 'pending' | 'success' | 'error' | 'completed' | 'retry';
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
  const state = useTradeStore();
  const { show, close } = useToastNotification();
  const { open } = useDrawer();

  const { type, status, trade } = state;

  useEffect(() => {
    if (status === 'success') {
      show(`${type}-success`);
    }
  }, [status, type, show]);

  useEffect(() => {
    if (status === 'completed') {
      show(`${type}-completed`);
    }
  }, [status, type, show]);

  useEffect(() => {
    if (status === 'error') {
      show(`${type}-error`);
    }
  }, [status, type, show]);

  const handleDismissSuccess = useCallback(() => {
    close(`${type}-success`);
  }, [close, type]);

  const handleDismissCompleted = useCallback(() => {
    close(`${type}-completed`);
  }, [close, type]);

  const handleDismissError = useCallback(() => {
    close(`${type}-error`);
  }, [close, type]);

  const handleViewAll = useCallback(
    (dismissCallback?: () => void) => {
      open();
      dismissCallback?.();
    },
    [open]
  );

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
            onDismiss={handleDismissSuccess}
            style={{ width: 297 }}
            trade={state}
          />
        </ToastNotification>
      ) : null}
      {status === 'completed' ? (
        <ToastNotification id={`${type}-completed`} duration={7000}>
          <Toast
            variant="success"
            title="Success"
            description="Transaction completed!"
          >
            <Toast.Actions>
              {/* <Button
                size="sm"
                color="success"
                onClick={() => handleViewAll(handleDismissCompleted)}
              >
                View transactions
              </Button> */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismissCompleted}
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
      {status === 'error' ? (
        <ToastNotification id={`${type}-error`} duration={7000}>
          <Toast
            variant="danger"
            title="Error"
            description="Could not complete your transaction!"
          >
            <Toast.Actions>
              <Button
                size="sm"
                color="danger"
                onClick={() => handleViewAll(handleDismissError)}
              >
                View transactions
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismissError}>
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
