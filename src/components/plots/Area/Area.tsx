import { useMemo } from 'react';

import { AreaChart, Area as RechartsArea } from 'recharts';

import { AreaDataPoint } from './Area.type';
import { colorVariants, minMaxScaler } from './Area.util';

type AreaProps = {
  id: string;
  width?: number;
  height?: number;
  data: AreaDataPoint[];
  color: 'green' | 'red';
};

function Area({ id, width = 100, height = 50, data, color }: AreaProps) {
  const colorVariant = colorVariants[color];

  const minMaxScaledData = useMemo(() => minMaxScaler(data), [data]);

  return (
    <AreaChart
      width={width}
      height={height}
      data={minMaxScaledData}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
      }}
      style={{
        cursor: 'pointer'
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor={colorVariant.startStop}
            stopOpacity={0.43}
          />
          <stop
            offset="95%"
            stopColor={colorVariant.endStop}
            stopOpacity={0.1}
          />
        </linearGradient>
      </defs>
      <RechartsArea
        type="linear"
        dataKey="y"
        strokeWidth={1.7}
        stroke={colorVariant.stroke}
        fillOpacity={1}
        fill={`url(#${id})`}
        isAnimationActive={false}
      />
    </AreaChart>
  );
}

export default Area;
