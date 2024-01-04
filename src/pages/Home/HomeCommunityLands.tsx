import { CSSProperties, useCallback } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import formatImageAlt from 'helpers/formatImageAlt';
import isNull from 'lodash/isNull';
import type { Land } from 'types/land';
import { Avatar } from 'ui';

import { InfoIcon } from 'assets/icons';

import { AlertMini, Tooltip } from 'components';

import styles from './Home.module.scss';

type CommunityLandProps = {
  land: Land;
};

function CommunityLand({ land }: CommunityLandProps) {
  const altFormatter = useCallback(formatImageAlt, []);

  return (
    <Link to={`/${land.slug}`} className={styles.communityLand}>
      <div className={styles.communityLandContent}>
        <div
          className={styles.communityLandContentHero}
          style={
            {
              '--background-image': `url(${land.bannerUrl})`
            } as CSSProperties
          }
        />
        <div className={styles.communityLandContentBody}>
          <Avatar
            $size="xs"
            $radius="lg"
            src={!isNull(land.imageUrl) ? land.imageUrl : undefined}
            alt={land.title}
            altFormatter={altFormatter}
            className={styles.communityLandContentAvatar}
            fallbackClassName={styles.communityLandContentAvatarFallback}
          />
          <h4 className={styles.communityLandContentTitle}>{land.title}</h4>
        </div>
      </div>
      <div className={styles.communityLandFooter}>
        <div className={styles.communityLandFooterStats}>
          {land.users ? (
            <>
              <span className={styles.communityLandFooterStatsItem}>
                Members:
                <strong className="notranslate">{land.users}</strong>
              </span>
              <span
                className={classNames(
                  'pm-c-divider--circle',
                  styles.communityLandFooterStatsDivider
                )}
              />
            </>
          ) : null}
          <span className={styles.communityLandFooterStatsItem}>
            Tournaments:
            <strong className="notranslate">{land.tournaments.length}</strong>
          </span>
        </div>
      </div>
    </Link>
  );
}

type HomeCommunityLandsProps = {
  lands: Land[];
};

function HomeCommunityLands({ lands }: HomeCommunityLandsProps) {
  return (
    <div className={styles.communityLands}>
      <div className={styles.communityLandsHeader}>
        <h3 className={styles.communityLandsHeaderTitle}>Community Lands</h3>
        <Tooltip
          text="Foreland Communities that you can join to play their prediction contests for a chance to win rewards."
          position="top"
        >
          <InfoIcon />
        </Tooltip>
      </div>
      {!lands.length ? (
        <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-medium">
          <AlertMini
            style={{ border: 'none' }}
            styles="outline"
            variant="information"
            description="No Community Lands available at the moment."
          />
        </div>
      ) : (
        <ul className={styles.communityLandsList}>
          {lands.map(land => (
            <li key={land.slug}>
              <CommunityLand land={land} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomeCommunityLands;
