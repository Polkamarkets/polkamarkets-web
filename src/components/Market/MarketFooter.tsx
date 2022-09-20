import { Market } from 'models/market';

import MarketFooterActions from './MarketFooterActions';
import MarketFooterStats from './MarketFooterStats';
import MarketFooterTags from './MarketFooterTags';

type MarketFooterProps = {
  market: Market;
};

function MarketFooter({ market }: MarketFooterProps) {
  return (
    <div className="pm-c-market-footer">
      <MarketFooterStats market={market} />
      <div className="pm-c-market-footer__group--row">
        <MarketFooterActions market={market} />
        <MarketFooterTags market={market} />
      </div>
    </div>
  );
}

MarketFooter.displayName = 'MarketFooter';

export default MarketFooter;
