import cn from 'classnames';
import { Market } from 'models/market';

import { CheckIcon, WarningIcon } from 'assets/icons';

import FavoriteMarket from 'components/FavoriteMarket';
import Icon from 'components/Icon';
import Share from 'components/Share';

import { useOperation } from 'hooks';

import styles from './MarketFooterActions.module.scss';

type MarketFooterActionsProps = {
  market: Market;
  $variant: 'filled' | 'text';
};

const status = {
  success: (
    <span className={cn(styles.predicted, styles.predictedSuccess)}>
      <CheckIcon className={styles.predictedIcon} /> Predicted
    </span>
  ),
  failed: (
    <span className={cn(styles.predicted, styles.predictedFailed)}>
      <WarningIcon className={styles.predictedIcon} /> Failed
    </span>
  ),
  pending: (
    <span className={cn(styles.predicted, styles.predictedPending)}>
      <Icon name="Loading" size="md" /> Pending
    </span>
  )
};

export default function MarketFooterActions({
  market,
  $variant = 'text'
}: MarketFooterActionsProps) {
  const { origin } = window.location;

  const operation = useOperation(market);

  return (
    <div className="pm-c-market-footer__actions">
      {operation.data
        ? status[operation.data.status]
        : operation.predictedOutcome != null && status.success}
      <Share
        id={market.slug}
        className={cn('pm-c-market-footer__actions-button', {
          'pm-c-market-footer__actions-button-filled': $variant === 'filled'
        })}
        link={{
          title: market.title,
          url: `${origin}/markets/${market.slug}`
        }}
      />
      <FavoriteMarket
        market={market}
        className={cn({
          'pm-c-market-footer__actions-button-filled': $variant === 'filled'
        })}
      />
    </div>
  );
}
