import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import formatImageAlt from 'helpers/formatImageAlt';
import { Land } from 'types/land';
import { Avatar, Button } from 'ui';

import styles from './LandCard.module.scss';

type LandCardProps = {
  land: Land;
};

function LandCard({ land }: LandCardProps) {
  const avatarAltFormatter = useCallback(formatImageAlt, []);

  const stats = useMemo(() => {
    const members = land.users || 0;
    const contests = land.tournaments.length;
    const questions = land.tournaments
      .map(tournament => tournament.markets?.length || 0)
      .reduce((a, b) => a + b, 0);

    return {
      members,
      contests,
      questions
    };
  }, [land.tournaments, land.users]);

  return (
    <div className={styles.root}>
      
      <div
        className={styles.banner}
        style={
          {
            '--background-image': `url(${land.bannerUrl})`
          } as React.CSSProperties
        }
      />
      <div className={styles.info}>
        <Avatar
          $size="xs"
          $radius="lg"
          src={!(land.imageUrl === null) ? land.imageUrl : undefined}
          alt={land.title}
          altFormatter={avatarAltFormatter}
          className={styles.infoAvatar}
          fallbackClassName={styles.infoAvatarFallback}
        />
        <h3 className={styles.infoName}>{land.title}</h3>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerStats}>
          <span className={styles.footerStatsItem}>
            Members <strong className="notranslate">{stats.members}</strong>
          </span>
          <span className={styles.footerStatsItem}>
            Contests <strong className="notranslate">{stats.contests}</strong>
          </span>
          <span className={styles.footerStatsItem}>
            Questions <strong className="notranslate">{stats.questions}</strong>
          </span>
        </div>
      </div>
      <div className={styles.overlay}>
        <Link to={`/${land.slug}`}>
          <Button
            size="md"
            color="secondary gray"
            variant="filled"
            className={{ root: styles.viewButton }}
          >
            View Land
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LandCard;
