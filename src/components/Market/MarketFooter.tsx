import { useMemo } from 'react';

import { ui } from 'config';
import dayjs from 'dayjs';
import { inRange } from 'lodash';
import { Market } from 'models/market';
import { useTheme } from 'ui';

import Pill from 'components/Pill/Pill';
import VoteArrows from 'components/VoteArrows';

import marketClasses from './Market.module.scss';
import MarketFooterStats from './MarketFooterStats';

type MarketFooterProps = React.PropsWithChildren<{
  market: Market;
  showStateOnMobile?: boolean;
  statsVisibility?: {
    volume?: {
      desktop?: boolean;
      mobile?: boolean;
    };
  };
}>;

const tags = {
  awaiting: {
    children: 'Awaiting Resolution',
    color: 'warning',
    variant: 'normal'
  },
  ending: {
    children: 'Ending Soon',
    color: 'danger',
    variant: 'subtle'
  },
  new: {
    children: 'New',
    color: 'success',
    variant: 'subtle'
  },
  resolved: {
    children: 'Resolved',
    color: 'success',
    variant: 'normal'
  },
  voided: {
    children: 'Voided',
    color: 'danger',
    variant: 'normal'
  }
};

export default function MarketFooter({
  market,
  showStateOnMobile = false,
  statsVisibility,
  children
}: MarketFooterProps) {
  const theme = useTheme();
  const tag = useMemo(() => {
    if (market.state === 'closed') return 'awaiting';
    if (inRange(dayjs().diff(dayjs(market.expiresAt), 'hours'), -24, 1))
      return 'ending';
    if (inRange(dayjs(market.createdAt).diff(dayjs(), 'hours'), -24, 1))
      return 'new';
    if (market.state === 'resolved' && !market.voided) return 'resolved';
    if (market.voided) return 'voided';
    return '';
  }, [market.createdAt, market.expiresAt, market.state, market.voided]);

  return (
    <div className={`pm-c-market-footer ${marketClasses.footer}`}>
      <MarketFooterStats market={market} visibility={statsVisibility} />
      <div className="pm-c-market-footer__group--row">
        {children}
        {(showStateOnMobile || theme.device.isDesktop) && tag && (
          <>
            <div className="pm-c-market-footer__tags">
              <Pill badge {...tags[tag]} />
            </div>
          </>
        )}
        {theme.device.isDesktop && ui.market.voting.enabled && (
          <>
            {tag && <div className="pm-c-market-footer__divider--circle" />}
            <VoteArrows
              key={market.slug}
              size="sm"
              marketId={market.id}
              marketSlug={market.slug}
              marketNetworkId={market.network.id}
              votes={market.votes}
            />
          </>
        )}
      </div>
    </div>
  );
}
