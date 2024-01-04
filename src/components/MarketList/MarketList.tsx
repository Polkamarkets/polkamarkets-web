import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  VirtuosoProps as ReactVirtuosoProps,
  VirtuosoHandle,
  ListRange
} from 'react-virtuoso';
import { Virtuoso as ReactVirtuoso } from 'react-virtuoso';

import cn from 'classnames';
import { features } from 'config';
import { AnimatePresence, motion } from 'framer-motion';
import type { Market } from 'models/market';
import { useRect, useTheme } from 'ui';

import { InfoIcon } from 'assets/icons';

import PredictionCard from 'components/PredictionCard';

import { useAppSelector, useMarkets } from 'hooks';

import { Button } from '../Button';
import Text from '../Text';
import marketListClasses from './MarketList.module.scss';

type VirtuosoProps = Omit<
  ReactVirtuosoProps<Market, unknown>,
  'useWindowScroll' | 'itemContent' | 'rangeChanged' | 'ref'
>;

function Virtuoso({ data }: VirtuosoProps) {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const theme = useTheme();
  const [back, backRect] = useRect();
  const BACK_HEIGHT = `${backRect.height}px`;
  const HEIGHT = theme.device.isDesktop
    ? BACK_HEIGHT
    : `calc(${BACK_HEIGHT} ${
        !features.fantasy.enabled || isLoggedIn ? '+ var(--header-y)' : ''
      })`;
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [renderBack, setRenderBack] = useState(false);
  const handleItemContent = useCallback(
    (index: number, market: Market) => (
      <PredictionCard
        market={market}
        $gutter={data && index !== data.length - 1}
      />
    ),
    [data]
  );
  const handleRangeChange = useCallback(
    (range: ListRange) => {
      if (range.startIndex > 0) setRenderBack(true);
      else if (renderBack) setRenderBack(false);
    },
    [renderBack]
  );
  const handleBackClick = useCallback(
    () =>
      virtuoso.current?.scrollToIndex({
        index: 0,
        align: 'start',
        behavior: 'smooth'
      }),
    []
  );

  useEffect(() => {
    (async function handleMarketColors() {
      if (data) {
        try {
          const { default: buildMarketColors } = await import(
            'helpers/buildMarketColors'
          );
          const { MARKET_COLORS_KEY } = await import('helpers/getMarketColors');

          localStorage.setItem(
            MARKET_COLORS_KEY,
            JSON.stringify(await buildMarketColors(data))
          );
        } catch (error) {
          // unsupported
        }
      }
    })();
  }, [data]);

  return (
    <>
      <AnimatePresence>
        {renderBack && (
          <motion.div
            ref={back}
            className={marketListClasses.backRoot}
            initial={{ top: window.innerHeight }}
            animate={{
              top: `calc(${window.innerHeight}px - ${HEIGHT})`
            }}
            exit={{ top: window.innerHeight }}
          >
            <Button variant="ghost" size="xs" onClick={handleBackClick}>
              Back to Top
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReactVirtuoso
        ref={virtuoso}
        useWindowScroll
        itemContent={handleItemContent}
        rangeChanged={handleRangeChange}
        data={data}
        style={{ top: renderBack ? -backRect.height : undefined }}
      />
    </>
  );
}

type MarketListProps = {
  filtersVisible: boolean;
  fetchByIds?: {
    ids: string[];
    networkId: number;
  };
  showOpenMarketsAtTheTop?: boolean;
};

export default function MarketList({
  filtersVisible,
  fetchByIds,
  showOpenMarketsAtTheTop = false
}: MarketListProps) {
  const { data, fetch, state } = useMarkets(fetchByIds);

  const fetchMarkets = useCallback(async () => {
    await fetch();
  }, [fetch]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const markets = useMemo(() => {
    if (!data) return [];

    if (!showOpenMarketsAtTheTop) return data;

    return [
      ...data.filter(market => market.state === 'open'),
      ...data.filter(market => market.state !== 'open')
    ];
  }, [data, showOpenMarketsAtTheTop]);

  return (
    <div
      className={cn('pm-c-market-list', {
        'pm-c-market-list--filters-visible': filtersVisible
      })}
    >
      {
        {
          loading: (
            <div className="pm-c-market-list__empty-state">
              <div className="pm-c-market-list__empty-state__body">
                <span className="spinner--primary" />
              </div>
            </div>
          ),
          error: (
            <div className="pm-c-market-list__error">
              <div className="pm-c-market-list__error__body">
                <InfoIcon />
                <Text
                  as="p"
                  scale="tiny"
                  fontWeight="semibold"
                  className="pm-c-market-list__empty-state__body-description"
                >
                  Error fetching markets
                </Text>
              </div>
              <div className="pm-c-market-list__error__actions">
                <Button color="primary" size="sm" onClick={fetchMarkets}>
                  Try again
                </Button>
              </div>
            </div>
          ),
          warning: (
            <div className="pm-c-market-list__empty-state">
              <div className="pm-c-market-list__empty-state__body">
                <InfoIcon />
                <Text
                  as="p"
                  scale="tiny"
                  fontWeight="semibold"
                  className="pm-c-market-list__empty-state__body-description"
                >
                  There are no available markets for this category.
                </Text>
              </div>
            </div>
          ),
          success: <Virtuoso data={markets} />
        }[state]
      }
    </div>
  );
}
