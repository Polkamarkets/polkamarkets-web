import { useState } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import sortOutcomes from 'helpers/sortOutcomes';
import { useTheme } from 'ui';

import { ChartHeader, LineChart, Text } from 'components';

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
  const [highOutcome, ...restOutcomes] = sortOutcomes({
    outcomes,
    timeframe: currentInterval.id
  });

  return (
    <>
      <div className="market-chart__header">
        <div>
          <Text scale="tiny-uppercase" color="gray" fontWeight="semibold">
            {highOutcome.title}
          </Text>
          <Text
            as="h3"
            scale="heading-large"
            fontWeight="semibold"
            className="market-chart__view-title notranslate"
          >
            {highOutcome.price} {ticker}
          </Text>
          <Text
            as="span"
            scale="tiny-uppercase"
            color={highOutcome.isPriceUp ? 'success' : 'danger'}
            fontWeight="semibold"
            className="notranslate"
          >
            {highOutcome.pricesDiff.value} {ticker} (
            {highOutcome.pricesDiff.pct})
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
      <LineChart
        series={[highOutcome, ...restOutcomes]}
        ticker={ticker}
        height={332}
      />
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
          tradingView: (
            <TradingViewWidget
              theme={Themes[theme.device.mode.toUpperCase()]}
              width="100%"
              height={454}
              symbol={tradingViewSymbol}
            />
          )
        }[chartViewType]
      }
    </div>
  );
}
