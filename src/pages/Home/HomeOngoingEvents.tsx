import { CSSProperties, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import formatImageAlt from 'helpers/formatImageAlt';
import isNull from 'lodash/isNull';
import type { Tournament } from 'types/tournament';
import { Avatar } from 'ui';

import { InfoIcon } from 'assets/icons';

import { Carousel, Tooltip } from 'components';

import styles from './Home.module.scss';

type HomeOngoingEventsProps = {
  tournaments: Omit<Tournament, 'land'>[];
};

function HomeOngoingEvents({ tournaments }: HomeOngoingEventsProps) {
  const altFormatter = useCallback(formatImageAlt, []);

  const isEventEnded = (event: Omit<Tournament, 'land'>) =>
    dayjs().utc().isAfter(dayjs(event.expiresAt).utc());

  const ongoingEvents = useMemo(
    () => tournaments.filter(event => !isEventEnded(event)),
    [tournaments]
  );

  return (
    <Carousel
      Header={
        <div className={styles.ongoingEventsHeader}>
          <h3 className={styles.ongoingEventsHeaderTitle}>Ongoing Events</h3>
          <Tooltip
            text="Prediction Contests featured by Lands that are live and open to participation"
            position="top"
          >
            <InfoIcon />
          </Tooltip>
        </div>
      }
      data={ongoingEvents}
      emptyStateDescription="No Ongoing Events available at the moment."
    >
      {ongoingEvents.map(event => (
        <Link
          key={event.slug}
          to={`/tournaments/${event.slug}`}
          className={styles.ongoingEventsItem}
        >
          <div
            className={styles.ongoingEventsItemContent}
            style={
              {
                '--background-image': `url(${event.imageUrl})`
              } as CSSProperties
            }
          >
            <Avatar
              $size="md"
              $radius="sm"
              src={!isNull(event.imageUrl) ? event.imageUrl : undefined}
              alt={event.title}
              altFormatter={altFormatter}
              className={styles.ongoingEventsItemContentAvatar}
              fallbackClassName={styles.ongoingEventsItemContentAvatarFallback}
            />
            <div>
              <h4 className={styles.ongoingEventsItemContentTitle}>
                {event.title}
              </h4>
              <div className={styles.ongoingEventsItemContentStats}>
                <span className={styles.ongoingEventsItemContentStatsItem}>
                  Ends At:
                  <strong className="notranslate">
                    {dayjs(event.expiresAt).utc(true).format('MMM D, YYYY')}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </Carousel>
  );
}

export default HomeOngoingEvents;
