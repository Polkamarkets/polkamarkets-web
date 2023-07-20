import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import type {
  VirtuosoProps as ReactVirtuosoProps,
  VirtuosoHandle,
  ListRange
} from 'react-virtuoso';
import { Virtuoso as ReactVirtuoso } from 'react-virtuoso';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import type { Market } from 'models/market';
import { useRect, useTheme } from 'ui';

import { InfoIcon } from 'assets/icons';

import Icon from 'components/Icon';
import PredictionCard from 'components/PredictionCard';

import { useMarkets } from 'hooks';

import { Button } from '../Button';
import Text from '../Text';
import marketListClasses from './MarketList.module.scss';

type VirtuosoProps = Omit<
  ReactVirtuosoProps<Market, unknown>,
  'useWindowScroll' | 'itemContent' | 'rangeChanged' | 'ref'
>;

function Virtuoso({ data }: VirtuosoProps) {
  const theme = useTheme();
  const [backRef, backRect] = useRect<HTMLDivElement>();
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [virtuosoY, setVirtuosoY] = useState('');
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
  const backY = Math.floor(backRect.height);

  useLayoutEffect(() => {
    let timer = 0;

    function handleVirtuosoY() {
      timer = window.setTimeout(() => {
        const virtuosoScroller = document.querySelector<HTMLDivElement>(
          "[data-virtuoso-scroller='true']"
        );

        setVirtuosoY(virtuosoScroller?.style.height || '0px');
      }, 100);
    }

    handleVirtuosoY();
    window.addEventListener('scroll', handleVirtuosoY);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleVirtuosoY);
    };
  }, [theme.device.isDesktop, data]);
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
            ref={backRef}
            className={marketListClasses.backRoot}
            initial={{ top: window.innerHeight }}
            animate={{
              top: `calc(${window.innerHeight}px - ${backY}px${
                theme.device.isDesktop ? '' : ' - var(--header-y)'
              })`
            }}
            exit={{ top: window.innerHeight }}
          >
            <Button variant="subtle" size="xs" onClick={handleBackClick}>
              Back to Top
              <Icon name="Arrow" dir="up" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ReactVirtuoso
        useWindowScroll
        ref={virtuoso}
        itemContent={handleItemContent}
        rangeChanged={handleRangeChange}
        data={data}
        style={{
          top: renderBack ? -backY : undefined,
          minHeight: `calc(${virtuosoY}${
            renderBack && theme.device.isDesktop
              ? ` + ${backY}px`
              : ' + var(--grid-margin)'
          })`
        }}
      />
    </>
  );
}

type MarketListProps = {
  filtersVisible: boolean;
};

export default function MarketList({ filtersVisible }: MarketListProps) {
  const markets = useMarkets();

  useEffect(() => {
    markets.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Button color="primary" size="sm" onClick={markets.fetch}>
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
          success: <Virtuoso data={markets.data} />
        }[markets.state]
      }
    </div>
  );
}
