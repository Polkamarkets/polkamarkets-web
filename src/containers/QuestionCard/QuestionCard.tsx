import { useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import classNames from 'classnames';
import { features } from 'config';
import dayjs from 'dayjs';
import { relativeTimeFromNow } from 'helpers/date';
import type { Market } from 'models/market';
import { Avatar, useTheme } from 'ui';

import { Icon } from 'components';

import { useAppDispatch, useLanguage } from 'hooks';

import styles from './QuestionCard.module.scss';
import QuestionCardActions from './QuestionCardActions';
import QuestionCardOutcomes from './QuestionCardOutcomes';

const hotTags = ['🧨 Booming Now', '✨ Just In', '🔥 Trending', '⌛ Closing'];

type QuestionCardProps = {
  market: Market;
  gutter?: boolean;
};

function QuestionCard({ market, gutter }: QuestionCardProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const language = useLanguage();
  const theme = useTheme();

  const handleNavigation = useCallback(async () => {
    const { clearMarket } = await import('redux/ducks/market');
    const { openTradeForm } = await import('redux/ducks/ui');
    const { selectOutcome } = await import('redux/ducks/trade');

    if (features.regular.enabled) {
      dispatch(
        selectOutcome(market.id, market.networkId, market.outcomes[0].id)
      );
    }

    dispatch(clearMarket());

    if (features.regular.enabled) {
      dispatch(openTradeForm());
    }
  }, [dispatch, market.id, market.networkId, market.outcomes]);

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
          <Link
            className={styles.header}
            to={{
              pathname: `/markets/${market.slug}`,
              state: { from: location.pathname }
            }}
            onClick={handleNavigation}
          >
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
          </Link>
          {theme.device.isDesktop ? (
            <QuestionCardActions market={market} />
          ) : null}
        </div>
        <QuestionCardOutcomes market={market} compact={false} />
        {!theme.device.isDesktop ? (
          <QuestionCardActions market={market} />
        ) : null}
      </div>
    </div>
  );
}

export default QuestionCard;
