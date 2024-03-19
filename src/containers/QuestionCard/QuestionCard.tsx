import { useMemo } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { relativeTimeFromNow } from 'helpers/date';
import { roundNumber } from 'helpers/math';
import type { Market } from 'models/market';
import { Avatar } from 'ui';

import { Button, Icon } from 'components';
import MarketOutcomes from 'components/Market/MarketOutcomes';

import { useFantasyTokenTicker, useLanguage } from 'hooks';

import styles from './QuestionCard.module.scss';

const hotTags = ['🧨 Booming Now', '✨ Just In', '🔥 Trending', '⌛ Closing'];

type QuestionCardProps = {
  market: Market;
  gutter?: boolean;
};

function QuestionCard({ market, gutter }: QuestionCardProps) {
  const language = useLanguage();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const tournament = useMemo(() => {
    if (!market.tournaments) {
      return undefined;
    }

    if (market.tournaments.length === 0) {
      return undefined;
    }

    return market.tournaments[0];
  }, [market.tournaments]);

  const land = tournament?.land;

  return (
    <div
      className={classNames({
        [styles.gutter]: gutter
      })}
    >
      <div className={styles.root}>
        <div className={styles.body}>
          <div className={styles.header}>
            {tournament && land && (
              <div className={styles.land}>
                {land.imageUrl && (
                  <Avatar
                    $radius="lg"
                    src={land.imageUrl}
                    alt={land.title}
                    className={styles.landAvatar}
                  />
                )}
                <div className={styles.landBody}>
                  <p className={styles.landTitle}>{land.title}</p>
                  <p className={styles.details}>
                    Asked at
                    <strong>{tournament.title}</strong>
                    <Icon name="Cup" />
                    &middot;
                    <span>
                      {relativeTimeFromNow(
                        dayjs(market.createdAt).unix() * 1000,
                        language
                      )}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div>
              <p className={styles.title}>{market.title}</p>
              <p className={styles.status}>
                <span className={styles.hotTag}>
                  {hotTags[Math.floor(Math.random() * hotTags.length)]}
                </span>
                &middot; Closes:
                <span>
                  {dayjs(market.expiresAt).utc(true).format('MMM DD, YYYY')}
                </span>
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <Button size="sm" color="noborder" className={styles.actionsButton}>
              <Icon name="Comment" />
              421
            </Button>
            <Button size="sm" color="noborder" className={styles.actionsButton}>
              <Icon name="BarChart" />
              <strong>{roundNumber(market.volume, 3)}</strong>
              {fantasyTokenTicker || market.token.ticker}
            </Button>
            <Button size="sm" color="noborder" className={styles.actionsButton}>
              <Icon name="Heart" />
              563
            </Button>
            <Button size="sm" color="noborder" className={styles.actionsButton}>
              <Icon name="MoreHorizontal" />
            </Button>
          </div>
        </div>
        <MarketOutcomes market={market} compact />
      </div>
    </div>
  );
}

export default QuestionCard;
