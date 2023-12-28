import { memo } from 'react';

import classNames from 'classnames';
import { Market as MarketInterface } from 'models/market';

import MarketFooterActions from 'components/Market/MarketFooterActions';

import Market from '../Market';

interface PredictionCardProps
  extends Pick<React.ComponentPropsWithoutRef<'div'>, 'itemID' | 'className'> {
  market: MarketInterface;
  $gutter?: boolean;
  wrapperClassName?: string;
  readonly?: boolean;
  showCategory?: boolean;
  showLand?: boolean;
  showFooter?: boolean;
  statsVisibility?: {
    volume?: {
      desktop?: boolean;
      mobile?: boolean;
    };
  };
  compact?: boolean;
}

function PredictionCard({
  market,
  $gutter,
  itemID,
  className,
  wrapperClassName,
  readonly = false,
  showCategory = true,
  showLand = false,
  showFooter = true,
  statsVisibility,
  compact = false
}: PredictionCardProps) {
  return (
    <div
      itemID={itemID}
      className={classNames(
        { 'prediction-card--gutter': $gutter },
        wrapperClassName
      )}
    >
      <div className={classNames('prediction-card', className)}>
        <div className="prediction-card__body">
          <Market
            market={market}
            showCategory={showCategory}
            showLand={showLand}
          />
          <Market.Outcomes
            market={market}
            readonly={readonly}
            compact={compact}
          />
        </div>
        {showFooter ? (
          <div className="prediction-card__footer">
            <Market.Footer market={market} statsVisibility={statsVisibility}>
              <MarketFooterActions $variant="text" market={market} />
            </Market.Footer>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(PredictionCard);
