export type FeedAction =
  | 'buy'
  | 'sell'
  | 'add_liquidity'
  | 'remove_liquidity'
  | 'claim_winnings'
  | 'create_market';

export type FeedActionAccentColor = 'success' | 'danger' | 'primary';

export type FeedActivity = {
  user: string;
  action: FeedAction;
  actionTitle: string;
  accentColor: FeedActionAccentColor;
  marketTitle: string;
  marketSlug: string;
  outcomeTitle?: string;
  imageUrl: string;
  shares: number;
  value: number;
  timestamp: number;
};
