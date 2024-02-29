import { useMemo } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';
import { useTheme } from 'ui';

import Icon from 'components/Icon';

import { useFantasyTokenTicker } from 'hooks';

import Text from '../Text';
import Tooltip from '../Tooltip';
import marketClasses from './Market.module.scss';

type MarketFooterStatsProps = {
  market: Market;
  visibility?: {
    volume?: {
      desktop?: boolean;
      mobile?: boolean;
    };
  };
};

export default function MarketFooterStats({
  market,
  visibility = { volume: { desktop: true, mobile: false } }
}: MarketFooterStatsProps) {
  const theme = useTheme();

  const { users, volume, volumeEur, token } = market;

  const expiresAt = dayjs(market.expiresAt).utc(true);

  const currentYear = dayjs().utc(true).year();
  const showYear = currentYear !== expiresAt.year();
  const showTime = currentYear === expiresAt.year();

  const formatedExpiresAt = theme.device.isDesktop
    ? expiresAt.format('MMM D, YYYY H:mm')
    : expiresAt.format(
        `MMM D,${showYear ? ' YYYY' : ''}${showTime ? ' H:mm' : ''}`
      );

  const fantasyTokenTicker = useFantasyTokenTicker();

  const statsVisibility = useMemo(() => {
    return {
      volume: theme.device.isDesktop
        ? visibility?.volume?.desktop
        : visibility?.volume?.mobile
    };
  }, [
    theme.device.isDesktop,
    visibility?.volume?.desktop,
    visibility?.volume?.mobile
  ]);

  return (
    <div className="pm-c-market-footer__stats">
      {!!users && (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={`${marketClasses.footerStatsText} notranslate`}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Users: ${users}`}
            >
              <Icon
                name="User"
                title="Users"
                className={marketClasses.footerStatsIcon}
              />
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >
                {users.toLocaleString('fr-FR')}
              </Text>
            </Tooltip>
          </Text>
          {theme.device.isDesktop && <span className="pm-c-divider--circle" />}
        </>
      )}
      {statsVisibility.volume && !!volume && (
        <>
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={`${marketClasses.footerStatsText} notranslate`}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Volume: ${roundNumber(volumeEur, 0)} ${
                fantasyTokenTicker || 'EUR'
              }`}
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
                {`${roundNumber(volume, 0).toLocaleString('fr-FR')} `}
              </Text>
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={classNames(
                  marketClasses.footerStatsText,
                  'margin-left-2'
                )}
              >
                {`${fantasyTokenTicker || token.ticker}`}
              </Text>
            </Tooltip>
          </Text>
          {theme.device.isDesktop && <span className="pm-c-divider--circle" />}
        </>
      )}
      {market.expiresAt && (
        <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
          <Tooltip
            className={marketClasses.footerStatsTooltip}
            text={`Expires on ${formatedExpiresAt}`}
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
              {formatedExpiresAt}
            </Text>
          </Tooltip>
        </Text>
      )}
    </div>
  );
}
