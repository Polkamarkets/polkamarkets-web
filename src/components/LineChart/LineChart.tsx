import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import AutoSizer from 'react-virtualized-auto-sizer';

import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import { useTheme } from 'ui';

import generateCustomOptions from './options';

type Event = {
  x: dayjs.Dayjs;
  y: number;
};

type Serie = {
  name: string;
  data: Event[];
};

type LineChartProps = {
  series: Serie[];
  ticker: string;
  height?: number | string;
};

function LineChart({ series, ticker, height = 200 }: LineChartProps) {
  const theme = useTheme();

  const moreThan24h = useMemo(
    () =>
      !isEmpty(series[0].data)
        ? dayjs(series[0].data[series[0].data.length - 1].x).diff(
            series[0].data[0].x,
            'hour'
          ) > 24
        : false,
    [series]
  );

  const customOptions = useMemo(
    () =>
      generateCustomOptions(
        theme.device.mode,
        ticker,
        moreThan24h ? 'MMM, dd' : 'h:mm TT'
      ),
    [moreThan24h, theme.device.mode, ticker]
  );

  return (
    <div style={{ width: '100%', height }}>
      <AutoSizer disableHeight>
        {({ width }) => (
          <ReactApexChart
            options={customOptions}
            series={series}
            type="line"
            height={height}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
}

LineChart.displayName = 'LineChart';

export default LineChart;
