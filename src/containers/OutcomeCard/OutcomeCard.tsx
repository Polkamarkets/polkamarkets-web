import { CSSProperties } from 'react';

import classNames from 'classnames';
import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';
import type { UserOperation } from 'types/user';
import { Avatar } from 'ui';

import Icon from 'components/Icon';
import type { AreaDataPoint } from 'components/plots/Area/Area.type';

import styles from './OutcomeCard.module.scss';

export type OutcomeCardProps = Pick<
  React.ComponentPropsWithoutRef<'button'>,
  'value' | 'className' | 'onClick' | 'children'
> &
  Partial<Record<'primary' | 'image' | 'activeColor', string>> &
  Partial<Record<'invested', number>> & {
    token: Market['token'];
    outcomesWithShares?: {
      id: string;
      title: string;
      imageUrl: string;
      shares: any;
      buyValue: number;
      value: number;
    }[];
    $state?: UserOperation['status'];
    isActive?: boolean;
    data?: AreaDataPoint[];
    $variant?: 'dashed';
    $size?: 'sm' | 'md';
    resolved?: 'won' | 'lost' | 'voided';
    secondary: {
      price: number;
      ticker?: string;
      isPriceUp?: boolean;
      priceChange24h?: number;
      text?: string;
    };
    isWinningOutcome?: boolean;
  };

function QuestionCard({
  primary,
  secondary,
  $variant,
  image,
  resolved,
  className,
  isWinningOutcome,
  ...props
}: OutcomeCardProps) {
  return (
    <button
      type="button"
      disabled={!!resolved}
      className={classNames(styles.root, className)}
      {...props}
    >
      {image ? <Avatar src={image} className={styles.avatar} /> : null}
      {$variant === 'dashed' ? (
        <button
          type="button"
          disabled={!!resolved}
          className={styles.plusButton}
        >
          <Icon size="lg" name="Plus" />
        </button>
      ) : null}
      <div className={styles.body}>
        <p className={styles.title}>{primary}</p>
        {secondary.text ? (
          <p className={classNames(styles.outcomes, 'notranslate')}>
            {secondary.text}
          </p>
        ) : (
          <p className={classNames(styles.price, 'notranslate')}>
            <strong>{`${roundNumber(+secondary.price * 100, 0)}%`}</strong>
            <span
              className={classNames({
                [styles.priceUp]: secondary.isPriceUp,
                [styles.priceDown]: !secondary.isPriceUp
              })}
            >
              <Icon
                name={
                  secondary.isPriceUp ? 'ArrowTopRight' : 'ArrowBottomRight'
                }
                className={styles.priceIcon}
              />
            </span>
            {secondary.priceChange24h
              ? `(${secondary.priceChange24h > 0 ? '+' : ''}${roundNumber(
                  secondary.priceChange24h * 100,
                  0
                )}% today)`
              : null}
          </p>
        )}
        <div className={styles.progressBar}>
          <div
            className={classNames({
              [styles.progressBarLine]: true,
              [styles.progressBarLineWinning]: isWinningOutcome
            })}
            style={
              {
                '--width': `${roundNumber(+secondary.price * 100, 0)}%`
              } as CSSProperties
            }
          />
        </div>
      </div>
    </button>
  );
}

export default QuestionCard;
