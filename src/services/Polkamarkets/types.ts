import { Market } from 'models/market';
import { Achievement } from 'types/achievement';
import {
  LeaderboardAchievement,
  LeaderboardTimeframe
} from 'types/leaderboard';
import { MarketState } from 'types/market';
import { FeedActivity } from 'types/portfolio';

// getMarketBySlug
export type GetMarketBySlugData = Market;
export type GetMarketBySlugArgs = {
  slug: string;
};

// getMarketsByState
export type GetMarketsByStateData = Market[];
export type GetMarketsByStateArgs = {
  state: MarketState;
  networkId?: string;
};

// getMarketsByIds
export type GetMarketsByIdsData = Market[];
export type GetMarketsByIdsArgs = {
  ids: string[];
  networkId?: string;
};

// reloadMarketBySlug
export type ReloadMarketBySlugData = void;
export type ReloadMarketBySlugArgs = {
  slug: string;
};

// createMarketById
export type CreateMarketByIdData = Market;
export type CreateMarketByIdArgs = {
  id: string;
};

// getPortfolioByAddress
export type GetPortfolioByAddressData = {
  openPositions: number;
  wonPositions: number;
  totalPositions: number;
  closedMarketsProfit: number;
  liquidityProvided: number;
  firstPositionAt?: number;
};

export type GetPortfolioByAddressArgs = {
  address: string;
  networkId: string;
};

// reloadPortfolioByAddress
export type ReloadPortfolioByAddressData = void;
export type ReloadPortfolioByAddressArgs = {
  address: string;
};

// getAchievements
export type GetAchievementsData = Achievement[];
export type GetAchievementsArgs = {
  networkId: string;
};

export type GetLeaderboardBaseData = {
  user: string;
  ens?: any;
  marketsCreated: number;
  volume: number;
  tvlVolume: number;
  liquidity: number;
  tvlLiquidity: number;
  claimWinningsCount: number;
  transactions: number;
  achievements: LeaderboardAchievement[];
};

// getLeaderboardByTimeframe
export type GetLeaderboardByTimeframeData = GetLeaderboardBaseData[];

export type GetLeaderboardByTimeframeArgs = {
  timeframe: LeaderboardTimeframe;
  networkId: string;
};

// getLeaderboardByAddress
export type GetLeaderboardByAddressData = GetLeaderboardBaseData & {
  rank: {
    marketsCreated: number;
    volume: number;
    tvlVolume: number;
    tvlLiquidity: number;
    claimWinningsCount: number;
  };
};

export type GetLeaderboardByAddressArgs = {
  address: string;
  timeframe: LeaderboardTimeframe;
  networkId: string;
};

// getPortfolioFeedByAddress
export type GetPortfolioFeedByAddressData = FeedActivity[];

export type GetPortfolioFeedByAddressArgs = {
  address: string;
  networkId: string;
};
