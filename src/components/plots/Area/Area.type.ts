import { Dayjs } from 'dayjs';

export type AreaColor = {
  startStop: string;
  endStop: string;
  stroke: string;
};

export type AreaDataPoint = {
  x: Dayjs;
  y: number;
};
