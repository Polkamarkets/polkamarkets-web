import { AreaColor, AreaDataPoint } from './Area.type';

export const colorVariants: { [key: string]: AreaColor } = {
  green: {
    startStop: '#46d39a',
    endStop: '#46d39a',
    stroke: '#46d39a'
  },
  red: {
    startStop: '#ef4444',
    endStop: '#ef4444',
    stroke: '#ef4444'
  }
};

export function minMaxScaler(data: AreaDataPoint[]) {
  const values = data.map(point => point.y);

  const max = Math.max(...values);
  const min = Math.min(...values);

  return data.map(point => ({
    ...point,
    y: max - min === 0 ? 1 : (point.y - min) / (max - min)
  }));
}
