import { useMemo } from 'react';

import { preparePredictionStatisticsRow } from './prepare';
import ProfileStats from './ProfileStats';
import { PredictionStatistics, PredictionStatisticsColumn } from './types';

const columns: PredictionStatisticsColumn[] = [
  {
    key: 'volume',
    title: 'Volume'
  },
  {
    key: 'marketsCreated',
    title: 'Markets Created'
  },
  {
    key: 'wonPredictions',
    title: 'Won Predictions'
  },
  {
    key: 'liquidityAdded',
    title: 'Liquidity Added'
  }
];

type ProfilePredictionStatisticsProps = {
  statistics: PredictionStatistics;
  ticker: string;
  isLoading: boolean;
};

function ProfilePredictionStatistics({
  statistics,
  ticker,
  isLoading
}: ProfilePredictionStatisticsProps) {
  const row = useMemo(
    () => preparePredictionStatisticsRow({ statistics, ticker }),
    [statistics, ticker]
  );

  return (
    <ProfileStats
      title="Prediction Statistics"
      columns={columns}
      row={row}
      isLoading={isLoading}
    />
  );
}

export default ProfilePredictionStatistics;
