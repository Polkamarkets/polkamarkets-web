import { useMemo } from 'react';

import { features } from 'config';
import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { Market } from 'models/market';
import { useTheme } from 'ui';

import Feature from 'components/Feature';
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

  const {
    users,
    volume,
    volumeEur,
    liquidity,
    liquidityEur,
    fee,
    treasuryFee,
    token,
    network
  } = market;

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
      {theme.device.isDesktop && !isEmpty(network.currency) && (
        <Feature name="regular">
          <Tooltip text={network.name}>
            <Icon name={network.currency.iconName} />
          </Tooltip>
          <span className="pm-c-divider--circle" />
        </Feature>
      )}
      {!!users && features.fantasy.enabled && (
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
                {users}
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
              text={`Volume: ${roundNumber(
                volumeEur,
                features.fantasy.enabled ? 0 : 3
              )} EUR`}
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
                {`${roundNumber(volume, features.fantasy.enabled ? 0 : 3)} `}
              </Text>
              <Text
                as="strong"
                scale="tiny-uppercase"
                fontWeight="semibold"
                className={marketClasses.footerStatsText}
              >
                {`${fantasyTokenTicker || token.ticker}`}
              </Text>
            </Tooltip>
          </Text>
          {theme.device.isDesktop && <span className="pm-c-divider--circle" />}
        </>
      )}
      {!!liquidity && (
        <Feature name="regular">
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
          {theme.device.isDesktop && <span className="pm-c-divider--circle" />}
        </Feature>
      )}
      {theme.device.isDesktop && (
        <Feature name="regular">
          <Text
            as="span"
            scale="tiny-uppercase"
            fontWeight="semibold"
            className={marketClasses.footerStatsText}
          >
            <Tooltip
              className={marketClasses.footerStatsTooltip}
              text={`Trading Fee: ${roundNumber(
                (fee + treasuryFee) * 100,
                1
              )}%`}
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
                {`${roundNumber((fee + treasuryFee) * 100, 1)}%`}
              </Text>
            </Tooltip>
          </Text>
          <span className="pm-c-divider--circle" />
        </Feature>
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
