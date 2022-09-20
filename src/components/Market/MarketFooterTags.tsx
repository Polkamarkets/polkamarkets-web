import dayjs from 'dayjs';
import inRange from 'lodash/inRange';
import { Market } from 'models/market';

import { VerifiedIcon } from 'assets/icons';

import Pill, { PillColor, PillVariant } from '../Pill';
import Tooltip from '../Tooltip';

type MarketState = {
  copy: 'Awaiting Resolution' | 'Ending Soon' | 'New' | 'Resolved' | 'Voided';
  color: PillColor;
  colorVariant: PillVariant;
};

type MarketStates = {
  [key: string]: MarketState;
};

const marketStates: MarketStates = {
  awaitingResolution: {
    copy: 'Awaiting Resolution',
    color: 'warning',
    colorVariant: 'normal'
  },
  endingSoon: { copy: 'Ending Soon', color: 'danger', colorVariant: 'subtle' },
  new: { copy: 'New', color: 'success', colorVariant: 'subtle' },
  resolved: { copy: 'Resolved', color: 'success', colorVariant: 'normal' },
  voided: { copy: 'Voided', color: 'danger', colorVariant: 'normal' }
};

type MarketFooterTagsProps = {
  market: Market;
};

function MarketFooterTags({ market }: MarketFooterTagsProps) {
  const { createdAt, expiresAt, state, voided, verified } = market;

  const isAwaitingResolution = state === 'closed';
  const isEndingSoon = inRange(dayjs().diff(dayjs(expiresAt), 'hours'), -24, 1);
  const isNew = inRange(dayjs(createdAt).diff(dayjs(), 'hours'), -24, 1);
  const isResolved = state === 'resolved' && !voided;
  const isVoided = voided;
  const isVerified = verified;

  return (
    <>
      {[isAwaitingResolution, isEndingSoon, isNew, isResolved].some(
        item => item === true
      ) ? (
        <div className="pm-c-market-footer__divider--circle" />
      ) : null}
      <div className="pm-c-market-footer__tags">
        {isAwaitingResolution ? (
          <Pill
            color={marketStates.awaitingResolution.color}
            variant={marketStates.awaitingResolution.colorVariant}
            badge
          >
            {marketStates.awaitingResolution.copy}
          </Pill>
        ) : null}
        {isEndingSoon ? (
          <Pill
            color={marketStates.endingSoon.color}
            variant={marketStates.endingSoon.colorVariant}
            badge
          >
            {marketStates.endingSoon.copy}
          </Pill>
        ) : null}
        {isNew ? (
          <Pill
            color={marketStates.new.color}
            variant={marketStates.new.colorVariant}
            badge
          >
            {marketStates.new.copy}
          </Pill>
        ) : null}
        {isResolved ? (
          <Pill
            color={marketStates.resolved.color}
            variant={marketStates.resolved.colorVariant}
            badge
          >
            {marketStates.resolved.copy}
          </Pill>
        ) : null}
        {isVoided ? (
          <Pill
            color={marketStates.voided.color}
            variant={marketStates.voided.colorVariant}
            badge
          >
            {marketStates.voided.copy}
          </Pill>
        ) : null}
        {isVerified ? (
          <>
            <div className="pm-c-market-footer__divider--circle" />
            <Tooltip text="Verified Market" position="top">
              <VerifiedIcon size="sm" style={{ cursor: 'pointer' }} />
            </Tooltip>
          </>
        ) : null}
      </div>
    </>
  );
}

export default MarketFooterTags;
