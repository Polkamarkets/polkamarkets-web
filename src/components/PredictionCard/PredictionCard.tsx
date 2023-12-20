import { memo } from 'react';

import classNames from 'classnames';
import { Market as MarketInterface } from 'models/market';

import MarketFooterActions from 'components/Market/MarketFooterActions';

import Market from '../Market';

interface PredictionCardProps
  extends Pick<React.ComponentPropsWithoutRef<'div'>, 'itemID' | 'className'> {
  market: MarketInterface;
  $gutter?: boolean;
  readonly?: boolean;
  showCategory?: boolean;
  statsVisibility?: {
    volume?: {
      desktop?: boolean;
      mobile?: boolean;
    };
  };
}

function PredictionCard({
  market,
  $gutter,
  itemID,
  className,
  readonly = false,
  showCategory = true,
  statsVisibility
}: PredictionCardProps) {
  return (
    <div
      itemID={itemID}
      className={classNames({ 'prediction-card--gutter': $gutter })}
    >
      <div className={classNames('prediction-card', className)}>
        <div className="prediction-card__body">
          <Market market={market} showCategory={showCategory} />
          <Market.Outcomes market={market} readonly={readonly} />
        </div>
        <div className="prediction-card__footer">
          <Market.Footer market={market} statsVisibility={statsVisibility}>
            <MarketFooterActions $variant="text" market={market} />
          </Market.Footer>
        </div>
      </div>
    </div>
  );
}

export default memo(PredictionCard);
