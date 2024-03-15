import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { Tournament } from 'types/tournament';
import { Avatar, Button } from 'ui';

import styles from './ContestCard.module.scss';

type ContestCardProps = {
  tournament: Tournament;
};

function ContestCard({ tournament }: ContestCardProps) {
  const stats = useMemo(() => {
    const endDate = dayjs(tournament.expiresAt)
      .utc(true)
      .format('MMM DD, YYYY');
    // const rewards = tournament.rewards
    //   ? Math.max(...tournament.rewards.map(reward => reward.to || reward.from))
    //   : 0;
    const questions = tournament.markets ? tournament.markets.length : 0;

    return {
      endDate,
      // rewards,
      questions
    };
  }, [
    tournament.expiresAt,
    tournament.markets
    // tournament.rewards
  ]);

  const isContestEnded = dayjs()
    .utc()
    .isAfter(dayjs(tournament.expiresAt).utc());

  return (
    <div className={styles.root}>
      
      <div
        className={styles.banner}
        style={
          {
            '--background-image': `url(${tournament.imageUrl})`
          } as React.CSSProperties
        }
      >
        <div
          className={classNames(styles.status, {
            [styles.statusLive]: !isContestEnded,
            [styles.statusEnded]: isContestEnded
          })}
        >
          <span className={styles.statusDot} />
          <span className={styles.statusTitle}>
            {isContestEnded ? 'Ended' : 'Live now'}
          </span>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.infoName}>{tournament.title}</h3>
        {tournament.land && (
          <div className={styles.infoLand}>
            {!(tournament.land.imageUrl === null) && (
              <Avatar
                $size="xs"
                $radius="lg"
                src={tournament.land.imageUrl}
                alt={tournament.land.title}
                className={styles.infoLandAvatar}
              />
            )}
            <span
              className={styles.infoLandName}
            >{`By ${tournament.land.title}`}</span>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerStats}>
          <span className={styles.footerStatsItem}>
            End Date <strong className="notranslate">{stats.endDate}</strong>
          </span>
          {/* <span className={styles.footerStatsItem}>
            Rewards <strong className="notranslate">{stats.rewards}</strong>
          </span> */}
          <span className={styles.footerStatsItem}>
            Questions <strong className="notranslate">{stats.questions}</strong>
          </span>
        </div>
      </div>
      <div className={styles.overlay}>
        <Link to={`/${tournament.slug}`}>
          <Button
            size="md"
            color="secondary gray"
            variant="filled"
            className={{ root: styles.playButton }}
          >
            Play Contest
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ContestCard;
