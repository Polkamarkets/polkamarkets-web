import { memo } from 'react';

import cn from 'classnames';
import { Market as MarketInterface } from 'models/market';
import { useTheme } from 'ui';

import FavoriteMarket from 'components/FavoriteMarket';
import MarketFooterActions from 'components/Market/MarketFooterActions';

import Market from '../Market';

interface PredictionCardProps
  extends Pick<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  market: MarketInterface;
}

function PredictionCard({ market, className }: PredictionCardProps) {
  const theme = useTheme();

  return (
    <div className={cn('prediction-card', className)}>
      <div className="prediction-card__body">
        <Market market={market} />
        <Market.Outcomes market={market} />
      </div>
      <div className="prediction-card__footer">
        <Market.Footer market={market}>
          {theme.device.isDesktop ? (
            <>
              <MarketFooterActions $variant="text" market={market} />
              <div className="pm-c-market-footer__divider--circle" />
            </>
          ) : (
            <FavoriteMarket market={market} />
          )}
        </Market.Footer>
      </div>
    </div>
  );
}

export default memo(PredictionCard);
