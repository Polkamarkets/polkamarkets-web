import { TableMiniColumn, TableMiniRow } from 'components/new/TableMini';

// Leaderboard ranks
export type LeaderboardRanksColumn = TableMiniColumn;
export type LeaderboardRanksRow = TableMiniRow;
export type LeaderboardRanks = {
  rankByVolume: number;
  rankByMarketsCreated: number;
  rankByWonPredictions: number;
  rankByLiquidityAdded: number;
};

// Prediction statistics
export type PredictionStatisticsColumn = TableMiniColumn;
export type PredictionStatisticsRow = TableMiniRow;
export type PredictionStatistics = {
  volume: number;
  marketsCreated: number;
  wonPredictions: number;
  liquidityAdded: number;
};
