export type UserOperation = {
  imageUrl: string | null;
  marketSlug: string | null;
  marketTitle: string | null;
  marketId: number | null;
  outcomeTitle: string | null;
  outcomeId: number | null;
  networkId: number;
  shares: number | null;
  status: 'success' | 'failed' | 'pending';
  action: 'buy' | 'sell' | 'claimAndApproveTokens';
  ticker: string | undefined;
  timestamp: number;
  transactionHash: string | null;
  user: string;
  userOperationHash: string;
  value: number | null;
};
