import { useMemo } from 'react';

import { features } from 'config';
import omit from 'lodash/omit';

import { prepareLeaderboardRanksRow } from './prepare';
import ProfileStats from './ProfileStats';
import { LeaderboardRanks, LeaderboardRanksColumn } from './types';

const columns: LeaderboardRanksColumn[] = [
  {
    key: 'rankByVolume',
    title: 'Rank (By Volume)'
  },
  {
    key: 'rankByMarketsCreated',
    title: 'Rank (By Markets Created)'
  },
  {
    key: 'rankByWonPredictions',
    title: 'Rank (By Won Predictions)'
  },
  {
    key: 'rankByLiquidityAdded',
    title: 'Rank (By Liquidity Added)'
  },
  {
    key: 'rankByEarnings',
    title: 'Rank (By Earnings)'
  }
];

type ProfileLeaderboardRanksProps = {
  ranks: LeaderboardRanks;
  isLoading: boolean;
};

function ProfileLeaderboardRanks({
  ranks,
  isLoading
}: ProfileLeaderboardRanksProps) {
  const row = useMemo(() => prepareLeaderboardRanksRow(ranks), [ranks]);

  const filteredColumns = useMemo(
    () =>
      features.fantasy.enabled
        ? columns.filter(
            column =>
              !['rankByMarketsCreated', 'rankByLiquidityAdded'].includes(
                column.key
              )
          )
        : columns,
    []
  );

  const filteredRow = useMemo(
    () =>
      features.fantasy.enabled
        ? omit(row, ['rankByMarketsCreated', 'rankByLiquidityAdded'])
        : row,
    [row]
  );

  return (
    <ProfileStats
      title="Leaderboard Ranks"
      columns={filteredColumns}
      row={filteredRow}
      isLoading={isLoading}
    />
  );
}

export default ProfileLeaderboardRanks;
