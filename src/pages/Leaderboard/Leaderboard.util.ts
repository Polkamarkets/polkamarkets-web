import type {
  GetLeaderboardBaseData,
  GetLeaderboardByTimeframeData,
  GetLeaderboardGroupBySlugData
} from 'services/Polkamarkets/types';
import type { LeaderboardGroup } from 'types/leaderboard';

import type { CreateLeaderboardGroupFormValues } from 'components/CreateLeaderboardGroupForm';

export const leaderboardColumns = [
  'volumeEur',
  'marketsCreated',
  'transactions',
  'balance',
  'wonPredictions',
  'netVolume',
  'netLiquidity'
];

export const defaultLeaderboardColumns = [
  'volumeEur',
  'marketsCreated',
  'wonPredictions',
  'netVolume',
  'netLiquidity'
];

const emptyLeaderboardRowWithoutUser: Omit<
  GetLeaderboardBaseData,
  'user' | 'username' | 'userImageUrl'
> = {
  marketsCreated: 0,
  volumeEur: 0,
  tvlVolumeEur: 0,
  liquidityEur: 0,
  tvlLiquidityEur: 0,
  claimWinningsCount: 0,
  transactions: 0,
  erc20Balance: 0,
  achievements: []
};

const sanitizePreviousCreateLeaderboardFormValues = (
  values: GetLeaderboardGroupBySlugData
): CreateLeaderboardGroupFormValues => {
  return {
    name: values.title,
    image: {
      file: undefined,
      hash: values.imageUrl ? values.imageUrl.split('/').pop() || '' : '',
      isUploaded: false
    },
    addresses: values.users.join('\n'),
    imageUrl: values.imageUrl
  };
};

function buildLeaderboardData(
  isLoadingLeaderboardGroup: boolean,
  leaderboardGroup?: LeaderboardGroup,
  leaderboardByTimeframe?: GetLeaderboardByTimeframeData
): GetLeaderboardByTimeframeData {
  if (leaderboardByTimeframe && leaderboardGroup) {
    return leaderboardGroup.users.map(user => {
      const userInLeaderboardByTimeframe = leaderboardByTimeframe.find(
        row => row.user.toLowerCase() === user.toLowerCase()
      );

      return (
        userInLeaderboardByTimeframe || {
          user,
          ...emptyLeaderboardRowWithoutUser
        }
      );
    });
  }

  if (leaderboardByTimeframe && !isLoadingLeaderboardGroup) {
    return leaderboardByTimeframe;
  }

  return [];
}

export {
  emptyLeaderboardRowWithoutUser,
  sanitizePreviousCreateLeaderboardFormValues,
  buildLeaderboardData
};
