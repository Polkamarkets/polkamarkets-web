import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { features } from 'config';
import isError404 from 'helpers/isError404';
import {
  useGetLeaderboardByAddressQuery,
  useGetPortfolioByAddressQuery,
  useGetPortfolioFeedByAddressQuery
} from 'services/Polkamarkets';
import type { LeaderboardTimeframe } from 'types/leaderboard';
import { Container } from 'ui';

import PortfolioTabs from 'pages/Portfolio/PortfolioTabs';

import {
  useAppSelector,
  useFantasyTokenTicker,
  useLanguage,
  useNetwork
} from 'hooks';

import { getPortfolioFeedByAddressTransformResponse } from './prepare';
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

  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const userAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const portfolio = useGetPortfolioByAddressQuery({
    address,
    networkId: network.id
  });

  const {
    data: leaderboard,
    isFetching: isFetchingLeaderboard,
    isLoading: isLoadingLeaderboard
  } = useGetLeaderboardByAddressQuery({
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

  if (isError404(portfolio.error) || isError404(activity.error)) {
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
            username: leaderboard?.username,
            avatar: leaderboard?.userImageUrl,
            bankrupt: leaderboard?.bankrupt
          })}
        />
        <ProfileSummaryStat
          isLoading={portfolio.isLoading}
          ticker={fantasyTokenTicker}
          data={portfolio.data}
          leaderboard={leaderboard}
        />
      </div>
      <ProfileYourStats
        onTimeframe={setTimeframe}
        isLoading={isLoadingLeaderboard}
        ticker={fantasyTokenTicker}
        data={leaderboard}
      />
      <div className="pm-p-profile-lists">
        {/* {ui.achievements.enabled && (
          <ProfileAchievements
            listHeight={LIST_HEIGHT}
            isLoading={leaderboard.isLoading}
            data={leaderboard.data}
          />
        )} */}
        <ProfileActivities
          isLoading={activity.isLoading}
          listHeight={LIST_HEIGHT}
          data={activity.data}
        />
      </div>
      <div className="pm-p-profile-portfolio">
        <PortfolioTabs
          user={{
            address: leaderboard?.user,
            isLoggedIn: isLoggedIn && userAddress === leaderboard?.user
          }}
          isLoadingUser={isFetchingLeaderboard || isLoadingLeaderboard}
        />
      </div>
    </Container>
  );
}
