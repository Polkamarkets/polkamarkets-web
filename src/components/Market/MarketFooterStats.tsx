import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { Market } from 'models/market';
import { useTheme } from 'ui';

import Icon from 'components/Icon';

import Text from '../Text';
import Tooltip from '../Tooltip';
import marketClasses from './Market.module.scss';

type MarketFooterStatsProps = {
  market: Market;
};

export default function MarketFooterStats({ market }: MarketFooterStatsProps) {
  const {
    volume,
    volumeEur,
    liquidity,
    liquidityEur,
    fee,
    treasuryFee,
    token,
    network
  } = market;
  const expiresAt = dayjs(market.expiresAt).utc(true).format('MMM D, YYYY');
  const theme = useTheme();

  return (
    <div className="pm-c-market-footer__stats">
      {theme.device.isTablet && !isEmpty(network.currency) && (
        <>
          <Tooltip text={network.name}>
            <Icon name={network.currency.iconName} />
          </Tooltip>
          <span className="pm-c-divider--circle" />
        </>
      )}
      {!!volume && (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={marketClasses.footerStatsText}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Volume: ${roundNumber(volumeEur, 3)} EUR`}
            >
              <Icon
                name="Stats"
                title="Volume"
                className={marketClasses.footerStatsIcon}
              />
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >
                {`${roundNumber(volume, 3)} `}
              </Text>
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >{`${token.ticker}`}</Text>
            </Tooltip>
          </Text>
          <span className="pm-c-divider--circle" />
        </>
      )}
      {!!liquidity && (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={marketClasses.footerStatsText}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Liquidity: ${roundNumber(liquidityEur, 3)} EUR`}
            >
              <Icon
                name="Liquidity"
                title="Liquidity"
                className={marketClasses.footerStatsIcon}
              />
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >
                {`${roundNumber(liquidity, 3)} `}
              </Text>
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >{`${token.ticker}`}</Text>
            </Tooltip>
          </Text>
          {theme.device.isTablet && <span className="pm-c-divider--circle" />}
        </>
      )}
      {theme.device.isTablet && (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={marketClasses.footerStatsText}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Trading Fee: ${roundNumber(fee + treasuryFee, 1)}%`}
            >
              <Icon
                name="Fee"
                title="Trading Fee"
                className={marketClasses.footerStatsIcon}
              />
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >
                {`${roundNumber(fee + treasuryFee, 1)}%`}
              </Text>
            </Tooltip>
          </Text>
          <span className="pm-c-divider--circle" />
        </>
      )}
      {theme.device.isTablet && market.expiresAt && (
        <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
          <Tooltip
            className={marketClasses.footerStatsTooltip}
            text={`Expires on ${expiresAt}`}
          >
            <Icon
              name="Calendar"
              title="Expires at"
              className={marketClasses.footerStatsIcon}
            />
            <Text
              as="strong"
              scale="tiny-uppercase"
              fontWeight="semibold"
              className={marketClasses.footerStatsText}
            >
              {expiresAt}
            </Text>
          </Tooltip>
        </Text>
      )}
    </div>
  );
}
