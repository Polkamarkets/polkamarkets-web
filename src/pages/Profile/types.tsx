import type {
  GetLeaderboardByAddressData,
  GetPortfolioByAddressData,
  GetPortfolioFeedByAddressData
} from 'services/Polkamarkets/types';
import type { LeaderboardTimeframe } from 'types/leaderboard';
import type { Network } from 'types/network';

import type { TableMiniColumn, TableMiniRow } from 'components/new/TableMini';

// Leaderboard ranks
export type LeaderboardRanksColumn = TableMiniColumn;
export type LeaderboardRanksRow = TableMiniRow;
export type LeaderboardRanks = {
  rankByVolume: number;
  rankByMarketsCreated: number;
  rankByWonPredictions: number;
  rankByLiquidityAdded: number;
  rankByEarnings: number;
};

// Prediction statistics
export type PredictionStatisticsColumn = TableMiniColumn;
export type PredictionStatisticsRow = TableMiniRow;
export type PredictionStatistics = {
  volume: number;
  marketsCreated: number;
  wonPredictions: number;
  liquidityAdded: number;
  earnings: number;
};

export type ProfileAchievementsProps = {
  listHeight: number;
  data?: GetLeaderboardByAddressData;
  isLoading: boolean;
};
export type ProfileActivitiesProps = {
  listHeight: number;
  data?: GetPortfolioFeedByAddressData;
  isLoading: boolean;
};
export type ProfileSummaryProps = {
  address: string;
  isLoading: boolean;
  data?: GetPortfolioByAddressData;
  network: Network;
} & Partial<Record<'username' | 'avatar', string | null>>;

export type ProfileStatsProps = {
  isLoading: boolean;
  data?: GetPortfolioByAddressData;
  ticker: string;
};
export type ProfileYourStatsProps = {
  onTimeframe(arg: LeaderboardTimeframe): void;
  data?: GetLeaderboardByAddressData;
  isLoading: boolean;
  ticker: string;
};
