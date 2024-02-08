import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { features, ui } from 'config';
import {
  login,
  fetchAditionalData,
  changePolkBalance,
  changeActions,
  changePortfolio
} from 'redux/ducks/polkamarkets';
import { PolkamarketsApiService } from 'services';

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
  useTrade,
  useUserOperations
} from 'hooks';
import useReloadMarketPrices from 'hooks/useReloadMarketPrices';

import ApproveToken from '../ApproveToken';
import { ButtonLoading } from '../Button';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Text from '../Text';
import { calculateEthAmountSold } from '../TradeForm/utils';

type TradeActionsProps = {
  onTradeFinished: () => void;
};

function TradeActions({ onTradeFinished }: TradeActionsProps) {
  // Helpers
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const { status, set: setTrade } = useTrade();

  // Market selectors
  const type = useAppSelector(state => state.trade.type);
  const { isLoggedIn, ethAddress, polkBalance, actions, portfolio } =
    useAppSelector(state => state.polkamarkets);

  const wrapped = useAppSelector(state => state.trade.wrapped);
  const marketId = useAppSelector(state => state.trade.selectedMarketId);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );
  const market = useAppSelector(state => state.market.market);
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const marketTitle = useAppSelector(state => state.market.market.title);
  const predictionId = useAppSelector(state => state.trade.selectedOutcomeId);
  const predictionTitle = useAppSelector(
    state => state.market.market.outcomes[predictionId]?.title
  );
  const { amount, shares, totalStake, fee } = useAppSelector(
    state => state.trade
  );
  const maxAmount = useAppSelector(state => state.trade.maxAmount);
  const token = useAppSelector(state => state.market.market.token);
  const { wrapped: tokenWrapped, address, ticker } = token;

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

  const userOperations = useUserOperations();

  const reloadMarketPrices = useReloadMarketPrices({ id: marketId });

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
        marketTitle,
        outcome: predictionId,
        outcomeTitle: predictionTitle,
        amount,
        ticker: fantasyTokenTicker || ticker,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    // random unique txid added to userOperations, while tx is processing
    const fakeTxHash = `
      0x000000000000000000000000000000000000000000000000000000000000${(
        Math.random() *
        0xfffff *
        1000000
      )
        .toString(16)
        .slice(0, 4)}
      `;

    try {
      // adding slippage due to js floating numbers rounding
      const minShares = shares * (1 - ui.market.slippage);

      // calculating shares amount from smart contract
      const sharesToBuy = await polkamarketsService.calcBuyAmount(
        marketId,
        predictionId,
        amount
      );

      // disabling refresh prices form temporarily
      // will refresh form if > slippage
      // if (Math.abs(sharesToBuy - minShares) / sharesToBuy > 0.1) {
      //   setIsLoading(false);
      //   setNeedsPricesRefresh(true);

      //   return false;
      // }

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
            transactionHash: fakeTxHash,
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

          userOperations.addOperation({
            action: 'buy',
            marketId: parseInt(marketId, 10),
            outcomeId: parseInt(predictionId, 10),
            shares: sharesToBuy,
            timestamp: Date.now() / 1000,
            transactionHash: '',
            userOperationHash: fakeTxHash,
            value: amount,
            marketTitle,
            outcomeTitle: predictionTitle,
            marketSlug,
            ticker,
            networkId: parseInt(network.id, 10),
            status: 'pending',
            user: ethAddress,
            imageUrl: ''
          });

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

      userOperations.updateOperationStatus({
        userOperationHash: fakeTxHash,
        status: 'success'
      });

      setTrade({ status: 'completed' });

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
    } catch (error) {
      setTrade({ status: 'error' });
      // TODO: improve this
      const extraData = (error as any)?.data as any;
      Sentry.captureException(error, { extra: extraData });

      userOperations.updateOperationStatus({
        userOperationHash: fakeTxHash,
        status: 'failed'
      });

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
        marketTitle,
        outcome: predictionId,
        outcomeTitle: predictionTitle,
        amount,
        ticker: fantasyTokenTicker || ticker,
        network: marketNetworkId,
        location: window.location.pathname
      }
    });
    setIsLoading(true);
    setNeedsPricesRefresh(false);

    // random unique txid added to userOperations, while tx is processing
    const fakeTxHash = `
      0x000000000000000000000000000000000000000000000000000000000000${(
        Math.random() *
        0xfffff *
        1000000
      )
        .toString(16)
        .slice(0, 4)}
      `;

    try {
      // adding a slippage due to js floating numbers rounding
      let ethAmount = totalStake - fee;
      const maxShares = shares * (1 + ui.market.slippage);

      // calculating shares amount from smart contract
      const sharesToSell = await polkamarketsService.calcSellAmount(
        marketId,
        predictionId,
        ethAmount
      );

      // lowering ethAmount if it exceeds the amount on users portfolio
      if (sharesToSell > portfolio[marketId]?.outcomes[predictionId].shares) {
        // TODO: improve this: re-fetching market prices
        const marketData = await polkamarketsService.getMarketData(marketId);
        // creating market copy
        const newMarket = JSON.parse(JSON.stringify(market));
        marketData.outcomes.forEach((outcomeData, outcomeId) => {
          newMarket.outcomes[outcomeId].shares = outcomeData.shares;
        });

        // lowering the amount sent to tx
        const maxTradeDetails = calculateEthAmountSold(
          newMarket,
          newMarket.outcomes[predictionId],
          portfolio[marketId]?.outcomes[predictionId].shares
        );
        ethAmount = maxTradeDetails.totalStake;
      }

      // disabling refresh prices form temporarily
      // will refresh form if there's a slippage > 2%
      // if (Math.abs(sharesToSell - maxShares) / sharesToSell > 0.01) {
      //   setIsLoading(false);
      //   setNeedsPricesRefresh(true);

      //   return false;
      // }

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
            transactionHash: fakeTxHash,
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

          userOperations.addOperation({
            action: 'sell',
            marketId: parseInt(marketId, 10),
            outcomeId: parseInt(predictionId, 10),
            shares: sharesToSell,
            timestamp: Date.now() / 1000,
            transactionHash: '',
            userOperationHash: fakeTxHash,
            value: amount,
            marketTitle,
            outcomeTitle: predictionTitle,
            marketSlug,
            ticker,
            networkId: parseInt(network.id, 10),
            status: 'pending',
            user: ethAddress,
            imageUrl: ''
          });

          setIsLoading(false);
          onTradeFinished();
          setTrade({ status: 'success' });
        }
      }, 200);

      // TODO: improve this
      // performing 3 tries while lowering ethAmount value
      const maxTries = 3;
      for (let i = 0; i < maxTries; i += 1) {
        try {
          // performing sell action on smart contract
          // eslint-disable-next-line no-await-in-loop
          await polkamarketsService.sell(
            marketId,
            predictionId,
            ethAmount,
            maxShares,
            tokenWrapped && !wrapped
          );

          break;
        } catch (error) {
          // lowering the amount sent to tx
          ethAmount *= 0.99;
          if (i === maxTries - 1) throw error;
        }
      }

      userOperations.updateOperationStatus({
        userOperationHash: fakeTxHash,
        status: 'success'
      });

      setTrade({ status: 'completed' });

      // triggering market prices redux update
      reloadMarketPrices();

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
    } catch (error) {
      setTrade({ status: 'error' });
      // TODO: improve this
      const extraData = (error as any)?.data as any;
      Sentry.captureException(error, { extra: extraData });

      userOperations.updateOperationStatus({
        userOperationHash: fakeTxHash,
        status: 'failed'
      });

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
          {status === 'retry' ? (
            <AlertMinimal
              variant="danger"
              description="Sorry, we failed to record your prediction. Please try again."
            />
          ) : null}
          {status === 'success' ? (
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
                      !isValidAmount || isLoading || status === 'success'
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
              disabled={!isValidAmount || isLoading || status === 'success'}
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
