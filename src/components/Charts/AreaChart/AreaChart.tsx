import dayjs from 'dayjs';
import {
  AreaChart as RechartsAreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';

type ColorVariant = {
  startStopColor: string;
  endStopColor: string;
  strokeColor: string;
};

const COLOR_VARIANTS: { [key: string]: ColorVariant } = {
  white: {
    startStopColor: '#FFFFFF',
    endStopColor: '#FFFFFF',
    strokeColor: '#FFFFFF'
  }
};

type Event = {
  x: dayjs.Dayjs;
  y: number;
};

type AreaChartProps = {
  data: Event[];
  color: 'white';
  height: string | number;
};

function AreaChart({ data, color, height }: AreaChartProps) {
  const colorVariant = COLOR_VARIANTS[color];
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
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
            <linearGradient id="1" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colorVariant.startStopColor}
                stopOpacity={0.43}
              />
              <stop
                offset="95%"
                stopColor={colorVariant.endStopColor}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="y"
            stroke={`${colorVariant.strokeColor}57`}
            fillOpacity={1}
            fill="url(#1)"
            isAnimationActive={false}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;
