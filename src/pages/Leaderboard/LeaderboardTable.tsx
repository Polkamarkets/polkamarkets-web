import { useMemo } from 'react';

import { Table } from 'components/new';

import { useFantasyTokenTicker, useWindowDimensions } from 'hooks';

import {
  prepareLeaderboardTableRows,
  PrepareLeaderboardTableRowsArgs
} from './prepare';
import { LeaderboardTableColumn } from './types';

type LeaderboardTableProps = {
  loggedInUser?: string;
  columns: LeaderboardTableColumn[];
  ticker: string;
  isLoading: boolean;
} & Pick<PrepareLeaderboardTableRowsArgs, 'rows' | 'sortBy'>;

function LeaderboardTable({
  loggedInUser,
  columns,
  rows,
  ticker,
  sortBy,
  isLoading
}: LeaderboardTableProps) {
  const { height } = useWindowDimensions();
  const fantasyTokenTicker = useFantasyTokenTicker();

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

  const userIndex = useMemo(() => {
    if (loggedInUser) {
      const user = preparedRows.find(
        row => row.wallet.address === loggedInUser
      );

      if (user) {
        return preparedRows.indexOf(user);
      }
    }

    return undefined;
  }, [loggedInUser, preparedRows]);

  const tableHeight = Math.min(Math.ceil(height * 0.6), 900);

  return (
    <Table
      height={tableHeight}
      columns={columns}
      rows={preparedRows}
      isLoadingData={isLoading}
      customAction={
        userIndex
          ? { description: 'See your rank', index: userIndex }
          : undefined
      }
      rowClasses={['notranslate']}
    />
  );
}

export default LeaderboardTable;
