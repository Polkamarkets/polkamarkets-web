import React, { useEffect, useState, useCallback, useMemo } from 'react';

import cn from 'classnames';
import { features, ui } from 'config';
import { isEmpty, isUndefined } from 'lodash';
import { setTokenTicker } from 'redux/ducks/market';
import {
  setTradeAmount,
  setMaxAmount,
  setWrapped,
  setTradeDetails
} from 'redux/ducks/trade';

import { TokenIcon, WalletIcon } from 'assets/icons';

import {
  useAppSelector,
  useAppDispatch,
  useNetwork,
  useERC20Balance,
  useFantasyTokenTicker
} from 'hooks';

import { Button } from '../Button';
import Icon from '../Icon';
import StepSlider from '../StepSlider';
import Text from '../Text';
import ToggleSwitch from '../ToggleSwitch';
import TradeFormClasses from './TradeForm.module.scss';
import { calculateTradeDetails } from './utils';

const SELL_STEPS = [10, 25, 50, 100];

function TradeFormInput() {
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const { currency } = network;

  const token = useAppSelector(state => state.market.market.token);
  const { name, ticker, iconName, address, wrapped: tokenWrapped } = token;

  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const type = useAppSelector(state => state.trade.type);
  const label = `Amount`;

  const selectedMarketId = useAppSelector(
    state => state.trade.selectedMarketId
  );

  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );

  const wrapped = useAppSelector(state => state.trade.wrapped);

  const isWrongNetwork =
    !ui.socialLogin.enabled && network.id !== `${marketNetworkId}`;

  const preventBankruptcy = features.fantasy.enabled && ui.socialLogin.enabled;

  // buy and sell have different maxes

  const [amount, setAmount] = useState<number | string | undefined>(0);
  const [stepAmount, setStepAmount] = useState<number>(0);

  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const market = useAppSelector(state => state.market.market);
  const outcome = market.outcomes[selectedOutcomeId];

  const { balance: erc20Balance, isLoadingBalance } = useERC20Balance(address);
  const { ethBalance, polkBalance } = useAppSelector(
    state => state.polkamarkets
  );

  const balance = wrapped || !tokenWrapped ? erc20Balance : ethBalance;

  const roundDown = (value: number) => Math.floor(value * 1e5) / 1e5;

  // TODO: improve this
  const max = useCallback(() => {
    let maxAmount = 0;

    // max for buy actions - eth balance
    if (type === 'buy') {
      maxAmount = fantasyTokenTicker ? polkBalance : balance;
    }
    // max for sell actions - number of outcome shares
    else if (type === 'sell') {
      maxAmount =
        portfolio[selectedMarketId]?.outcomes[selectedOutcomeId]?.shares || 0;
    }

    // rounding (down) to 5 decimals
    return roundDown(maxAmount);
  }, [
    type,
    fantasyTokenTicker,
    polkBalance,
    balance,
    portfolio,
    selectedMarketId,
    selectedOutcomeId
  ]);

  useEffect(() => {
    dispatch(setMaxAmount(max()));
  }, [dispatch, max, type]);

  useEffect(() => {
    dispatch(setTradeAmount(0));
    setAmount(0);
    setStepAmount(0);
  }, [dispatch, type, wrapped]);

  useEffect(() => {
    if (
      [type, market, outcome, amount].every(
        value =>
          !isUndefined(value) && (!isEmpty(value) || typeof value === 'number')
      )
    ) {
      const tradeDetails = calculateTradeDetails(type, market, outcome, amount);

      dispatch(setTradeDetails(tradeDetails));
    }
  }, [dispatch, type, market, outcome, amount]);

  function handleChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    const newAmount = value ? parseFloat(value) : undefined;

    setAmount(newAmount);
    dispatch(setTradeAmount(newAmount || 0));
    setStepAmount(100 * ((newAmount || 0) / max()));
  }

  const handleFocus = useCallback(() => {
    if (amount === 0) {
      setAmount('');
    }
  }, [amount]);

  function handleSetMaxAmount() {
    const newMax = max();

    setAmount(newMax);
    dispatch(setTradeAmount(newMax));
    setStepAmount(100);
  }

  function handleSetAmount(newAmount: number) {
    setAmount(newAmount);
    dispatch(setTradeAmount(newAmount));
  }

  function handleChangeSlider(value: number) {
    const percentage = value / 100;

    const newAmount = roundDown(max() * percentage);

    setAmount(newAmount);
    dispatch(setTradeAmount(newAmount));
    setStepAmount(value);
  }

  const handleChangeWrapped = useCallback(() => {
    dispatch(setWrapped(!wrapped));
    dispatch(
      setTokenTicker({
        ticker: !wrapped ? token.symbol : token.symbol.substring(1)
      })
    );
  }, [dispatch, token.symbol, wrapped]);

  const amountInputButtons = useMemo((): number[] => {
    switch (true) {
      case balance <= 1:
        return [];
      case balance > 1 && balance < 10:
        return [0.5, 1];
      case balance >= 10 && balance < 100:
        return [1, 5, 10];
      case balance >= 100 && balance < 200:
        return [5, 10, 25, 50];
      case balance >= 200 && balance < 500:
        return [10, 20, 50, 100];
      case balance >= 500:
        return [10, 50, 100, 200];
      default:
        return [];
    }
  }, [balance]);

  return (
    <form className="pm-c-amount-input">
      <div className="pm-c-amount-input__header">
        <label className="pm-c-amount-input__header-title" htmlFor={label}>
          {label}
        </label>
        {!isWrongNetwork ? (
          <div className="pm-c-amount-input__header-wallet">
            <figure aria-label="Wallet icon">
              <WalletIcon />
            </figure>
            <Button
              color="noborder"
              style={{ gap: '0.2rem' }}
              onClick={handleSetMaxAmount}
              disabled={isWrongNetwork || isLoadingBalance}
            >
              <Text as="strong" scale="tiny" fontWeight="semibold">
                {max()}
              </Text>
              <Text as="span" scale="tiny" fontWeight="semibold">
                {type === 'buy' ? ticker : ' Shares'}
              </Text>
            </Button>
          </div>
        ) : null}
      </div>
      <div className="pm-c-amount-input__group">
        <input
          className="pm-c-amount-input__input"
          type="number"
          id={label}
          value={amount}
          lang="en"
          step=".0001"
          min={0}
          max={max()}
          onChange={event => handleChangeAmount(event)}
          onFocus={() => handleFocus()}
          onWheel={event => event.currentTarget.blur()}
          disabled={isWrongNetwork || isLoadingBalance}
        />
        <div className="pm-c-amount-input__actions">
          {!preventBankruptcy ? (
            <button
              type="button"
              onClick={handleSetMaxAmount}
              disabled={isWrongNetwork || isLoadingBalance}
            >
              <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
                Max
              </Text>
            </button>
          ) : null}
          {type === 'buy' ? (
            <div className="pm-c-amount-input__logo">
              <figure aria-label={name}>
                {iconName === 'Token' ? (
                  <TokenIcon ticker={ticker} />
                ) : (
                  <Icon name={iconName} />
                )}
              </figure>
              <Text as="span" scale="caption" fontWeight="bold">
                {ticker}
              </Text>
            </div>
          ) : null}
          {type === 'sell' ? (
            <div className="pm-c-amount-input__logo">
              <Text as="span" scale="caption" fontWeight="bold">
                Shares
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      {!preventBankruptcy ? (
        <StepSlider
          currentValue={stepAmount}
          onChange={value => handleChangeSlider(value)}
          disabled={isWrongNetwork || isLoadingBalance}
        />
      ) : (
        <ul
          className={cn(
            'pm-c-amount-input__actions',
            TradeFormClasses.inputActions
          )}
        >
          {type === 'buy'
            ? amountInputButtons.map(button => (
                <button
                  key={button}
                  type="button"
                  onClick={() => handleSetAmount(button)}
                  disabled={isWrongNetwork || isLoadingBalance}
                >
                  <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
                    {`${button} ${ticker}`}
                  </Text>
                </button>
              ))
            : null}
          {type === 'sell'
            ? SELL_STEPS.map(step => (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    handleSetAmount(roundDown(max() * (step / 100)))
                  }
                  disabled={isWrongNetwork}
                >
                  <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
                    {`${step}%`}
                  </Text>
                </button>
              ))
            : null}
        </ul>
      )}
      {!isWrongNetwork && tokenWrapped ? (
        <div className={TradeFormClasses.wrappedToggle}>
          <Text
            as="span"
            scale="caption"
            fontWeight="bold"
            className={TradeFormClasses.wrappedToggleTitle}
          >
            {`Wrap ${currency.name}`}
          </Text>
          <ToggleSwitch
            checked={wrapped}
            onChange={handleChangeWrapped}
            disabled={isWrongNetwork || isLoadingBalance}
          />
        </div>
      ) : null}
    </form>
  );
}

TradeFormInput.displayName = 'TradeFormInput';

export default TradeFormInput;
