import { Fragment, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { environment, ui } from 'config';
import isEmpty from 'lodash/isEmpty';
import { Tournament } from 'types/tournament';
import { Avatar, Container, useTheme } from 'ui';

import { Button, ButtonText, Icon, Share, Tooltip } from 'components';

import { useTruncatedText } from 'hooks';

import styles from './TournamentHero.module.scss';
import {
  getDescriptionItems,
  matchesDynamicDescription
} from './TournamentHero.utils';

type TournamentHeroProps = {
  landName?: string;
  landSlug?: string;
  landImageUrl?: string | null;
  landBannerUrl?: string | null;
  tournamentName?: string;
  tournamentDescription?: string;
  tournamentSlug?: string;
  tournamentImageUrl?: string | null;
  topUsers?: ReactNode;
  questions: number;
  users?: number;
  rewards?: Tournament['rewards'];
  criteria?: 'Won predictions' | 'Earnings';
  rules?: Tournament['rules'];
};

export default function TournamentHero({
  landName,
  landSlug,
  landImageUrl,
  landBannerUrl,
  tournamentName,
  tournamentDescription,
  tournamentSlug,
  tournamentImageUrl,
  topUsers,
  questions,
  users,
  rewards,
  criteria,
  rules
}: TournamentHeroProps) {
  const theme = useTheme();
  const {
    text: truncatedTournamentDescription,
    truncated,
    setTruncated
  } = useTruncatedText(tournamentDescription || '', 156);

  const isHomepage =
    environment.HOMEPAGE_URL &&
    environment.HOMEPAGE_URL.includes(window.location.pathname);

  const isDynamicDescription = matchesDynamicDescription(
    tournamentDescription || ''
  );

  const dynamicDescriptionItems = isDynamicDescription
    ? getDescriptionItems(tournamentDescription || '')
    : [];

  return (
    <Container className={styles.wrapper}>
      <div className={styles.root}>
        <div className={styles.rootHeader}>
          <div className={styles.rootHeaderNavigation}>
            {!isHomepage ? (
              <Link to={landSlug ? `/${landSlug}` : '/tournaments'}>
                <Button className={styles.rootHeaderNavigationButton}>
                  <Icon name="Arrow" title="Back to land" />
                </Button>
              </Link>
            ) : null}

            {landName && !isHomepage ? (
              <h4 className={styles.rootHeaderNavigationText}>{landName}</h4>
            ) : null}
          </div>
          <div className={styles.rootHeaderActions}>
            {tournamentSlug ? (
              <Share
                id={tournamentSlug}
                className={styles.rootHeaderActionsButton}
              />
            ) : null}
          </div>
        </div>
        <div
          style={
            {
              '--background-image': `url(${landBannerUrl || ui.hero.image})`
            } as CSSProperties
          }
          className={`pm-p-home__hero ${styles.rootHero}`}
        >
          {theme.device.isDesktop && tournamentImageUrl ? (
            <Avatar
              $radius="md"
              src={tournamentImageUrl}
              alt={tournamentName}
              className={styles.rootHeroAvatar}
            />
          ) : null}
          <div className={styles.rootHeroContent}>
            <div>
              <div
                className={classNames('flex-row align-center gap-5', {
                  'margin-bottom-3': !theme.device.isDesktop
                })}
              >
                {!theme.device.isDesktop && tournamentImageUrl ? (
                  <Avatar
                    $radius="md"
                    src={tournamentImageUrl}
                    alt={tournamentName}
                    className={styles.rootHeroAvatar}
                  />
                ) : null}
                <div>
                  <Link
                    className={styles.rootHeroContentLand}
                    to={landSlug ? `/${landSlug}` : '/tournaments'}
                  >
                    {landImageUrl ? (
                      <Avatar
                        $radius="lg"
                        src={landImageUrl}
                        alt={landName}
                        className={styles.rootHeroContentLandAvatar}
                      />
                    ) : null}
                    {landName ? (
                      <h4 className={styles.rootHeroContentLandName}>
                        {landName}
                      </h4>
                    ) : null}
                  </Link>
                  {tournamentName ? (
                    <h2 className={styles.rootHeroContentName}>
                      {tournamentName}
                    </h2>
                  ) : null}
                </div>
              </div>
              {isEmpty(dynamicDescriptionItems) ? (
                <>
                  {tournamentDescription ? (
                    <p className={styles.rootHeroContentDescription}>
                      {truncatedTournamentDescription}
                    </p>
                  ) : null}
                  {truncated ? (
                    <ButtonText
                      size="sm"
                      color="primary"
                      onClick={() => setTruncated(false)}
                    >
                      View more
                    </ButtonText>
                  ) : null}
                </>
              ) : (
                <div className={styles.rootHeroContentDescription}>
                  {dynamicDescriptionItems.map(item => (
                    <Fragment key={item.text}>
                      {item.isLink ? (
                        <a
                          className={classNames({
                            [styles.rootHeroContentDescriptionItemLinkDefault]:
                              !item.color || item.color === 'default',
                            [styles.rootHeroContentDescriptionItemLinkPrimary]:
                              item.color === 'primary',
                            [styles.rootHeroContentDescriptionItemLinkUnderline]:
                              item.underline
                          })}
                          href={item.url!}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.text}
                        </a>
                      ) : (
                        item.text
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
            {topUsers || null}
          </div>
        </div>
        <div className={styles.rootFooter}>
          <div className={styles.rootFooterStats}>
            <div className={styles.rootFooterStatsGroup}>
              <span className={styles.rootFooterStatsItem}>
                Questions: <strong>{questions}</strong>
              </span>
              {users ? (
                <>
                  <span
                    className={classNames(
                      'pm-c-divider--circle',
                      styles.rootFooterStatsDivider
                    )}
                  />
                  <span className={styles.rootFooterStatsItem}>
                    Users: <strong>{users}</strong>
                  </span>
                </>
              ) : null}
            </div>
            {rewards ? (
              <>
                {theme.device.isDesktop ? (
                  <span
                    className={classNames(
                      'pm-c-divider--circle',
                      styles.rootFooterStatsDivider
                    )}
                  />
                ) : null}
                <p
                  className={classNames(
                    styles.rootFooterStatsItem,
                    styles.rootFooterStatsRewards
                  )}
                >
                  Rewards: <strong>{rewards}</strong>
                </p>
              </>
            ) : null}
          </div>
          <div className={styles.rootFooterStats}>
            <div className={styles.rootFooterStatsGroup}>
              {criteria ? (
                <span className={styles.rootFooterStatsItem}>
                  Criteria: <strong>{criteria}</strong>
                </span>
              ) : null}
              {rules ? (
                <>
                  <span
                    className={classNames(
                      'pm-c-divider--circle',
                      styles.rootFooterStatsDivider
                    )}
                  />
                  <Tooltip text={rules}>
                    <span className={styles.rootFooterStatsItem}>
                      <Icon
                        name="Todo"
                        className={styles.rootFooterStatsItemIcon}
                      />{' '}
                      <strong>Rules</strong>
                    </span>
                  </Tooltip>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
