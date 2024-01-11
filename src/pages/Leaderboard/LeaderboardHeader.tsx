import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import { Image, useTheme } from 'ui';

import {
  getDescriptionItems,
  matchesDynamicDescription
} from 'pages/Tournament/TournamentHero.utils';

import { Icon, Text } from 'components';

import classes from './LeaderboardHeader.module.scss';

type LeaderboardHeaderProps = {
  isTournament?: boolean;
  slug?: string;
  imageUrl: string | null;
  title: string;
  description?: string;
};

export default function LeaderboardHeader({
  isTournament,
  slug,
  imageUrl,
  title,
  description
}: LeaderboardHeaderProps) {
  const theme = useTheme();

  const isDynamicDescription = matchesDynamicDescription(description || '');

  const dynamicDescriptionItems = isDynamicDescription
    ? getDescriptionItems(description || '')
    : [];

  return (
    <header className={classes.root}>
      <nav className={classes.nav}>
        {isTournament && (
          <RouterLink
            to={`/tournaments/${slug}`}
            className={classes.navBackLink}
          >
            <span className={classes.navBack}>
              <Icon
                name="Arrow"
                title="Back to Tournament"
                size="sm"
                className={classes.navBackIcon}
              />
            </span>
            <Text
              as="span"
              scale="tiny-uppercase"
              className={classes.navBackLabel}
            >
              Back
            </Text>
          </RouterLink>
        )}
      </nav>
      <div className={classes.content}>
        {!isNull(imageUrl) && (
          <Image
            $size={theme.device.isDesktop ? 'lg' : 'md'}
            $radius={theme.device.isDesktop ? 'md' : 'sm'}
            className={classes.contentImage}
            src={imageUrl}
          />
        )}
        <div>
          <div className="align-center">
            <Text scale="caption" as="p" className={classes.contentCaption}>
              Leaderboard
            </Text>
            <Text scale="heading-large" fontWeight="regular" as="h2">
              {title}
            </Text>
          </div>
          {isEmpty(dynamicDescriptionItems) ? (
            <>
              {description ? (
                <Text scale="caption" as="p" className="whitespace-pre-line">
                  {description}
                </Text>
              ) : null}
            </>
          ) : (
            <Text scale="caption" as="p" className="whitespace-pre-line">
              {dynamicDescriptionItems.map(item => (
                <Fragment key={item.text}>
                  {item.isLink ? (
                    <a
                      className={classNames({
                        'text-primary': item.color === 'primary',
                        underline: item.underline
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
            </Text>
          )}
        </div>
      </div>
    </header>
  );
}
