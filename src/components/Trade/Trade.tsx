import { CSSProperties, useCallback, useEffect, useMemo } from 'react';

import cn from 'classnames';
import { features } from 'config';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { changeTradeType, selectOutcome } from 'redux/ducks/trade';
import { useTheme } from 'ui';

import { InfoIcon } from 'assets/icons';

import { useAppDispatch, useAppSelector, useLanguage } from 'hooks';

import { Button } from '../Button';
import TradeFormClosed from '../TradeForm/TradeFormClosed';
import TradeFormInput from '../TradeForm/TradeFormInput';
import { views } from './Trade.config';
import styles from './Trade.module.scss';
import type { View } from './Trade.types';
import TradeActions from './TradeActions';
import TradeDetails from './TradeDetails';
import TradeMarketShares from './TradeMarketShares';
import TradePredictions from './TradePredictions';
import TradeTypeSelector from './TradeTypeSelector';

type TradeProps = {
  view?: View;
  onTradeFinished: () => void;
};

function Trade({ view = 'default', onTradeFinished }: TradeProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const language = useLanguage();
  const market = useAppSelector(state => state.market.market);
  const isLoadingMarket = useAppSelector(state => state.market.isLoading);

  const type = useAppSelector(state => state.trade.type);
  const predictionId = useAppSelector(state => state.trade.selectedOutcomeId);
  const marketId = useAppSelector(state => state.trade.selectedMarketId);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const { login: isLoadingLogin, portfolio: isLoadingPortfolio } =
    useAppSelector(state => state.polkamarkets.isLoading);

  const config = views[view];

  const outcomesWithShares = useMemo(() => {
    if (isLoadingPortfolio) return [];

    const marketShares = portfolio[marketId];

    if (!marketShares) return [];

    const sharesByOutcome = market.outcomes.map(outcome => {
      const outcomeShares = marketShares.outcomes[outcome.id];

      return {
        id: outcome.id.toString(),
        title: outcome.title,
        shares: outcomeShares ? outcomeShares.shares : 0
      };
    });

    return sharesByOutcome.filter(outcome => outcome.shares > 1e0);
  }, [isLoadingPortfolio, portfolio, marketId, market.outcomes]);

  const hasSharesOfOtherOutcomes = useMemo(
    () =>
      !!outcomesWithShares.find(
        outcome => outcome.id !== predictionId.toString()
      ),
    [outcomesWithShares, predictionId]
  );

  const prediction = useMemo(
    () =>
      market.outcomes.find(
        outcome => outcome.id.toString() === predictionId.toString()
      ),
    [market.outcomes, predictionId]
  );

  const selectedPredictionHaveShares = useMemo(() => {
    if (isLoadingPortfolio) return false;

    const marketShares = portfolio[marketId];

    if (!marketShares) return false;

    const outcomeShares = marketShares.outcomes[predictionId];

    return outcomeShares ? outcomeShares.shares > 1e0 : false;
  }, [isLoadingPortfolio, marketId, portfolio, predictionId]);

  const handleSellShares = useCallback(
    (outcomeId: string) => {
      if (type !== 'sell') {
        dispatch(changeTradeType('sell'));
      }

      dispatch(selectOutcome(marketId, marketNetworkId, outcomeId));
    },
    [dispatch, marketId, marketNetworkId, type]
  );

  useEffect(() => {
    if (hasSharesOfOtherOutcomes && type === 'sell') {
      dispatch(changeTradeType('buy'));
    }
  }, [dispatch, hasSharesOfOtherOutcomes, type]);

  if (isLoadingMarket) return null;

  if (market.state !== 'open')
    return (
      <div className={cn({ [styles.closed]: view === 'modal' })}>
        <TradeFormClosed />
      </div>
    );

  const needsSellSharesOfOtherOutcomes =
    type === 'buy' && !isUndefined(prediction) && hasSharesOfOtherOutcomes;

  return (
    <div
      className={cn(styles.root, {
        [styles.rootDefault]: view === 'default',
        [styles.rootModal]: view === 'modal'
      })}
      style={
        {
          maxWidth: theme.device.isDesktop ? '540px' : 'unset'
        } as CSSProperties
      }
    >
      {view === 'default' && theme.device.isDesktop ? (
        <p className={styles.rootDefaultTitle}>Make your prediction</p>
      ) : null}
      <div className={styles.rootView}>
        {config.market.details ? (
          <div className={styles.market}>
            <p className={styles.marketTitle}>{market.title}</p>
          </div>
        ) : null}
        <TradePredictions view={view} />
      </div>
      {features.fantasy.enabled && (isLoadingLogin || isLoadingPortfolio) ? (
        <div className="flex-row justify-center align-center padding-y-10 padding-x-6 border-solid border-1 border-radius-medium">
          <span className="spinner--primary" />
        </div>
      ) : (
        <div className={styles.rootActions}>
          {needsSellSharesOfOtherOutcomes ? (
            <div role="alert" className={styles.toast}>
              <div className={styles.toastHeader}>
                <InfoIcon />
                <p className={styles.toastHeaderTitle}>
                  {language === 'pt'
                    ? 'Só podes escolher um resultado de cada vez.'
                    : 'You can only buy shares of one outcome at a time.'}
                </p>
              </div>
              <p className={cn(styles.toastDescription, 'notranslate')}>
                {language === 'pt' ? (
                  <>
                    Para mudar a tua previsão para{' '}
                    <strong>{`"${prediction.title}"`}</strong>, tens que vender
                    a tua previsão{' '}
                    <strong>{`"${outcomesWithShares[0].title}"`}</strong>.
                  </>
                ) : (
                  <>
                    In order to buy shares of{' '}
                    <strong>{`"${prediction.title}"`}</strong> you need to sell
                    your position of{' '}
                    <strong>{`"${outcomesWithShares[0].title}"`}</strong>.
                  </>
                )}
              </p>
            </div>
          ) : null}
          {!isEmpty(outcomesWithShares) && !needsSellSharesOfOtherOutcomes ? (
            <TradeTypeSelector />
          ) : null}
          <TradeMarketShares />
          {!needsSellSharesOfOtherOutcomes ? (
            <TradeFormInput
              startAtMax={type === 'sell' && selectedPredictionHaveShares}
            />
          ) : null}
          <TradeDetails />
          <div className={styles.actionsGroup}>
            {needsSellSharesOfOtherOutcomes ? (
              <Button
                color="danger"
                fullwidth
                onClick={() => handleSellShares(outcomesWithShares[0].id)}
              >
                Sell and Continue
              </Button>
            ) : (
              <TradeActions onTradeFinished={onTradeFinished} />
            )}
            <p className={styles.terms}>
              By clicking you’re agreeing to our{' '}
              <a
                href="https://www.polkamarkets.com/legal/terms-conditions"
                target="_blank"
                rel="noreferrer"
              >
                Terms and Conditions
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trade;
