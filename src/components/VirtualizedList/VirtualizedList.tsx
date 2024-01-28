import { ReactNode, useState, useEffect } from 'react';
import { Virtuoso, Components } from 'react-virtuoso';

type VirtualizedListProps<T> = {
  height: number | string;
  data?: T[];
  components?: Components;
  itemContent: (_index: number, _item: T) => ReactNode;
  atBottom?: (_atBottom: boolean) => void;
  useWindowScroll?: boolean;
};

function VirtualizedList<T>({
  height,
  data = [],
  components = {},
  itemContent,
  atBottom,
  useWindowScroll
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
      components={components}
      style={{
        height
      }}
      data={data}
      itemContent={itemContent}
      rangeChanged={setVisibleRange}
      useWindowScroll={useWindowScroll}
    />
  );
}

export default VirtualizedList;
