import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { features, ui } from 'config';
import { changeOutcomeData, changeData } from 'redux/ducks/market';
import { changeMarketOutcomeData, changeMarketData } from 'redux/ducks/markets';
import {
  login,
  fetchAditionalData,
  changePolkBalance,
  changeActions,
  changePortfolio
} from 'redux/ducks/polkamarkets';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

import TWarningIcon from 'assets/icons/TWarningIcon';

import { AlertMinimal } from 'components/Alert';
import ProfileSignin from 'components/ProfileSignin';

import {
  useAppDispatch,
  useAppSelector,
  useERC20Balance,
  useFantasyTokenTicker,
  useNetwork,
  usePolkamarketsService,
  useTrade
} from 'hooks';

import ApproveToken from '../ApproveToken';
import { ButtonLoading } from '../Button';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Text from '../Text';

type TradeActionsProps = {
  onTradeFinished: () => void;
};

function TradeActions({ onTradeFinished }: TradeActionsProps) {
  // Helpers
  const dispatch = useAppDispatch();
  const { network, networkConfig } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const { status, trade, set: setTrade, reset: resetTrade } = useTrade();

  // Market selectors
  const type = useAppSelector(state => state.trade.type);
  const { isLoggedIn, ethAddress, polkBalance, actions, portfolio } =
    useAppSelector(state => state.polkamarkets);

  const wrapped = useAppSelector(state => state.trade.wrapped);
  const marketId = useAppSelector(state => state.trade.selectedMarketId);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const predictionId = useAppSelector(state => state.trade.selectedOutcomeId);
  const { amount, shares, totalStake, fee } = useAppSelector(
    state => state.trade
  );
  const maxAmount = useAppSelector(state => state.trade.maxAmount);
  const token = useAppSelector(state => state.market.market.token);
  const { wrapped: tokenWrapped, address } = token;

  const polkClaimed = useAppSelector(state => state.polkamarkets.polkClaimed);
  const isLoadingPolk = useAppSelector(
    state => state.polkamarkets.isLoading.polk
  );

  // Derivated state
  const isWrongNetwork =
    !ui.socialLogin.enabled && network.id !== `${marketNetworkId}`;

  // Local state
  const [isLoading, setIsLoading] = useState(false);

  const [needsPricesRefresh, setNeedsPricesRefresh] = useState(false);
  const { refreshBalance } = useERC20Balance(address);

  async function reloadMarketPrices() {
    const marketData = await new PolkamarketsService(
      networkConfig
    ).getMarketData(marketId);

    marketData.outcomes.forEach((outcomeData, outcomeId) => {
      const data = { price: outcomeData.price, shares: outcomeData.shares };

      // updating both market/markets redux
      dispatch(changeMarketOutcomeData({ marketId, outcomeId, data }));
      dispatch(changeOutcomeData({ outcomeId, data }));
      dispatch(
        changeMarketData({
          marketId,
          data: { liquidity: marketData.liquidity }
        })
      );
      dispatch(changeData({ data: { liquidity: marketData.liquidity } }));
    });
  }

  useEffect(() => {
    setNeedsPricesRefresh(false);
  }, [type]);

  async function handlePricesRefresh() {
    setIsLoading(true);
    await reloadMarketPrices();
    setIsLoading(false);
    setNeedsPricesRefresh(false);
  }

  async function updateWallet() {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }

  async function handleClaim() {
    const { claim } = await import('redux/ducks/polkamarkets');

    dispatch(claim(polkamarketsService));
  }

  async function handleBuy() {
    setTrade({
      type: 'buy',
      status: 'pending',
      trade: {
        market: marketId,
        outcome: predictionId,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    try {
      // adding a 1% slippage due to js floating numbers rounding
      const minShares = shares * 0.999;

      // calculating shares amount from smart contract
      const sharesToBuy = await polkamarketsService.calcBuyAmount(
        marketId,
        predictionId,
        amount
      );

      // will refresh form if there's a slippage > 1%
      if (Math.abs(sharesToBuy - minShares) / sharesToBuy > 0.01) {
        setIsLoading(false);
        setNeedsPricesRefresh(true);

        return false;
      }

      setTimeout(() => {
        if (!needsPricesRefresh) {
          // Dispatch data to Redux
          const newPolkBalance = polkBalance - amount;
          dispatch(changePolkBalance(newPolkBalance));

          const newActions = actions.concat({
            action: 'Buy',
            marketId: parseInt(marketId, 10),
            outcomeId: parseInt(predictionId, 10),
            shares: sharesToBuy,
            timestamp: Date.now() / 1000,
            transactionHash:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            value: amount
          });
          dispatch(changeActions(newActions));

          const newPortfolio = JSON.parse(JSON.stringify(portfolio));
          if (portfolio[marketId]?.outcomes[predictionId]) {
            newPortfolio[marketId].outcomes[predictionId].shares += sharesToBuy;
            newPortfolio[marketId].outcomes[predictionId].price =
              sharesToBuy / amount;
          } else {
            newPortfolio[marketId] = {
              outcomes: {
                [predictionId]: {
                  shares: sharesToBuy,
                  price: sharesToBuy / amount
                }
              }
            };
          }
          dispatch(changePortfolio(newPortfolio));

          setIsLoading(false);
          onTradeFinished();
          setTrade({ status: 'success' });
        }
      }, 200);

      // performing buy action on smart contract
      await polkamarketsService.buy(
        marketId,
        predictionId,
        amount,
        minShares,
        tokenWrapped && !wrapped
      );

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
      resetTrade();
    } catch (error) {
      setTrade({ status: 'error' });
      Sentry.captureException(error);

      // restoring wallet data on error too
      await updateWallet();
      await refreshBalance();
    }

    return true;
  }

  async function handleSell() {
    setTrade({
      type: 'sell',
      status: 'pending',
      trade: {
        market: marketId,
        outcome: predictionId,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    try {
      // adding a 1% slippage due to js floating numbers rounding
      const ethAmount = totalStake - fee;
      const minShares = shares * 1.001;

      // calculating shares amount from smart contract
      const sharesToSell = await polkamarketsService.calcSellAmount(
        marketId,
        predictionId,
        ethAmount
      );

      // will refresh form if there's a slippage > 2%
      if (Math.abs(sharesToSell - minShares) / sharesToSell > 0.01) {
        setIsLoading(false);
        setNeedsPricesRefresh(true);

        return false;
      }

      setTimeout(() => {
        if (!needsPricesRefresh) {
          // Dispatch data to Redux
          const newPolkBalance = polkBalance + ethAmount;
          dispatch(changePolkBalance(newPolkBalance));

          const newActions = actions.concat({
            action: 'Sell',
            marketId: parseInt(marketId, 10),
            outcomeId: parseInt(predictionId, 10),
            shares: sharesToSell,
            timestamp: Date.now() / 1000,
            transactionHash:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            value: ethAmount
          });
          dispatch(changeActions(newActions));

          if (portfolio[marketId]?.outcomes[predictionId]) {
            const newPortfolio = JSON.parse(JSON.stringify(portfolio));
            newPortfolio[marketId].outcomes[predictionId].shares -=
              sharesToSell;
            newPortfolio[marketId].outcomes[predictionId].price =
              sharesToSell / ethAmount;
            dispatch(changePortfolio(newPortfolio));
          }

          setIsLoading(false);
          onTradeFinished();
          setTrade({ status: 'success' });
        }
      }, 200);

      // performing sell action on smart contract
      await polkamarketsService.sell(
        marketId,
        predictionId,
        ethAmount,
        minShares,
        tokenWrapped && !wrapped
      );

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
      resetTrade();
    } catch (error) {
      setTrade({ status: 'error' });
      Sentry.captureException(error);

      // restoring wallet data on error too
      await updateWallet();
      await refreshBalance();
    }

    return true;
  }

  async function handleLoginToPredict() {
    try {
      const persistIds = {
        market: marketId,
        network: marketNetworkId,
        outcome: predictionId
      };

      localStorage.setItem('SELECTED_OUTCOME', JSON.stringify(persistIds));
    } catch (error) {
      // unsupported
    }
  }

  const isValidAmount = amount > 0 && amount <= maxAmount;

  const preventBankruptcy = features.fantasy.enabled && ui.socialLogin.enabled;

  return (
    <div className="pm-c-trade-form-actions__group--column">
      <div className="pm-c-trade-form-actions">
        {isWrongNetwork ? <NetworkSwitch /> : null}
        {needsPricesRefresh && !isWrongNetwork ? (
          <div className="pm-c-trade-form-actions__group--column">
            <ButtonLoading
              color="default"
              fullwidth
              onClick={handlePricesRefresh}
              disabled={!isValidAmount || isLoading}
              loading={isLoading}
            >
              Refresh Prices
            </ButtonLoading>
            <Text
              as="small"
              scale="caption"
              fontWeight="semibold"
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              color="gray"
            >
              <TWarningIcon
                style={{
                  height: '1.6rem',
                  width: '1.6rem',
                  marginRight: '0.5rem'
                }}
              />
              Price has updated
            </Text>
          </div>
        ) : null}
        <div className="flex-column gap-4 width-full">
          {status === 'error' ? (
            <AlertMinimal
              variant="danger"
              description="Sorry, we failed to record your prediction. Please try again."
            />
          ) : null}
          {status === 'success' && trade.market === marketId ? (
            <AlertMinimal
              variant="information"
              description="We're recording your previous prediction. Hang on..."
            />
          ) : null}
          {type === 'buy' && !needsPricesRefresh && !isWrongNetwork ? (
            <div className="flex-column gap-6 width-full">
              {isValidAmount &&
              preventBankruptcy &&
              amount >= polkBalance / 2 ? (
                <AlertMinimal
                  variant="warning"
                  description={`Do you really want to place all this ${fantasyTokenTicker} in this prediction? Distribute your ${fantasyTokenTicker} by other questions in order to minimize bankruptcy risk.`}
                />
              ) : null}
              {isLoggedIn && !polkClaimed ? (
                <ButtonLoading
                  color="primary"
                  fullwidth
                  onClick={handleClaim}
                  loading={isLoadingPolk}
                >
                  Claim {fantasyTokenTicker}
                </ButtonLoading>
              ) : null}
              {!features.fantasy.enabled || (isLoggedIn && polkClaimed) ? (
                <ApproveToken
                  fullwidth
                  address={token.address}
                  ticker={token.ticker}
                  wrapped={token.wrapped && !wrapped}
                >
                  <ButtonLoading
                    color="primary"
                    fullwidth
                    onClick={handleBuy}
                    disabled={
                      !isValidAmount ||
                      isLoading ||
                      (status === 'success' && trade.market === marketId)
                    }
                    loading={isLoading}
                  >
                    Predict
                  </ButtonLoading>
                </ApproveToken>
              ) : null}
              {!isLoggedIn && features.fantasy.enabled ? (
                <ProfileSignin
                  fullwidth
                  size="normal"
                  color="primary"
                  onClick={handleLoginToPredict}
                >
                  Sign in to Predict
                </ProfileSignin>
              ) : null}
            </div>
          ) : null}
          {type === 'sell' && !needsPricesRefresh && !isWrongNetwork ? (
            <ButtonLoading
              color="danger"
              fullwidth
              onClick={handleSell}
              disabled={
                !isValidAmount ||
                isLoading ||
                (status === 'success' && trade.market === marketId)
              }
              loading={isLoading}
            >
              Sell
            </ButtonLoading>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TradeActions;
