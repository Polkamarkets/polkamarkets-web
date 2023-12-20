import { useCallback, useMemo } from 'react';

import cn from 'classnames';
import { Market } from 'models/market';

import { CheckIcon } from 'assets/icons';

import FavoriteMarket from 'components/FavoriteMarket';
import Share from 'components/Share';

import { useAppSelector } from 'hooks';

import styles from './MarketFooterActions.module.scss';

type MarketFooterActionsProps = {
  market: Market;
  $variant: 'filled' | 'text';
};

export default function MarketFooterActions({
  market,
  $variant = 'text'
}: MarketFooterActionsProps) {
  const { origin } = window.location;

  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);

  const isPredictedOutcome = useCallback(
    (outcomeId: string | number) =>
      portfolio[market.id]?.outcomes[outcomeId]?.shares >= 0.0005,
    [market.id, portfolio]
  );

  const isMarketWithPrediction = useMemo(
    () => market.outcomes.some(outcome => isPredictedOutcome(outcome.id)),
    [isPredictedOutcome, market.outcomes]
  );

  return (
    <div className="pm-c-market-footer__actions">
      {isMarketWithPrediction ? (
        <span className={styles.predicted}>
          <CheckIcon className={styles.predictedIcon} /> Predicted
        </span>
      ) : null}
      <Share
        id={market.slug}
        className={cn('pm-c-market-footer__actions-button', {
          'pm-c-market-footer__actions-button-filled': $variant === 'filled'
        })}
        link={{
          title: market.title,
          url: `${origin}/markets/${market.slug}`
        }}
      />
      <FavoriteMarket
        market={market}
        className={cn({
          'pm-c-market-footer__actions-button-filled': $variant === 'filled'
        })}
      />
    </div>
  );
}
