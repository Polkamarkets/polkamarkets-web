import { useEffect, useState } from 'react';

import { ui } from 'config';
import { changeOutcomeData, changeData } from 'redux/ducks/market';
import { changeMarketOutcomeData, changeMarketData } from 'redux/ducks/markets';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

import TWarningIcon from 'assets/icons/TWarningIcon';

import {
  useAppDispatch,
  useAppSelector,
  useERC20Balance,
  useNetwork,
  usePolkamarketsService
} from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import ApproveToken from '../ApproveToken';
import { Button, ButtonLoading } from '../Button';
import Feature from '../Feature';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Text from '../Text';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';

type TradeActionsProps = {
  onTradeFinished: () => void;
};

function TradeActions({ onTradeFinished }: TradeActionsProps) {
  // Helpers
  const dispatch = useAppDispatch();
  const { network, networkConfig } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const { show, close } = useToastNotification();

  // Market selectors
  const type = useAppSelector(state => state.trade.type);
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
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);
  const token = useAppSelector(state => state.market.market.token);
  const { wrapped: tokenWrapped, address } = token;

  // Derivated state
  const isWrongNetwork =
    !ui.socialLogin.enabled && network.id !== `${marketNetworkId}`;

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionSuccessHash, setTransactionSuccessHash] =
    useState(undefined);
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

  async function handleBuy() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

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
        minShares,
        tokenWrapped && !wrapped
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
      await refreshBalance();
      setTimeout(() => onTradeFinished(), 1000);
    } catch (error) {
      setIsLoading(false);
    }

    return true;
  }

  async function handleSell() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

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
        minShares,
        tokenWrapped && !wrapped
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
      await refreshBalance();
      setTimeout(() => onTradeFinished(), 1000);
    } catch (error) {
      setIsLoading(false);
    }

    return true;
  }

  const isValidAmount = amount > 0 && amount <= maxAmount;

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
        {type === 'buy' && !needsPricesRefresh && !isWrongNetwork ? (
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
              disabled={!isValidAmount || isLoading}
              loading={isLoading}
            >
              Predict
            </ButtonLoading>
          </ApproveToken>
        ) : null}
        {type === 'sell' && !needsPricesRefresh && !isWrongNetwork ? (
          <ButtonLoading
            color="danger"
            fullwidth
            onClick={handleSell}
            disabled={!isValidAmount || isLoading}
            loading={isLoading}
          >
            Sell
          </ButtonLoading>
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
              <Feature name="regular">
                <a
                  target="_blank"
                  href={`${network.explorerURL}/tx/${transactionSuccessHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
              </Feature>
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

export default TradeActions;
