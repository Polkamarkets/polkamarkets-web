import { Currency } from 'types/currency';
import { News } from 'types/market';
import { Network } from 'types/network';

export interface PriceChartPoint {
  value: number;
  timestamp: number;
  date: string;
}

export interface PriceChart {
  timeframe: string;
  changePercent: number;
  prices: PriceChartPoint[];
}

export interface Outcome {
  id: number | string;
  marketId: number | string;
  price: number;
  priceChange24h: number;
  title: string;
  change: {
    type: string;
    chartData: any[];
  };
  priceCharts?: PriceChart[];
  shares: number;
}

export interface Question {
  id: string;
  bond: number;
  bestAnswer: string;
  isFinalized: boolean;
  isClaimed: boolean;
  finalizeTs: number;
}

export type Votes = {
  up: number;
  down: number;
};

export interface Market {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  resolutionSource: string | null;
  imageUrl: string;
  bannerUrl: string;
  title: string;
  volume: number;
  volumeEur: number;
  shares: number;
  liquidity: number;
  liquidityEur: number;
  liquidityPrice: number;
  createdAt: string;
  expiresAt: string;
  state: string;
  verified: boolean;
  voided: boolean;
  questionId: string;
  resolvedOutcomeId: number;
  outcomes: Outcome[];
  tradingViewSymbol: any;
  fee: number;
  question: Question;
  networkId: string;
  network: Network;
  news: News[];
  currency: Currency;
  votes: Votes;
}
