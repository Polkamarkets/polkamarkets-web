import dayjs from 'dayjs';

export interface Category {
  title: string;
  backgroundColor: string;
  icon: any;
  change: {
    type: 'up' | 'down' | string;
    amount: number;
  };
  chartData: { x: dayjs.Dayjs; y: number }[];
  marketCount?: number;
}
