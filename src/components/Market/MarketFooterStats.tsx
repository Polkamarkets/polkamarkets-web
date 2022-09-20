import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';

import Text from '../Text';
import Tooltip from '../Tooltip';

type MarketFooterStatsProps = {
  market: Market;
};

function MarketFooterStats({ market }: MarketFooterStatsProps) {
  const { volume, expiresAt, liquidity, network } = market;
  const { currency } = network;

  return (
    <div className="pm-c-market-footer__stats">
      {network ? (
        <>
          <Tooltip text={network.name}>{network.currency.icon}</Tooltip>
          <span className="pm-c-divider--circle" />
        </>
      ) : null}
      {volume ? (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            color="gray"
          >
            {`Volume: `}
            <Text
              as="strong"
              scale="tiny-uppercase"
              fontWeight="semibold"
              color="lighter-gray"
            >
              {`${roundNumber(volume, 3)} ${currency.ticker}`}
            </Text>
          </Text>
          <span className="pm-c-divider--circle" />
        </>
      ) : null}
      {expiresAt ? (
        <>
          <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
            {`Expiration: `}
            <Text as="strong" scale="tiny-uppercase" fontWeight="semibold">
              {dayjs(expiresAt).utc().format('YYYY-MM-DD HH:mm UTC')}
            </Text>
          </Text>
          <span className="pm-c-divider--circle" />
        </>
      ) : null}
      {liquidity ? (
        <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
          {`Liquidity: `}
          <Text as="strong" scale="tiny-uppercase" fontWeight="semibold">
            {`${roundNumber(liquidity, 3)} ${currency.ticker}`}
          </Text>
        </Text>
      ) : null}
    </div>
  );
}

export default MarketFooterStats;
