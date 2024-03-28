import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import cn from 'classnames';
import { GetLeaderboardByTimeframeData } from 'services/Polkamarkets/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'ui/Table/Table';

import { Icon } from 'components';

import styles from './LandRankings.module.scss';

type LeaderBoardItem = {
  index: number;
  user: {
    name: string;
    imgUrl: string;
    address: string;
  };
  predictionsWon: number;
  earnings: string;
};

export const columns: ColumnDef<LeaderBoardItem>[] = [
  {
    accessorKey: 'index',
    header: ({ column }) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(styles.headerWithSort, {
          [styles.headerWithSortActive]: column.getIsSorted()
        })}
      >
        #{' '}
        <Icon
          name={column.getIsSorted() ? 'ChevronDown' : 'UnfoldMore'}
          size="sm"
          dir={column.getIsSorted() === 'asc' ? 'right' : undefined}
        />
      </div>
    )
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
      const parsedUserName =
        row.original.user.name ||
        `${row.original.user.address.substring(
          0,
          4
        )}...${row.original.user.address.substring(
          row.original.user.address.length - 4
        )}`;
      return (
        <div className={styles.userCell}>
          {(row.original.user.imgUrl && (
            <img
              className={styles.userImg}
              src={row.original.user.imgUrl}
              alt={row.original.user.name}
            />
          )) ||
            null}
          <span>{parsedUserName}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'predictionsWon',
    header: ({ column }) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(styles.headerWithSort, {
          [styles.headerWithSortActive]: column.getIsSorted()
        })}
      >
        Predictions Won{' '}
        <Icon
          name={column.getIsSorted() ? 'ChevronDown' : 'UnfoldMore'}
          size="sm"
          dir={column.getIsSorted() === 'asc' ? 'right' : undefined}
        />
      </div>
    ),
    meta: { className: styles.alignRight }
  },
  {
    accessorKey: 'earnings',
    header: ({ column }) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className={cn(styles.headerWithSort, {
          [styles.headerWithSortActive]: column.getIsSorted()
        })}
      >
        Earnings{' '}
        <Icon
          name={column.getIsSorted() ? 'ChevronDown' : 'UnfoldMore'}
          size="sm"
          dir={column.getIsSorted() === 'asc' ? 'right' : undefined}
        />
      </div>
    ),
    meta: { className: styles.alignRight }
  }
];

export type LandRankingsProps = { data: GetLeaderboardByTimeframeData };
export const LandRankings: React.FC<LandRankingsProps> = ({ data }) => {
  const mappedData = data.map(item => ({
    user: {
      name: item.username || '',
      address: item.user,
      imgUrl: item.userImageUrl || ''
    },
    predictionsWon: item.claimWinningsCount,
    earnings: Number(item.earningsEur).toFixed(2)
  }));

  mappedData.sort((a, b) => {
    if (a.predictionsWon < b.predictionsWon) return 1;
    if (a.predictionsWon > b.predictionsWon) return -1;
    if (a.earnings < b.earnings) return 1;
    if (a.earnings > b.earnings) return -1;
    return 0;
  });

  const table = useReactTable({
    data: mappedData.map((item, index) => ({
      ...item,
      index: index + 1
    })),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef?.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef?.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LandRankings;
