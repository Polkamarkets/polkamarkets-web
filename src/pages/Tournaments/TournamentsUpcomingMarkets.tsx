import { useCallback, useMemo, useState } from 'react';
import type { VirtuosoProps } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import type { Market } from 'models/market';
import {
  getNetworkById,
  getCurrencyByTicker,
  getTokenByTicker
} from 'redux/ducks/market';

import { Carousel, PredictionCard } from 'components';

import styles from './TournamentsUpcomingMarkets.module.scss';

type HeaderProps = {
  expandable?: boolean;
  expanded?: boolean;
  onExpand?: (expand: boolean) => void;
  children?: React.ReactNode;
};

function Header({
  expandable = false,
  expanded = false,
  onExpand,
  children
}: HeaderProps) {
  return (
    <>
      <div className={styles.headerGroup}>
        <h2 className={styles.headerTitle}>Questions</h2>
        {expandable && !expanded ? (
          <button
            type="button"
            className={classNames('pm-c-button--xs', styles.headerButton)}
            onClick={() => onExpand?.(true)}
          >
            See All
          </button>
        ) : null}
        {expandable && expanded ? (
          <button
            type="button"
            className={classNames('pm-c-button--xs', styles.headerButton)}
            onClick={() => onExpand?.(false)}
          >
            Back
          </button>
        ) : null}
      </div>
      {children}
    </>
  );
}

type MarketListProps = Omit<
  VirtuosoProps<Market, unknown>,
  'useWindowScroll' | 'itemContent' | 'rangeChanged' | 'ref'
>;

function MarketList({ data }: MarketListProps) {
  return (
    <Virtuoso
      useWindowScroll
      itemContent={(index: number, market: Market) => (
        <PredictionCard
          market={market}
          $gutter={data && index !== data.length - 1}
        />
      )}
      data={data}
    />
  );
}

const CAROUSEL_SIZE = 8;

type TournamentsUpcomingMarketsProps = {
  markets: Market[];
};

function TournamentsUpcomingMarkets({
  markets
}: TournamentsUpcomingMarketsProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChangeExpanded = useCallback(
    (expand: boolean) => {
      setExpanded(expand);
    },
    [setExpanded]
  );

  const newMarkets = useMemo(() => {
    const marketsByState = [
      ...orderBy(
        markets.filter(question => question.state === 'open'),
        'createdAt',
        'desc'
      ),
      ...orderBy(
        markets.filter(question => question.state !== 'open'),
        'createdAt',
        'desc'
      )
    ];

    return marketsByState.map(market => {
      const network = getNetworkById(market.networkId);
      const ticker = market.token.wrapped
        ? network.currency.ticker
        : market.token.symbol;

      const tokenByTicker = getTokenByTicker(ticker);
      const currencyByTicker = getCurrencyByTicker(ticker);

      return {
        ...market,
        network,
        currency: network.currency,
        token: {
          ...market.token,
          ticker,
          iconName: (tokenByTicker || currencyByTicker).iconName
        },
        outcomes: market.outcomes.map(outcome => ({
          ...outcome,
          price: Number(outcome.price.toFixed(3))
        }))
      } as Market;
    });
  }, [markets]);

  const marketsVisibleInCarousel = useMemo(
    () => newMarkets.slice(0, CAROUSEL_SIZE),
    [newMarkets]
  );

  const expandable = newMarkets.length > CAROUSEL_SIZE;

  if (expandable && expanded) {
    return (
      <div>
        <div className={styles.header}>
          <Header
            expandable={expandable}
            expanded={expanded}
            onExpand={handleChangeExpanded}
          />
        </div>
        <MarketList data={newMarkets} />
      </div>
    );
  }

  return (
    <Carousel
      data={marketsVisibleInCarousel}
      emptyStateDescription="There are no available markets at the moment."
      Header={
        <Header
          expandable={expandable}
          expanded={expanded}
          onExpand={handleChangeExpanded}
        />
      }
    >
      {marketsVisibleInCarousel.map(market => (
        <PredictionCard
          itemID={market.slug}
          key={market.slug}
          market={market}
          className={styles.predictionCard}
          wrapperClassName="height-full"
          statsVisibility={{
            volume: {
              desktop: false
            }
          }}
        />
      ))}
    </Carousel>
  );
}

export default TournamentsUpcomingMarkets;
