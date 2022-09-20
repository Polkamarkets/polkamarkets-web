import { ReactNode, useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

type VirtualizedListProps<T> = {
  height: number | string;
  data?: T[];
  itemContent: (_index: number, _item: T) => ReactNode;
  atBottom?: (_atBottom: boolean) => void;
};

function VirtualizedList<T>({
  height,
  data = [],
  itemContent,
  atBottom
}: VirtualizedListProps<T>) {
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0
  });

  const lastIndex = data.length - 1;

  const isAtBottom =
    visibleRange.startIndex <= lastIndex && lastIndex <= visibleRange.endIndex;

  useEffect(() => {
    atBottom?.(isAtBottom);
  }, [atBottom, isAtBottom]);

  return (
    <Virtuoso
      style={{
        height
      }}
      data={data}
      itemContent={itemContent}
      rangeChanged={setVisibleRange}
    />
  );
}

export default VirtualizedList;
