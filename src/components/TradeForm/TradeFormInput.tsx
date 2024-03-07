import React, { useEffect, useState, useCallback } from 'react';

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

import { WalletIcon } from 'assets/icons';

import InfoTooltip from 'components/InfoTooltip';

import {
  useAppSelector,
  useAppDispatch,
  useNetwork,
  useERC20Balance,
  useFantasyTokenTicker
} from 'hooks';

import { Button } from '../Button';
import StepSlider from '../StepSlider';
import Text from '../Text';
import ToggleSwitch from '../ToggleSwitch';
import TradeFormClasses from './TradeForm.module.scss';
import { calculateEthAmountSold, calculateTradeDetails } from './utils';

const SELL_STEPS = [10, 25, 50, 100];

type TradeFormInputProps = {
  startAtMax?: boolean;
};

function TradeFormInput({ startAtMax = false }: TradeFormInputProps) {
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const { currency } = network;

  const token = useAppSelector(state => state.market.market.token);
  const { ticker, address, wrapped: tokenWrapped } = token;

  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const type = useAppSelector(state => state.trade.type);
  const label =
    type === 'buy'
      ? `How much ${ticker} do you want to predict?`
      : `How much ${ticker} do you want to sell?`;

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
  const [amountInputButtons, setAmountInputButtons] = useState<number[]>([]);

  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const market = useAppSelector(state => state.market.market);
  const outcome = market.outcomes[selectedOutcomeId];

  const { balance: erc20Balance, isLoadingBalance } = useERC20Balance(address);
  const { ethBalance, polkBalance, polkClaimed } = useAppSelector(
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
      if (features.fantasy.enabled) {
        maxAmount = calculateEthAmountSold(
          market,
          outcome,
          portfolio[selectedMarketId]?.outcomes[selectedOutcomeId]?.shares || 0
        ).totalStake;
      } else {
        maxAmount =
          portfolio[selectedMarketId]?.outcomes[selectedOutcomeId]?.shares || 0;
      }
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
    selectedOutcomeId,
    market,
    outcome
  ]);

  const currentMax = max();

  useEffect(() => {
    dispatch(setMaxAmount(max()));
  }, [dispatch, max, type]);

  useEffect(() => {
    if (startAtMax) {
      dispatch(setTradeAmount(max()));
      setAmount(max());
      setStepAmount(100);
    } else {
      dispatch(setTradeAmount(0));
      setAmount(0);
      setStepAmount(0);
    }
  }, [dispatch, max, startAtMax, type, wrapped]);

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

  useEffect(() => {
    if (currentMax <= 1) {
      setAmountInputButtons([]);
    } else if (currentMax > 1 && currentMax < 10) {
      setAmountInputButtons([0.5, 1]);
    } else if (currentMax >= 10 && currentMax < 100) {
      setAmountInputButtons([1, 5, 10]);
    } else if (currentMax >= 100 && currentMax < 200) {
      setAmountInputButtons([5, 10, 25, 50]);
    } else if (currentMax >= 200 && currentMax < 500) {
      setAmountInputButtons([10, 20, 50, 100]);
    } else if (currentMax >= 500) {
      setAmountInputButtons([10, 50, 100, 200]);
    } else {
      setAmountInputButtons([]);
    }
  }, [balance, polkClaimed, polkBalance, currentMax]);

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

  const tooltips = {
    buy: `The more ${token.ticker} you use the more it will influence the outcome probability.`,
    sell: `To change your answer you'll need to sell your entire ${token.ticker} position.`
  };

  return (
    <form className="pm-c-amount-input">
      <div className="pm-c-amount-input__header">
        <label className="pm-c-amount-input__header-title" htmlFor={label}>
          {label}
          <InfoTooltip text={tooltips[type]} />
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
              {features.fantasy.enabled ? (
                <Text as="span" scale="tiny" fontWeight="semibold">
                  {' '}
                  {fantasyTokenTicker || ticker}
                </Text>
              ) : (
                <Text as="span" scale="tiny" fontWeight="semibold">
                  {' '}
                  {type === 'buy' ? ticker : 'Shares'}
                </Text>
              )}
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
              <Text as="span" scale="caption" fontWeight="bold">
                {ticker}
              </Text>
            </div>
          ) : null}
          {type === 'sell' ? (
            <div className="pm-c-amount-input__logo">
              <Text as="span" scale="caption" fontWeight="bold">
                {features.fantasy.enabled
                  ? fantasyTokenTicker || ticker
                  : 'Shares'}
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
                  className={cn('pm-c-amount-input__action', {
                    'pm-c-amount-input__action--active': button === amount
                  })}
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
                  className={cn('pm-c-amount-input__action', {
                    'pm-c-amount-input__action--active':
                      max() * (step / 100) === amount
                  })}
                  onClick={() =>
                    handleSetAmount(
                      step === 100 ? max() : roundDown(max() * (step / 100))
                    )
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
