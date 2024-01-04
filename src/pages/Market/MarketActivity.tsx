import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { relativeTimeFromNow } from 'helpers/date';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import { useGetMarketFeedBySlugQuery } from 'services/Polkamarkets';
import { Avatar } from 'ui';

import { AlertMini, ScrollableArea } from 'components';
import { Text } from 'components/new';

import { useLanguage, useAppSelector } from 'hooks';

import { getMarketFeedBySlugTransformResponse } from './MarketActivity.utils';

const LIST_HEIGHT = Math.min(Math.ceil(window.innerHeight * 0.5), 700);

export default function MarketActivity() {
  const language = useLanguage();
  const marketSlug = useAppSelector(state => state.market.market.slug);

  const { data, isLoading } = useGetMarketFeedBySlugQuery({
    slug: marketSlug
  });

  const feed = useMemo(() => {
    return getMarketFeedBySlugTransformResponse(data || [], language);
  }, [data, language]);

  return (
    <div className="width-full border-radius-small border-solid border-1">
      {(() => {
        if (isLoading)
          return (
            <div
              className="flex-row justify-center align-center padding-y-10 padding-x-6 border-solid border-1 border-radius-medium"
              style={{ height: LIST_HEIGHT }}
            >
              <span className="spinner--primary" />
            </div>
          );
        if (!feed?.length)
          return (
            <AlertMini
              variant="default"
              description="No activities available."
            />
          );
        return (
          <ScrollableArea
            className="flex-column"
            scrollbarSize="sm"
            style={{ height: LIST_HEIGHT }}
            fullwidth
          >
            {feed.map((activity, index) => {
              return (
                <Link
                  key={`${activity.action}-${activity.user}-${activity.timestamp}`}
                  className={`pm-c-activity bg-${index % 2 === 0 ? '2' : '3'}`}
                  to={`/user/${activity.userSlug || activity.user}`}
                >
                  <div
                    className={`pm-c-activity__image--${activity.accentColor} border-radius-50`}
                  >
                    <Avatar
                      src={
                        !isNull(activity.imageUrl) &&
                        !isEmpty(activity.imageUrl)
                          ? activity.imageUrl
                          : undefined
                      }
                      alt={activity.user}
                      $size="md"
                      className="border-radius-50"
                    />
                  </div>
                  <div className="flex-column gap-3 width-full">
                    <Text
                      as="h1"
                      fontSize="body-4"
                      fontWeight="semibold"
                      transform="uppercase"
                      className={`pm-c-activity__action-title--${activity.accentColor} notranslate`}
                    >
                      {activity.actionTitle}
                    </Text>
                    <Text
                      className="pm-c-activity__title"
                      as="p"
                      fontSize="body-1"
                      fontWeight="semibold"
                      color="1"
                    >
                      {activity.marketTitle}
                    </Text>
                    <Text
                      as="span"
                      fontSize="body-4"
                      fontWeight="semibold"
                      transform="uppercase"
                      color="3"
                      className="notranslate"
                    >
                      {relativeTimeFromNow(activity.timestamp * 1000, language)}
                    </Text>
                  </div>
                </Link>
              );
            })}
          </ScrollableArea>
        );
      })()}
    </div>
  );
}
