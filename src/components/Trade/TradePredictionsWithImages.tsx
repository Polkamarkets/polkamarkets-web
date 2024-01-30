import {
  useContext,
  useCallback,
  MouseEvent,
  ContextType,
  WheelEvent,
  useRef,
  useEffect
} from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

import cn from 'classnames';
import { roundNumber } from 'helpers/math';
import { Outcome } from 'models/market';
import { Line } from 'rc-progress';
import { selectOutcome } from 'redux/ducks/trade';
import { Image } from 'ui';

import { useAppDispatch, useAppSelector } from 'hooks';

import Icon from '../Icon';
import styles from './Trade.module.scss';

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.predictionsWithImageArrowButton}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      <Icon name="Chevron" dir="left" />
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.predictionsWithImageArrowButton}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <Icon name="Chevron" dir="right" />
    </button>
  );
}

type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

type TradePredictionsWithImagesProps = {
  predictions: Outcome[];
};

function TradePredictionsWithImages({
  predictions
}: TradePredictionsWithImagesProps) {
  const dispatch = useAppDispatch();

  const { id, networkId } = useAppSelector(state => state.market.market);

  const { selectedOutcomeId, selectedMarketId } = useAppSelector(
    state => state.trade
  );

  const apiRef = useRef({} as scrollVisibilityApiType);

  useEffect(() => {
    if (apiRef.current) {
      const itemIsVisible = apiRef.current.isItemVisible(
        selectedOutcomeId.toString()
      );

      if (!itemIsVisible) {
        const item = apiRef.current.getItemElementById(
          selectedOutcomeId.toString()
        );

        if (item) {
          apiRef.current.scrollToItem(item, 'auto', 'center');
        }
      }
    }
  }, [selectedOutcomeId]);

  const onWheel = useCallback(
    (apiObj: scrollVisibilityApiType, event: WheelEvent): void => {
      const isTouchpad =
        Math.abs(event.deltaX) !== 0 || Math.abs(event.deltaY) < 15;

      if (isTouchpad) {
        event.stopPropagation();
        return;
      }

      if (event.deltaY < 0) {
        apiObj.scrollNext();
      } else if (event.deltaY > 0) {
        apiObj.scrollPrev();
      }
    },
    []
  );

  const handleSelectPrediction = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      dispatch(selectOutcome(id, networkId, +event.currentTarget.value));
    },
    [dispatch, id, networkId]
  );

  const multiple = predictions.length > 2;

  return (
    <ScrollMenu
      apiRef={apiRef}
      wrapperClassName={multiple ? styles.predictionsWithImageWrapper : ''}
      scrollContainerClassName={
        multiple
          ? styles.predictionsWithImageScroll
          : styles.predictionsWithImageNonScroll
      }
      itemClassName={styles.predictionsWithImageItem}
      LeftArrow={multiple ? LeftArrow : undefined}
      RightArrow={multiple ? RightArrow : undefined}
      onWheel={onWheel}
    >
      {predictions.map((prediction, index) => (
        <button
          type="button"
          key={prediction.id.toString()}
          itemID={prediction.id.toString()}
          title={prediction.title}
          className={cn(styles.predictionWithImage, {
            [styles.predictionWithImageSelected]:
              prediction.id.toString() === selectedOutcomeId.toString() &&
              prediction.marketId.toString() === selectedMarketId.toString(),
            [styles.predictionWithImageDisabled]: predictions.length === 1
          })}
          value={prediction.id.toString()}
          onClick={handleSelectPrediction}
        >
          <div className={styles.predictionWithImageProgressWrapper}>
            <Image
              className={styles.predictionWithImageImage}
              alt={prediction.title}
              src={prediction.imageUrl}
            />
            <Line
              trailWidth={6}
              strokeWidth={6}
              percent={prediction.price * 100}
              className={cn(styles.predictionWithImageProgress, {
                [styles.predictionWithImageProgressDefault]: multiple,
                [styles.predictionWithImageProgressWinning]:
                  !multiple && index === 0,
                [styles.predictionWithImageProgressLosing]:
                  !multiple && index === 1
              })}
            />
          </div>
          <div className={styles.predictionWithImageDetails}>
            <p className={styles.predictionWithImageDetailsTitle}>
              {prediction.title}
            </p>
            <p
              className={styles.predictionWithImageDetailsPrice}
            >{`${roundNumber(+prediction.price * 100, 3)}%`}</p>
          </div>
        </button>
      ))}
    </ScrollMenu>
  );
}

export default TradePredictionsWithImages;
