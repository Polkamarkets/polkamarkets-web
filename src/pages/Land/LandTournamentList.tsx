import { CSSProperties, useCallback } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import dayjs from 'dayjs';
import formatImageAlt from 'helpers/formatImageAlt';
import isNull from 'lodash/isNull';
import type { Land } from 'types/land';
import type { Tournament } from 'types/tournament';
import { Avatar } from 'ui';

import { AlertMini, Pill } from 'components';

import styles from './LandTournamentList.module.scss';

type LandTournamentListItemProps = {
  tournament: Omit<Tournament, 'land'>;
};

function LandTournamentListItem({ tournament }: LandTournamentListItemProps) {
  const altFormatter = useCallback(formatImageAlt, []);

  const isTournamentEnded = dayjs()
    .utc()
    .isAfter(dayjs(tournament.expiresAt).utc());

  return (
    <Link to={`/tournaments/${tournament.slug}`} className={styles.tournament}>
      <div
        className={styles.tournamentContent}
        style={
          {
            '--background-image': `url(${tournament.imageUrl})`
          } as CSSProperties
        }
      >
        <Avatar
          $size="md"
          $radius="sm"
          src={!isNull(tournament.imageUrl) ? tournament.imageUrl : undefined}
          alt={tournament.title}
          altFormatter={altFormatter}
          className={styles.tournamentContentAvatar}
          fallbackClassName={styles.tournamentContentAvatarFallback}
        />
        <div>
          <h4 className={styles.tournamentContentTitle}>{tournament.title}</h4>
          <div className={styles.tournamentContentStats}>
            {!isTournamentEnded ? (
              <span className={styles.tournamentContentStatsItem}>
                Ends At:
                <strong className="notranslate">
                  {dayjs(tournament.expiresAt).utc(true).format('MMM D, YYYY')}
                </strong>
              </span>
            ) : (
              <Pill badge color="primary">
                Ended
              </Pill>
            )}
          </div>
        </div>
      </div>
      <div className={styles.tournamentFooter}>
        <div className={styles.tournamentFooterStats}>
          {tournament.markets ? (
            <>
              <span className={styles.tournamentFooterStatsItem}>
                Questions:
                <strong className="notranslate">
                  {tournament.markets.length}
                </strong>
              </span>
              <span
                className={classNames(
                  'pm-c-divider--circle',
                  styles.tournamentFooterStatsDivider
                )}
              />
            </>
          ) : null}
          <span className={styles.tournamentFooterStatsItem}>
            Members:
            <strong className="notranslate">{tournament.users}</strong>
          </span>
          {tournament.rewards ? (
            <>
              <span
                className={classNames(
                  'pm-c-divider--circle',
                  styles.tournamentFooterStatsDivider
                )}
              />
              <span className={styles.tournamentFooterStatsItem}>
                Rewards:
                <strong className="notranslate">{1}</strong>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

type LandTournamentListProps = {
  tournaments: Land['tournaments'];
};

function LandTournamentList({ tournaments }: LandTournamentListProps) {
  return (
    <div className={styles.root}>
      <div className={styles.rootHeader}>
        <h2 className={styles.rootTitle}>Tournaments</h2>
      </div>
      {!tournaments.length ? (
        <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-medium">
          <AlertMini
            style={{ border: 'none' }}
            styles="outline"
            variant="information"
            description="No tournaments available at the moment."
          />
        </div>
      ) : (
        <ul className={styles.list}>
          {tournaments.map(tournament => (
            <li key={tournament.id}>
              <LandTournamentListItem tournament={tournament} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LandTournamentList;
