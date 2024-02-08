import { useCallback, useMemo } from 'react';

import { ui } from 'config';
import some from 'lodash/some';

import { InfoTooltip } from 'components';
import { TableMiniColumn } from 'components/new/TableMini';

import { useFantasyTokenTicker } from 'hooks';

import LeaderboardStats from './LeaderboardStats';
import {
  prepareLeaderboardTableRows,
  PrepareLeaderboardTableRowsArgs,
  prepareLeaderboardYourStatsRow
} from './prepare';

type LeaderboardYourStatsProps = {
  loggedInUser?: string;
  ticker: string;
  isLoading: boolean;
} & Pick<PrepareLeaderboardTableRowsArgs, 'rows' | 'sortBy'>;

function LeaderboardYourStats({
  loggedInUser,
  rows,
  sortBy,
  ticker,
  isLoading
}: LeaderboardYourStatsProps) {
  const fantasyTokenTicker = useFantasyTokenTicker();

  const earningsColumnRender = useCallback(
    () => (
      <span className="tiny-uppercase bold text-3">
        Earnings
        <InfoTooltip
          text={`Cumulative ${
            fantasyTokenTicker || ticker
          } gains from your open and traded predictions`}
        />
      </span>
    ),
    [fantasyTokenTicker, ticker]
  );

  const columns: TableMiniColumn[] = useMemo(
    () =>
      [
        {
          key: 'rank',
          title: 'Rank'
        },
        {
          key: 'volumeEur',
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
          key: 'transactions',
          title: 'Transactions'
        },
        {
          key: 'balance',
          title: 'Balance'
        },
        {
          key: 'netVolume',
          title: 'Net Volume'
        },
        {
          key: 'netLiquidity',
          title: 'Net Liquidity'
        },
        {
          key: 'earnings',
          title: 'Earnings',
          render: earningsColumnRender
        }
      ].filter(column =>
        ['rank', ...ui.leaderboard.columns].includes(column.key)
      ) as TableMiniColumn[],
    [earningsColumnRender]
  );

  const preparedRows = useMemo(
    () =>
      prepareLeaderboardTableRows({
        loggedInUser,
        rows,
        sortBy,
        ticker,
        fantasyTokenTicker
      }),
    [fantasyTokenTicker, loggedInUser, rows, sortBy, ticker]
  );

  const row = useMemo(
    () => prepareLeaderboardYourStatsRow(preparedRows),
    [preparedRows]
  );

  const userHasPlaceInLeaderboard = useMemo(
    () =>
      some(
        preparedRows.map(r => r.wallet.isLoggedInUser),
        item => item === true
      ),
    [preparedRows]
  );

  if (!isLoading && (!loggedInUser || !userHasPlaceInLeaderboard)) return null;

  return (
    <LeaderboardStats
      title="Your Stats"
      columns={columns}
      row={row}
      isLoading={isLoading}
    />
  );
}

export default LeaderboardYourStats;
