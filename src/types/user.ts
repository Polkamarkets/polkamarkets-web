export type UserOperation = {
  imageUrl: string | null;
  marketSlug: string;
  marketTitle: string;
  marketId: number;
  outcomeTitle: string;
  outcomeId: number;
  networkId: number;
  shares: number | null;
  status: 'success' | 'failed' | 'pending';
  action: 'buy' | 'sell';
  ticker: string;
  timestamp: number;
  transactionHash: string | null;
  user: string;
  userOperationHash: string;
  value: number;
};
