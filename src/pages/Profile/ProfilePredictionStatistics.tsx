import { useMemo } from 'react';

import { features } from 'config';
import omit from 'lodash/omit';

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
  },
  {
    key: 'earnings',
    title: 'Earnings'
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

  const filteredColumns = useMemo(
    () =>
      features.fantasy.enabled
        ? columns.filter(
            column => !['marketsCreated', 'liquidityAdded'].includes(column.key)
          )
        : columns,
    []
  );

  const filteredRow = useMemo(
    () =>
      features.fantasy.enabled
        ? omit(row, ['marketsCreated', 'liquidityAdded'])
        : row,
    [row]
  );

  return (
    <ProfileStats
      title="Prediction Statistics"
      columns={filteredColumns}
      row={filteredRow}
      isLoading={isLoading}
    />
  );
}

export default ProfilePredictionStatistics;
