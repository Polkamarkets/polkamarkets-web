import { useCallback, useMemo, MouseEvent } from 'react';
import { Virtuoso } from 'react-virtuoso';

import cn from 'classnames';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import { selectOutcome } from 'redux/ducks/trade';
import { Image } from 'ui';

import { useAppDispatch, useAppSelector } from 'hooks';

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

  const withImages = predictions.every(outcome => !!outcome.imageUrl);

  const listHeight = Math.min(
    Math.ceil(window.innerHeight * (view === 'modal' ? 0.25 : 0.35)),
    predictions.length * (size === 'md' ? 60 : 82)
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
        itemContent={(index, outcome) => (
          <button
            type="button"
            className={cn(styles.prediction, {
              [styles.predictionLg]: size === 'lg',
              [styles.predictionGutterBottom]: index !== predictions.length - 1,
              [styles.predictionGutterBottomLg]: size === 'lg',
              [styles.predictionSelected]:
                outcome.id.toString() === selectedOutcomeId.toString() &&
                outcome.marketId.toString() === selectedMarketId.toString(),
              [styles.predictionDisabled]: predictions.length === 1
            })}
            value={outcome.id.toString()}
            onClick={handleSelectOutcome}
          >
            <div
              className={cn(styles.predictionProgress, {
                [styles.predictionProgressWinning]: outcome.isPriceUp,
                [styles.predictionProgressLosing]: !outcome.isPriceUp
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
        )}
      />
    </div>
  );
}

export default TradePredictions;
