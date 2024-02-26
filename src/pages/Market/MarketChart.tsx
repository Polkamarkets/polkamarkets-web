import { useState } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import { features } from 'config';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import maxBy from 'lodash/maxBy';
import { useTheme } from 'ui';

import { ChartHeader, InfoTooltip, LineChart, Text } from 'components';

import { useAppSelector } from 'hooks';

const intervals = [
  { id: '24h', name: '24H', value: 24 },
  { id: '7d', name: '7D', value: 168 },
  { id: '30d', name: '30D', value: 720 },
  { id: 'all', name: 'ALL', value: 1440 }
];

function MarketOverview() {
  const outcomes = useAppSelector(state => state.market.market.outcomes);
  const ticker = useAppSelector(state => state.market.market.token.ticker);

  const [currentInterval, setCurrentInterval] = useState(
    intervals[intervals.length - 1]
  );

  const sortedOutcomes = sortOutcomes({
    outcomes,
    timeframe: currentInterval.id
  });

  const highestPriceOutcome = maxBy(sortedOutcomes, 'price') || sortOutcomes[0];

  return (
    <>
      <div className="market-chart__header">
        <div>
          <Text
            scale="body"
            fontWeight="semibold"
            className="market-chart__view-title"
          >
            {highestPriceOutcome.title.toUpperCase()}
          </Text>
          <Text color="light-gray" scale="heading" fontWeight="semibold">
            {features.fantasy.enabled ? (
              <>
                <span className="notranslate">
                  {roundNumber(highestPriceOutcome.price * 100, 3)}%
                </span>
                <Text
                  as="span"
                  scale="tiny-uppercase"
                  fontWeight="bold"
                  className="market-chart__view-caption"
                >
                  <InfoTooltip text="Probability of an answer occur based on already made predictions." />
                </Text>
              </>
            ) : (
              <span className="notranslate">
                {highestPriceOutcome.price} {ticker}
              </span>
            )}
          </Text>
          <Text
            as="span"
            scale="tiny-uppercase"
            color={highestPriceOutcome.isPriceUp ? 'success' : 'danger'}
            fontWeight="semibold"
            className="notranslate"
          >
            {features.fantasy.enabled ? (
              <>{highestPriceOutcome.pricesDiff.pct}</>
            ) : (
              <>
                {highestPriceOutcome.pricesDiff.value} {ticker} (
                {highestPriceOutcome.pricesDiff.pct})
              </>
            )}
          </Text>{' '}
          <Text as="span" scale="tiny" color="gray" fontWeight="semibold">
            Since Market Creation
          </Text>
        </div>
        <div className="market-chart__header-actions">
          <ChartHeader
            intervals={intervals}
            currentInterval={currentInterval}
            onChangeInterval={setCurrentInterval}
          />
        </div>
      </div>
      <LineChart series={sortedOutcomes} ticker={ticker} height={332} />
    </>
  );
}
export default function MarketChart() {
  const theme = useTheme();
  const chartViewType = useAppSelector(state => state.market.chartViewType);
  const tradingViewSymbol = useAppSelector(
    state => state.market.market.tradingViewSymbol
  );

  return (
    <div className="market-chart__view">
      {
        {
          marketOverview: <MarketOverview />,
          tradingView: tradingViewSymbol ? (
            <TradingViewWidget
              theme={Themes[theme.device.mode.toUpperCase()]}
              width="100%"
              height={454}
              symbol={tradingViewSymbol}
            />
          ) : null
        }[chartViewType]
      }
    </div>
  );
}
