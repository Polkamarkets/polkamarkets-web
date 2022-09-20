import { useState } from 'react';

import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';

import { Dropdown, Text } from 'components/new';

import { useNetwork } from 'hooks';

import ProfileLeaderboardRanks from './ProfileLeaderboardRanks';
import ProfilePredictionStatistics from './ProfilePredictionStatistics';
import { LeaderboardRanks, PredictionStatistics } from './types';

type Timeframe = '1w' | '1m' | 'at';

type ProfileYourStatsProps = {
  address: string;
};

function ProfileYourStats({ address }: ProfileYourStatsProps) {
  // Custom hooks
  const { network } = useNetwork();
  const { currency } = network;

  // Local state
  const [timeframe, setTimeframe] = useState<Timeframe>('1w');

  const { data: leaderboard, isLoading } = useGetLeaderboardByAddressQuery({
    address,
    networkId: network.id,
    timeframe
  });

  const ticker = currency.symbol || currency.ticker;

  if (isLoading || !leaderboard) return null;

  const ranks: LeaderboardRanks = {
    rankByVolume: leaderboard.rank.volume,
    rankByMarketsCreated: leaderboard.rank.marketsCreated,
    rankByWonPredictions: leaderboard.rank.claimWinningsCount,
    rankByLiquidityAdded: leaderboard.rank.tvlLiquidity
  };

  const statistics: PredictionStatistics = {
    volume: leaderboard.volume,
    marketsCreated: leaderboard.marketsCreated,
    wonPredictions: leaderboard.claimWinningsCount,
    liquidityAdded: leaderboard.liquidity
  };

  return (
    <div className="flex-column gap-5">
      <div className="flex-row justify-space-between align-center padding-top-5">
        <Text as="h2" fontSize="heading-2" fontWeight="semibold" color="1">
          Statistics
        </Text>
        <Dropdown
          key="timeframe"
          defaultOption="1w"
          options={[
            { label: 'Weekly', value: '1w' },
            { label: 'Monthly', value: '1m' },
            { label: 'All-time', value: 'at' }
          ]}
          onSelect={value => setTimeframe(value)}
        />
      </div>
      <div className="pm-p-profile-your-stats">
        <ProfileLeaderboardRanks ranks={ranks} isLoading={false} />
        <ProfilePredictionStatistics
          statistics={statistics}
          ticker={ticker}
          isLoading={false}
        />
      </div>
    </div>
  );
}

export default ProfileYourStats;
