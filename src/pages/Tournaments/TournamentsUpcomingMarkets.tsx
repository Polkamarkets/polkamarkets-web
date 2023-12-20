import {
  ContextType,
  useCallback,
  useContext,
  useMemo,
  useState,
  WheelEvent
} from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
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

import { AlertMini, Icon, PredictionCard } from 'components';

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
    <div className={styles.header}>
      <div className={styles.headerGroup}>
        <h2 className={styles.headerTitle}>
          {expanded ? 'Markets' : 'Upcoming'}
        </h2>
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
    </div>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.predictionsWithImageArrowButton}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      <Icon name="Chevron" dir="left" />
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.predictionsWithImageArrowButton}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <Icon name="Chevron" dir="right" />
    </button>
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

type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

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

  const openMarkets = useMemo(
    () =>
      markets
        .map(market => {
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
        })
        .filter(market => market.state === 'open'),
    [markets]
  );

  const marketsByVolume = useMemo(
    () => orderBy(openMarkets, 'volume', 'desc'),
    [openMarkets]
  );

  const marketsVisibleInCarousel = useMemo(
    () => marketsByVolume.slice(0, CAROUSEL_SIZE),
    [marketsByVolume]
  );

  const expandable = openMarkets.length > CAROUSEL_SIZE;

  const onWheel = useCallback(
    (apiObj: scrollVisibilityApiType, event: WheelEvent): void => {
      const isTouchpad =
        Math.abs(event.deltaX) !== 0 || Math.abs(event.deltaY) < 15;

      if (isTouchpad) {
        event.stopPropagation();
        return;
      }

      if (event.deltaY < 0) {
        apiObj.scrollNext();
      } else if (event.deltaY > 0) {
        apiObj.scrollPrev();
      }
    },
    []
  );

  if (!openMarkets.length)
    return (
      <div>
        <Header expandable={false} />
        <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-medium">
          <AlertMini
            style={{ border: 'none' }}
            styles="outline"
            variant="information"
            description="There are no available markets at the moment."
          />
        </div>
      </div>
    );

  if (expandable && expanded) {
    return (
      <div>
        <Header
          expandable={expandable}
          expanded={expanded}
          onExpand={handleChangeExpanded}
        />
        <MarketList data={marketsByVolume} />
      </div>
    );
  }

  return (
    <ScrollMenu
      wrapperClassName={styles.predictionsWithImageWrapper}
      scrollContainerClassName={styles.predictionsWithImageScroll}
      itemClassName={styles.predictionsWithImageItem}
      onWheel={onWheel}
      Header={
        <Header
          expandable={expandable}
          expanded={expanded}
          onExpand={handleChangeExpanded}
        >
          <div className={styles.headerArrows}>
            <LeftArrow />
            <RightArrow />
          </div>
        </Header>
      }
    >
      {marketsVisibleInCarousel.map(market => (
        <PredictionCard
          itemID={market.slug}
          key={market.slug}
          market={market}
          className={styles.predictionCard}
          statsVisibility={{
            volume: {
              desktop: false
            }
          }}
        />
      ))}
    </ScrollMenu>
  );
}

export default TournamentsUpcomingMarkets;
