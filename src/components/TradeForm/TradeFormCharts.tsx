import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { fromPriceChartToLineChartSeries } from 'helpers/chart';
import isEmpty from 'lodash/isEmpty';
import { getMarketPriceCharts } from 'redux/ducks/market';
import { useAppDispatch } from 'redux/store';

import { useAppSelector } from 'hooks';

import ChartHeader from '../ChartHeader';
import LineChart from '../LineChart';

const intervals = [
  { id: '24h', name: '24H', value: 24 },
  { id: '7d', name: '7D', value: 168 },
  { id: '30d', name: '30D', value: 720 },
  { id: 'all', name: 'ALL', value: 1440 }
];

function TradeFormCharts() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ticker = useAppSelector(state => state.market.market.currency.ticker);
  const predictions = useAppSelector(state => state.market.market.outcomes);
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const isLoadingMarket = useAppSelector(state => state.market.isLoading);
  const isLoadingPriceCharts = useAppSelector(
    state => state.market.isLoadingPriceCharts
  );

  const [currentInterval, setCurrentInterval] = useState(1440);

  const isMarketPage = location.pathname === `/markets/${marketSlug}`;

  useEffect(() => {
    async function fetchMarketPriceCharts() {
      await dispatch(getMarketPriceCharts(marketSlug));
    }

    if (!isLoadingMarket && !isMarketPage && !isEmpty(marketSlug)) {
      fetchMarketPriceCharts();
    }
  }, [dispatch, isLoadingMarket, isMarketPage, marketSlug]);

  if (isMarketPage) return null;

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
    <div className="pm-c-trade-form-charts">
      <ChartHeader
        intervals={intervals}
        defaultIntervalId="all"
        onChangeInterval={(_interval, value) => setCurrentInterval(value)}
      />
      {isLoadingPriceCharts ? (
        <div className="pm-c-trade-form-charts__loading">
          <span className="spinner--primary" />
        </div>
      ) : (
        <LineChart series={series} ticker={ticker} height={180} />
      )}
    </div>
  );
}

TradeFormCharts.displayName = 'TradeFormCharts';

export default TradeFormCharts;
