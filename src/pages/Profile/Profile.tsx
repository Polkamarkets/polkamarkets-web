import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { features, ui } from 'config';
import {
  useGetLeaderboardByAddressQuery,
  useGetPortfolioByAddressQuery,
  useGetPortfolioFeedByAddressQuery
} from 'services/Polkamarkets';
import type { LeaderboardTimeframe } from 'types/leaderboard';
import { Container } from 'ui';

import { useFantasyTokenTicker, useLanguage, useNetwork } from 'hooks';

import { getPortfolioFeedByAddressTransformResponse } from './prepare';
import ProfileAchievements from './ProfileAchievements';
import ProfileActivities from './ProfileActivities';
import ProfileError from './ProfileError';
import ProfileSummary from './ProfileSummary';
import ProfileSummaryStat from './ProfileSummaryStat';
import ProfileYourStats from './ProfileYourStats';

const LIST_HEIGHT = Math.min(Math.ceil(window.innerHeight * 0.5), 700);

export default function Profile() {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('at');
  const { address } = useParams<Record<'address', string>>();
  const { network } = useNetwork();
  const fantasyTokenTicker = useFantasyTokenTicker() || '€';
  const language = useLanguage();

  const portfolio = useGetPortfolioByAddressQuery({
    address,
    networkId: network.id
  });
  const leaderboard = useGetLeaderboardByAddressQuery({
    address,
    networkId: network.id,
    timeframe
  });
  const portfolioFeed = useGetPortfolioFeedByAddressQuery({
    address,
    networkId: network.id
  });

  const activity = useMemo(
    () => ({
      ...portfolioFeed,
      data: getPortfolioFeedByAddressTransformResponse(
        portfolioFeed.data || [],
        language
      )
    }),
    [language, portfolioFeed]
  );

  if (
    [portfolio, activity].some(
      ({ error }) =>
        typeof error === 'object' && 'status' in error && error.status === 404
    )
  ) {
    return <ProfileError username={address} />;
  }

  return (
    <Container className="pm-p-profile max-width-screen-xl">
      <div className="pm-p-profile-summary">
        <ProfileSummary
          address={address}
          data={portfolio.data}
          isLoading={portfolio.isLoading}
          network={network}
          {...(features.fantasy.enabled && {
            username: leaderboard.data?.username,
            avatar: leaderboard.data?.userImageUrl
          })}
        />
        <ProfileSummaryStat
          isLoading={portfolio.isLoading}
          ticker={fantasyTokenTicker}
          data={portfolio.data}
        />
      </div>
      <ProfileYourStats
        onTimeframe={setTimeframe}
        isLoading={leaderboard.isLoading}
        ticker={fantasyTokenTicker}
        data={leaderboard.data}
      />
      <div className="pm-p-profile-lists margin-top-6">
        {ui.achievements.enabled && (
          <ProfileAchievements
            listHeight={LIST_HEIGHT}
            isLoading={leaderboard.isLoading}
            data={leaderboard.data}
          />
        )}
        <ProfileActivities
          isLoading={activity.isLoading}
          listHeight={LIST_HEIGHT}
          data={activity.data}
        />
      </div>
    </Container>
  );
}
