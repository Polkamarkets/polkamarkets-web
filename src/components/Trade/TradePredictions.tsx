import { useCallback, useMemo, MouseEvent } from 'react';
import { Virtuoso } from 'react-virtuoso';

import cn from 'classnames';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import { Outcome } from 'models/market';
import { selectOutcome } from 'redux/ducks/trade';
import { Image } from 'ui';

import { CheckIcon, TrophyIcon } from 'assets/icons';

import { useAppDispatch, useAppSelector, useOperation } from 'hooks';

import styles from './Trade.module.scss';
import { View } from './Trade.types';
import TradePredictionsWithImages from './TradePredictionsWithImages';

type TradePredictionsProps = {
  view: View;
  size?: 'md' | 'lg';
  onPredictionSelected?: () => void;
};

function TradePredictions({
  view,
  size = 'md',
  onPredictionSelected
}: TradePredictionsProps) {
  const dispatch = useAppDispatch();

  const market = useAppSelector(state => state.market.market);
  const { id, outcomes, networkId } = market;

  const { selectedOutcomeId, selectedMarketId } = useAppSelector(
    state => state.trade
  );

  const { predictedOutcome } = useOperation(market);

  const getResolvedStatus = useCallback(
    (outcome: Outcome) => {
      if (market.voided) return 'voided';
      if (market.resolvedOutcomeId === outcome.id) return 'won';
      if (market.state === 'resolved') return 'lost';
      return undefined;
    },
    [market]
  );

  const getOutcomeStatus = useCallback(
    (outcome: Outcome) => {
      if (
        !predictedOutcome ||
        predictedOutcome.id.toString() !== outcome.id.toString()
      )
        return undefined;

      const resolved = getResolvedStatus(outcome);
      return resolved === 'won' || resolved === 'lost' ? resolved : 'predicted';
    },
    [getResolvedStatus, predictedOutcome]
  );

  const handleSelectOutcome = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      dispatch(selectOutcome(id, networkId, +event.currentTarget.value));

      if (view === 'default' && onPredictionSelected) {
        onPredictionSelected();
      }
    },
    [dispatch, id, networkId, onPredictionSelected, view]
  );

  const predictions = useMemo(
    () =>
      sortOutcomes({
        outcomes,
        timeframe: '7d'
      }),
    [outcomes]
  );

  const withImages = predictions.every(outcome => !!outcome.imageUrl);

  const listHeight = Math.min(
    Math.ceil(window.innerHeight * (view === 'modal' ? 0.25 : 0.35)),
    predictions.length * (size === 'md' ? 64 : 82)
  );

  if (view === 'modal')
    return <TradePredictionsWithImages predictions={predictions} />;

  return (
    <div>
      <Virtuoso
        style={{
          height: listHeight
        }}
        data={predictions}
        itemContent={(index, outcome) => {
          const resolved = getResolvedStatus(outcome);
          const status = getOutcomeStatus(outcome);

          return (
            <button
              type="button"
              className={cn(styles.prediction, {
                [styles.predictionLg]: size === 'lg',
                [styles.predictionGutterBottom]:
                  index !== predictions.length - 1,
                [styles.predictionGutterBottomLg]: size === 'lg',
                [styles.predictionSelected]:
                  outcome.id.toString() === selectedOutcomeId.toString() &&
                  outcome.marketId.toString() === selectedMarketId.toString(),
                [styles.predictionDisabled]:
                  resolved || predictions.length === 1,
                [styles.predictionStatusPredicted]: status === 'predicted',
                [styles.predictionStatusWon]:
                  resolved === 'won' || status === 'won',
                [styles.predictionStatusLost]: status === 'lost'
              })}
              value={outcome.id.toString()}
              onClick={handleSelectOutcome}
            >
              {status === 'predicted' && (
                <div className={styles.predictionStatus}>
                  <CheckIcon className={styles.predictionStatusIcon} />
                  <span className={styles.predictionStatusTitle}>
                    Predicted
                  </span>
                </div>
              )}
              {status === 'won' && (
                <div className={styles.predictionStatus}>
                  <TrophyIcon className={styles.predictionStatusIcon} />
                  <span className={styles.predictionStatusTitle}>You won</span>
                </div>
              )}
              {status === 'lost' && (
                <div className={styles.predictionStatus}>
                  <span className={styles.predictionStatusTitle}>You lost</span>
                </div>
              )}
              <div
                className={cn(styles.predictionProgress, {
                  [styles.predictionProgressWinning]:
                    !resolved && outcome.isPriceUp,
                  [styles.predictionProgressLosing]:
                    !resolved && !outcome.isPriceUp
                })}
                style={{
                  width: `${outcome.price * 100}%`
                }}
              />
              <div className={styles.predictionContent}>
                <div className={styles.predictionTitleGroup}>
                  {withImages ? (
                    <Image
                      $radius="xs"
                      alt={outcome.title}
                      $size="xs"
                      src={outcome.imageUrl}
                    />
                  ) : null}
                  <p className={styles.predictionTitle}>{outcome.title}</p>
                </div>
                <p className={styles.predictionPrice}>{`${roundNumber(
                  +outcome.price * 100,
                  3
                )}%`}</p>
              </div>
            </button>
          );
        }}
      />
    </div>
  );
}

export default TradePredictions;
