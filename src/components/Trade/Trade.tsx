import { CSSProperties, useCallback, useMemo } from 'react';

import cn from 'classnames';
import { features } from 'config';
import getMarketColors from 'helpers/getMarketColors';
import type { Outcome } from 'models/market';
import { changeTradeType, selectOutcome } from 'redux/ducks/trade';
import { useTheme } from 'ui';

import { useAppDispatch, useAppSelector, useLanguage } from 'hooks';

import { AlertMini } from '../Alert';
import Breadcrumb from '../Breadcrumb';
import { Button } from '../Button';
import TradeFormClosed from '../TradeForm/TradeFormClosed';
import TradeFormInput from '../TradeForm/TradeFormInput';
import { views } from './Trade.config';
import styles from './Trade.module.scss';
import type { View } from './Trade.types';
import TradeActions from './TradeActions';
import TradeDetails from './TradeDetails';
import TradePredictions from './TradePredictions';

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

  const marketColors = getMarketColors({
    network: market.network.id,
    market: market.id
  });

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

    return sharesByOutcome.filter(outcome => outcome.shares > 1e-5);
  }, [isLoadingPortfolio, portfolio, marketId, market.outcomes]);

  const hasSharesOfOtherOutcomes = useMemo(
    () =>
      !!outcomesWithShares.find(
        outcome => outcome.id !== predictionId.toString()
      ),
    [outcomesWithShares, predictionId]
  );

  const filterByHaveShares = useCallback(
    (outcome: Outcome) => {
      const haveShares = outcomesWithShares.find(
        outcomeWithShares => outcomeWithShares.id === outcome.id.toString()
      );

      return !!haveShares;
    },
    [outcomesWithShares]
  );

  const prediction = useMemo(
    () =>
      market.outcomes.find(
        outcome => outcome.id.toString() === predictionId.toString()
      ),
    [market.outcomes, predictionId]
  );

  const handleSellShares = useCallback(
    (outcomeId: string) => {
      if (type !== 'sell') {
        dispatch(changeTradeType('sell'));
      }

      dispatch(selectOutcome(marketId, marketNetworkId, outcomeId));
    },
    [dispatch, marketId, marketNetworkId, type]
  );

  if (isLoadingMarket) return null;

  if (market.state !== 'open')
    return (
      <div className={cn({ [styles.closed]: view === 'modal' })}>
        <TradeFormClosed />
      </div>
    );

  return (
    <div
      className={cn(styles.root, {
        [styles.rootDefault]: view === 'default',
        [styles.rootModal]: view === 'modal'
      })}
      style={
        {
          maxWidth: theme.device.isDesktop ? '540px' : 'unset',
          '--image': `url('${market.imageUrl}')`,
          '--backdrop-color': marketColors.market
        } as CSSProperties
      }
    >
      {view === 'default' && theme.device.isDesktop ? (
        <p className={styles.rootDefaultTitle}>Make your prediction</p>
      ) : null}
      <div className={styles.rootView}>
        {config.market.details ? (
          <div className={styles.market}>
            <Breadcrumb>
              <Breadcrumb.Item>{market.category}</Breadcrumb.Item>
              <Breadcrumb.Item>{market.subcategory}</Breadcrumb.Item>
            </Breadcrumb>
            <p className={styles.marketTitle}>{market.title}</p>
          </div>
        ) : null}
        <TradePredictions
          view={view}
          filterBy={hasSharesOfOtherOutcomes ? filterByHaveShares : undefined}
        />
      </div>
      {features.fantasy.enabled && (isLoadingLogin || isLoadingPortfolio) ? (
        <div className="flex-row justify-center align-center padding-y-10 padding-x-6 border-solid border-1 border-radius-medium">
          <span className="spinner--primary" />
        </div>
      ) : (
        <div className={styles.rootActions}>
          {features.fantasy.enabled &&
          hasSharesOfOtherOutcomes &&
          prediction ? (
            <div className="flex-column gap-5 width-full">
              <AlertMini
                variant="warning"
                description={
                  language === 'pt'
                    ? `Só podes escolher um resultado de cada vez. Para mudar a tua previsão para "${prediction.title}", tens que vender a tua previsão "${outcomesWithShares[0].title}".`
                    : `You can only buy shares of one outcome at a time. In order to buy shares of "${prediction.title}" you need to sell your position of "${outcomesWithShares[0].title}".`
                }
                descriptionClasses="notranslate"
              />
              <Button
                color="danger"
                fullwidth
                onClick={() => handleSellShares(outcomesWithShares[0].id)}
              >
                Sell
              </Button>
            </div>
          ) : (
            <>
              <TradeFormInput />
              <TradeDetails />
              <div className={styles.actionsGroup}>
                <TradeActions onTradeFinished={onTradeFinished} />
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Trade;
