import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { changeOutcomeData, changeData } from 'redux/ducks/market';
import { changeMarketOutcomeData, changeMarketData } from 'redux/ducks/markets';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { selectOutcome } from 'redux/ducks/trade';
import { closeTradeForm } from 'redux/ducks/ui';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

import TWarningIcon from 'assets/icons/TWarningIcon';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Button } from '../Button';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Text from '../Text';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';

function TradeFormActions() {
  // Helpers
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { network, networkConfig } = useNetwork();
  const { show, close } = useToastNotification();

  // Market selectors
  const type = useAppSelector(state => state.trade.type);
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
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  // Derivated state
  const isMarketPage = location.pathname === `/markets/${marketSlug}`;
  const isWrongNetwork = network.id !== `${marketNetworkId}`;

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionSuccessHash, setTransactionSuccessHash] =
    useState(undefined);
  const [needsPricesRefresh, setNeedsPricesRefresh] = useState(false);

  function handleCancel() {
    dispatch(selectOutcome('', ''));
    dispatch(closeTradeForm());
  }

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
    await dispatch(login(networkConfig));
    await dispatch(fetchAditionalData(networkConfig));
  }

  async function handleBuy() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

    const polkamarketsService = new PolkamarketsService(networkConfig);

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

      // performing buy action on smart contract
      const response = await polkamarketsService.buy(
        marketId,
        predictionId,
        amount,
        minShares
      );

      setIsLoading(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setTransactionSuccess(status);
        setTransactionSuccessHash(transactionHash);
        show(type);
      }

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
    } catch (error) {
      setIsLoading(false);
    }

    return true;
  }

  async function handleSell() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

    const polkamarketsService = new PolkamarketsService(networkConfig);

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
      if (Math.abs(sharesToSell - minShares) / sharesToSell > 0.02) {
        setIsLoading(false);
        setNeedsPricesRefresh(true);

        return false;
      }

      // performing sell action on smart contract
      const response = await polkamarketsService.sell(
        marketId,
        predictionId,
        ethAmount,
        minShares
      );

      setIsLoading(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setTransactionSuccess(status);
        setTransactionSuccessHash(transactionHash);
        show(type);
      }

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
    } catch (error) {
      setIsLoading(false);
    }

    return true;
  }

  const isValidAmount = amount > 0 && amount <= maxAmount;
  // terms currently disabled
  const hasAcceptedTerms = true;

  return (
    <div className="pm-c-trade-form-actions__group--column">
      <div className="pm-c-trade-form-actions">
        {!isMarketPage ? (
          <Button
            variant="subtle"
            color="default"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        ) : null}
        {isWrongNetwork ? <NetworkSwitch /> : null}
        {needsPricesRefresh && !isWrongNetwork ? (
          <div className="pm-c-trade-form-actions__group--column">
            <Button
              color="default"
              fullwidth
              onClick={handlePricesRefresh}
              disabled={!isValidAmount || !hasAcceptedTerms || isLoading}
              loading={isLoading}
            >
              Refresh Prices
            </Button>
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
        {type === 'buy' && !needsPricesRefresh && !isWrongNetwork ? (
          <Button
            color="success"
            fullwidth
            onClick={handleBuy}
            disabled={!isValidAmount || !hasAcceptedTerms || isLoading}
            loading={isLoading}
          >
            Buy
          </Button>
        ) : null}
        {type === 'sell' && !needsPricesRefresh && !isWrongNetwork ? (
          <Button
            color="danger"
            fullwidth
            onClick={handleSell}
            disabled={!isValidAmount || !hasAcceptedTerms || isLoading}
            loading={isLoading}
          >
            Sell
          </Button>
        ) : null}
      </div>
      {transactionSuccess && transactionSuccessHash ? (
        <ToastNotification id={type} duration={10000}>
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <a
                target="_blank"
                href={`${network.explorerURL}/tx/${transactionSuccessHash}`}
                rel="noreferrer"
              >
                <Button size="sm" color="success">
                  View on Explorer
                </Button>
              </a>
              <Button size="sm" variant="ghost" onClick={() => close(type)}>
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
    </div>
  );
}

export default TradeFormActions;
