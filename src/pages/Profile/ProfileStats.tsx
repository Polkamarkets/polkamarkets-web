import { memo } from 'react';

import every from 'lodash/every';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';

import { AlertMini } from 'components';
import TableMini, {
  TableMiniColumn,
  TableMiniRow
} from 'components/new/TableMini';

type ProfileStatsProps = {
  title: string;
  columns: TableMiniColumn[];
  row: TableMiniRow;
  isLoading: boolean;
  emptyDataDescription?: string;
};

function ProfileStats({
  title,
  columns,
  row,
  isLoading,
  emptyDataDescription = 'No data to show.'
}: ProfileStatsProps) {
  const isEmptyData =
    isEmpty(row) ||
    every(
      Object.values(row).map(v => v.value),
      isNull
    );

  return (
    <div className="flex-column gap-4 padding-6 width-full bg-3 border-radius-medium border-solid border-1">
      <h2 className="body semibold text-1">{title}</h2>
      {isLoading ? (
        <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
          <span className="spinner--primary" />
        </div>
      ) : null}
      {!isLoading && isEmptyData ? (
        <AlertMini
          style={{ border: 'none' }}
          styles="outline"
          variant="information"
          description={emptyDataDescription}
        />
      ) : null}
      {!isLoading && !isEmptyData ? (
        <TableMini columns={columns} row={row} />
      ) : null}
    </div>
  );
}

export default memo(ProfileStats);
