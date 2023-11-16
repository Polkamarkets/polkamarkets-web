import { memo } from 'react';

import cn from 'classnames';
import { Market as MarketInterface } from 'models/market';

import MarketFooterActions from 'components/Market/MarketFooterActions';

import Market from '../Market';

interface PredictionCardProps
  extends Pick<React.ComponentPropsWithoutRef<'div'>, 'itemID' | 'className'> {
  market: MarketInterface;
  $gutter?: boolean;
}

function PredictionCard({
  market,
  $gutter,
  itemID,
  className
}: PredictionCardProps) {
  return (
    <div
      itemID={itemID}
      className={cn(
        'prediction-card',
        { 'prediction-card--gutter': $gutter },
        className
      )}
    >
      <div className="prediction-card__body">
        <Market market={market} />
        <Market.Outcomes market={market} />
      </div>
      <div className="prediction-card__footer">
        <Market.Footer market={market}>
          <MarketFooterActions $variant="text" market={market} />
        </Market.Footer>
      </div>
    </div>
  );
}

export default memo(PredictionCard);
