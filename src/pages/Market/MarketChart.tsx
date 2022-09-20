import { useState } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

import { fromPriceChartToLineChartSeries } from 'helpers/chart';

import { ChartHeader, LineChart, Text } from 'components';

import { useAppSelector, useTheme } from 'hooks';

const intervals = [
  { id: '24h', name: '24H', value: 24 },
  { id: '7d', name: '7D', value: 168 },
  { id: '30d', name: '30D', value: 720 },
  { id: 'all', name: 'ALL', value: 1440 }
];

const MarketChart = () => {
  const { theme } = useTheme();
  const currency = useAppSelector(state => state.market.market.currency);
  const { ticker } = currency;
  const predictions = useAppSelector(state => state.market.market.outcomes);
  const { chartViewType } = useAppSelector(state => state.market);
  const { tradingViewSymbol } = useAppSelector(state => state.market.market);

  const [currentInterval, setCurrentInterval] = useState(1440);

  const timeframe = intervals.find(
    interval => interval.value === currentInterval
  );

  const series = predictions.map(prediction => {
    const chart = prediction.priceCharts?.find(
      priceChart => priceChart.timeframe === timeframe?.id
    );

    const data = fromPriceChartToLineChartSeries(chart?.prices || []);
    return {
      name: prediction.title,
      data
    };
  });

  return (
    <div className="market-chart">
      <div className="market-chart__view">
        {chartViewType === 'marketOverview' ? (
          <div style={{ padding: '2.4rem' }}>
            <div className="market-chart__header">
              <Text
                as="h2"
                scale="body"
                fontWeight="semibold"
                className="market-chart__view-title"
              >
                Market Overview
              </Text>
              <div className="market-chart__header-actions">
                <ChartHeader
                  intervals={intervals}
                  defaultIntervalId="all"
                  onChangeInterval={
                    (_interval, value) => setCurrentInterval(value)
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                />
              </div>
            </div>
            <LineChart series={series} ticker={ticker} height={332} />
          </div>
        ) : null}
        {chartViewType === 'tradingView' ? (
          <TradingViewWidget
            theme={theme === 'dark' ? Themes.DARK : Themes.LIGHT}
            width="100%"
            height={454}
            symbol={tradingViewSymbol}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MarketChart;
