import {
  rankColumnRender,
  volumeColumnRender,
  liquidityColumnRender
} from 'pages/Leaderboard/prepare';

import {
  LeaderboardRanks,
  LeaderboardRanksRow,
  PredictionStatistics,
  PredictionStatisticsRow
} from './types';

function prepareLeaderboardRanksRow(
  ranks: LeaderboardRanks
): LeaderboardRanksRow {
  return {
    rankByVolume: {
      value: {
        place: ranks.rankByVolume,
        change: 'stable'
      },
      render: rankColumnRender
    },
    rankByMarketsCreated: {
      value: {
        place: ranks.rankByMarketsCreated,
        change: 'stable'
      },
      render: rankColumnRender
    },
    rankByWonPredictions: {
      value: {
        place: ranks.rankByWonPredictions,
        change: 'stable'
      },
      render: rankColumnRender
    },
    rankByLiquidityAdded: {
      value: {
        place: ranks.rankByLiquidityAdded,
        change: 'stable'
      },
      render: rankColumnRender
    }
  };
}

type PreparePredictionStatisticsRowArgs = {
  statistics: PredictionStatistics;
  ticker: string;
};

function preparePredictionStatisticsRow({
  statistics,
  ticker
}: PreparePredictionStatisticsRowArgs): PredictionStatisticsRow {
  return {
    volume: {
      value: {
        volume: statistics.volume,
        ticker
      },
      render: volumeColumnRender
    },
    marketsCreated: {
      value: statistics.marketsCreated
    },
    wonPredictions: {
      value: statistics.wonPredictions
    },
    liquidityAdded: {
      value: {
        liquidity: statistics.liquidityAdded,
        ticker
      },
      render: liquidityColumnRender
    }
  };
}

export { prepareLeaderboardRanksRow, preparePredictionStatisticsRow };
