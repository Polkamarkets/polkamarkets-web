import { ReactNode, useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Hero } from 'ui';

import Breadcrumb from 'components/Breadcrumb';
import { Button } from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';

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
      components={{
        Header: () => (
          <Hero
            className="pm-p-home__hero"
            image="https://polkamarkets.infura-ipfs.io/ipfs/QmVk9KtoD8bhGCcviDYLjeVth9JBbjYpzSbyoVrg4j89FZ"
          >
            <div className="pm-p-home__hero__breadcrumb">
              <Icon name="Moonriver" />
              <Text
                as="span"
                scale="tiny-uppercase"
                fontWeight="semibold"
                style={{
                  color: '#F4B731'
                }}
              >
                DAI
              </Text>
              <span className="pm-c-divider--circle" />
              <Breadcrumb>
                <Breadcrumb.Item>Sports</Breadcrumb.Item>
                <Breadcrumb.Item>Soccer</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <Text
              as="h2"
              fontWeight="bold"
              scale="heading-large"
              color="light"
              className="pm-p-home__hero__heading"
            >
              What will be the result of Man. Utd vs Man. City on 21st December
              2021
            </Text>
            <Button size="sm">View Market</Button>
          </Hero>
        )
      }}
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
