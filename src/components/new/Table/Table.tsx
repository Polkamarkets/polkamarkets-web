/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-curly-newline */
import { CSSProperties, ReactNode, useCallback, useRef, useState } from 'react';
import { ListItem, TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso';

import classNames from 'classnames';

import { ArrowUpSmallestIcon, ArrowDownSmallestIcom } from 'assets/icons';

import { AlertMini } from 'components';

export type TableColumnAlign = 'left' | 'center' | 'right';

export type TableColumn = {
  title: string;
  key: string;
  render?: (_value: any) => ReactNode;
  align: TableColumnAlign;
  width?: CSSProperties['width'];
};

export type TableRow = {
  key: string;
  highlight?: boolean;
  [key: string]: any;
};

type TableProps = {
  height: number;
  columns: TableColumn[];
  rows: TableRow[];
  isLoadingData?: boolean;
  emptyDataDescription?: string;
  customAction?: {
    description: string;
    index: number;
  };
};

function Table({
  height,
  columns,
  rows,
  isLoadingData = false,
  emptyDataDescription = 'No data to show.',
  customAction
}: TableProps) {
  const [atTop, setAtTop] = useState(true);
  const [indexInRenderedItems, setIndexInRenderedItems] = useState(false);
  const [indexPositon, setIndexPosition] = useState<
    ('up' | 'down') | undefined
  >();

  const virtuoso = useRef<TableVirtuosoHandle>(null);

  type ScrollToIndexArgs = {
    index: number;
    align?: 'start' | 'center' | 'end';
  };

  function scrollToIndex({ index, align = 'start' }: ScrollToIndexArgs) {
    if (virtuoso.current) {
      virtuoso.current?.scrollToIndex({
        index,
        align
      });
    }
  }

  const handleChangeItemsRendered = useCallback(
    (items: ListItem<TableRow>[]) => {
      if (customAction) {
        const { index } = customAction;

        const itemsIndexes = Object.values(items).map(item => item.index);
        const indexInItemsIndexes = itemsIndexes.includes(index);

        setIndexInRenderedItems(indexInItemsIndexes);

        if (!indexInItemsIndexes) {
          const isAbove = index > itemsIndexes[itemsIndexes.length - 1];

          setIndexPosition(isAbove ? 'down' : 'up');
        }
      }
    },
    [customAction]
  );

  return (
    <div className="relative width-full" style={{ overflowX: 'auto' }}>
      {!atTop ? (
        <div className="pm-c-table__action-overlay--top flex-row justify-center align-start">
          <button
            type="button"
            className="pm-c-table__action-button"
            onClick={() => scrollToIndex({ index: 0 })}
          >
            <ArrowUpSmallestIcon />
            Go to top
          </button>
        </div>
      ) : null}
      {customAction && !indexInRenderedItems ? (
        <div className="pm-c-table__action-overlay--bottom flex-row justify-center align-end">
          <button
            type="button"
            className="pm-c-table__action-button"
            onClick={() =>
              scrollToIndex({ index: customAction.index, align: 'center' })
            }
          >
            {indexPositon === 'up' ? (
              <ArrowUpSmallestIcon />
            ) : (
              <ArrowDownSmallestIcom />
            )}
            {customAction.description}
          </button>
        </div>
      ) : null}
      <TableVirtuoso
        ref={virtuoso}
        style={{ height }}
        className="width-full border-solid border-1"
        data={rows}
        totalCount={rows.length}
        atTopThreshold={height}
        atTopStateChange={setAtTop}
        itemsRendered={items => handleChangeItemsRendered(items)}
        components={{
          Table: ({ style, ...props }) => (
            <table
              {...props}
              className="width-full"
              style={{
                ...style,
                tableLayout: 'fixed',
                borderCollapse: 'collapse'
              }}
            />
          ),
          TableHead: props => (
            <thead
              {...props}
              style={{ position: 'sticky', zIndex: 10, top: '0px' }}
            />
          ),
          TableRow: props => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <tr
                {...props}
                className={classNames({
                  'bg-1 bg-3-on-hover': !row.highlight,
                  'bg-primary-10': row.highlight,
                  'border-solid-top border-1': true
                })}
              />
            );
          },
          EmptyPlaceholder: () => {
            return (
              <div className="absolute flex-row justify-center align-center width-full margin-top-12 padding-y-12 padding-x-4">
                {!isLoadingData ? (
                  <AlertMini
                    style={{ border: 'none' }}
                    styles="outline"
                    variant="information"
                    description={emptyDataDescription}
                  />
                ) : (
                  <div className="spinner--primary" />
                )}
              </div>
            );
          }
        }}
        fixedHeaderContent={() => (
          <tr className="border-solid-bottom border-1">
            {columns?.map(column => (
              <th
                key={column.key}
                scope="col"
                className={`bg-3 padding-y-4 padding-x-5 tiny bold text-3 align-middle whitespace-nowrap text-${column.align}`}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        )}
        itemContent={(_index, row) => {
          return columns.map(column => (
            <td
              key={`${column.key}${row.key}`}
              className={`padding-y-6 padding-x-5 caption semibold text-1 align-middle whitespace-normal text-${column.align}`}
            >
              {column.render ? column.render(row[column.key]) : row[column.key]}
            </td>
          ));
        }}
      />
    </div>
  );
}

export default Table;
