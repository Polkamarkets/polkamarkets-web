import { useCallback, useMemo, useState, MouseEvent } from 'react';

import cn from 'classnames';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import { selectOutcome } from 'redux/ducks/trade';
import { Image } from 'ui';

import { useAppDispatch, useAppSelector } from 'hooks';

import VirtualizedList from '../VirtualizedList';
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
  const [visiblePredictions, setVisiblePredictions] = useState(3);

  const { id, outcomes, networkId } = useAppSelector(
    state => state.market.market
  );

  const { selectedOutcomeId, selectedMarketId } = useAppSelector(
    state => state.trade
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

  const multiple = predictions.length > 2;
  const withImages = predictions.every(outcome => !!outcome.imageUrl);

  const on = multiple ? predictions.slice(0, visiblePredictions) : predictions;
  const off = multiple ? predictions.slice(visiblePredictions) : [];

  const listHeight = Math.min(
    Math.ceil(window.innerHeight * (view === 'modal' ? 0.25 : 0.35)),
    on.length * (size === 'md' ? 49 : 71)
  );

  if (view === 'default' || (view === 'modal' && !withImages)) {
    return (
      <div>
        <VirtualizedList
          height={listHeight}
          data={on}
          itemContent={(index, outcome) => (
            <button
              type="button"
              className={cn(styles.prediction, {
                [styles.predictionLg]: size === 'lg',
                [styles.predictionGutterBottom]:
                  index !== predictions.length - 1,
                [styles.predictionGutterBottomLg]: size === 'lg',
                [styles.predictionSelected]:
                  view === 'modal' &&
                  outcome.id.toString() === selectedOutcomeId.toString() &&
                  outcome.marketId.toString() === selectedMarketId.toString()
              })}
              value={outcome.id.toString()}
              onClick={handleSelectOutcome}
            >
              <div
                className={cn(styles.predictionProgress, {
                  [styles.predictionProgressDefault]: multiple,
                  [styles.predictionProgressWinning]: !multiple && index === 0,
                  [styles.predictionProgressLosing]: !multiple && index === 1
                })}
                style={{
                  width: `${outcome.price * 100}%`
                }}
              />
              <div className={styles.predictionContent}>
                <div className={styles.predictionTitleGroup}>
                  {withImages ? (
                    <Image
                      $radius="lg"
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
          )}
        />
        {predictions.length > 3 ? (
          <button
            type="button"
            className={styles.predictionsShowMore}
            onClick={() =>
              setVisiblePredictions(off.length > 0 ? predictions.length : 3)
            }
          >
            {off.length > 0 ? `Show More (${off.length})` : 'Show Less'}
          </button>
        ) : null}
      </div>
    );
  }

  return <TradePredictionsWithImages predictions={predictions} />;
}

export default TradePredictions;
