import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import dayjs from 'dayjs';

import { useTheme } from 'hooks';

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
  const [width, setWidth] = useState('99%');

  const { theme } = useTheme();

  const customOptions = useMemo(
    () => generateCustomOptions(theme, ticker),
    [theme, ticker]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth('100%');
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ReactApexChart
      options={customOptions}
      series={series}
      type="line"
      height={height}
      width={width}
    />
  );
}

LineChart.displayName = 'LineChart';

export default LineChart;
