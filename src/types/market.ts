export type MarketState = 'open' | 'closed' | 'resolved';

export type News = {
  source: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
};

export type Comment = {
  id: number;
  body: string;
  timestamp: number;
  user: {
    username: string;
    avatar: string | null;
    slug: string;
  };
};

export type MarketActivity = {
  user: string;
  userSlug: string;
  action: 'buy' | 'sell';
  marketTitle: string;
  marketSlug: string;
  outcomeTitle: string;
  imageUrl: string;
  shares: number;
  value: number;
  timestamp: number;
  ticker: string;
};
