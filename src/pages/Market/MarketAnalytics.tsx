import cn from 'classnames';
import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import omit from 'lodash/omit';

import { Text } from 'components';

import { useAppSelector, useFantasyTokenTicker } from 'hooks';

import marketClasses from './Market.module.scss';
import MarketTitle from './MarketTitle';

export default function MarketAnalytics() {
  const market = useAppSelector(state => state.market.market);
  const fantasyTokenTicker = useFantasyTokenTicker();

  const analytics = {
    Volume: roundNumber(market.volume, 3),
    Expires: dayjs(market.expiresAt).utc(true).format('MMM D, YYYY h:mm A'),
    Liquidity: roundNumber(market.liquidity, 3),
    // TODO: get the actual 24h volume
    '24H volume': roundNumber(market.volume, 3)
  };

  const filteredAnalytics = omit(analytics, ['Liquidity']);

  return (
    <section className={marketClasses.section}>
      <MarketTitle>Stats</MarketTitle>
      <ul className={marketClasses.stats}>
        {Object.keys(filteredAnalytics).map((analytic, index) => (
          <li
            key={analytic}
            className={cn(marketClasses.statsItem, {
              [marketClasses.statsItemGutter]: !index || index === 1
            })}
          >
            <Text as="p" scale="tiny" color="gray" fontWeight="semibold">
              {analytic}
            </Text>
            <Text
              fontWeight="semibold"
              className={marketClasses.statsItemPrimary}
            >
              {analytics[analytic]}{' '}
              {analytic !== 'Expires' && (
                <Text as="span" color="gray">
                  {fantasyTokenTicker || market.token.ticker}
                </Text>
              )}
            </Text>
          </li>
        ))}
      </ul>
    </section>
  );
}
