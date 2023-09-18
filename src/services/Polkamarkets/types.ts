import { Market } from 'models/market';
import { Achievement } from 'types/achievement';
import {
  LeaderboardAchievement,
  LeaderboardGroup,
  LeaderboardTimeframe,
  UserLeaderboard
} from 'types/leaderboard';
import { MarketState } from 'types/market';
import { FeedActivity } from 'types/portfolio';
import { Tournament } from 'types/tournament';

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
  userImageUrl?: string | null;
  username?: string | null;
  user: string;
  ens?: any;
  marketsCreated: number;
  malicious?: boolean;
  volumeEur: number;
  tvlVolumeEur: number;
  liquidityEur: number;
  tvlLiquidityEur: number;
  earningsEur: number;
  claimWinningsCount: number;
  transactions: number;
  erc20Balance: number;
  achievements: LeaderboardAchievement[];
};

// getLeaderboardByTimeframe
export type GetLeaderboardByTimeframeData = GetLeaderboardBaseData[];

export type GetLeaderboardByTimeframeArgs = {
  timeframe: LeaderboardTimeframe;
  networkId: string;
  tournamentId?: string;
};

// getLeaderboardByAddress
export type GetLeaderboardByAddressData = GetLeaderboardBaseData & {
  rank: {
    marketsCreated: number;
    volumeEur: number;
    tvlVolumeEur: number;
    tvlLiquidityEur: number;
    earningsEur: number;
    claimWinningsCount: number;
  };
};

export type GetLeaderboardByAddressArgs = {
  address: string;
  timeframe: LeaderboardTimeframe;
  networkId: string;
};

// createLeaderboardGroup
export type CreateLeaderboardGroupData = { slug: string };
export type CreateLeaderboardGroupParams = {
  title: string;
  users: string[];
  imageHash?: string;
  createdBy: string;
};

// joinLeaderboardGroup
export type JoinLeaderboardGroupData = void;
export type JoinLeaderboardGroupParams = {
  slug: string;
  user: string;
};

// editLeaderboardGroup
export type EditLeaderboardGroupData = LeaderboardGroup;
export type EditLeaderboardGroupParams = {
  slug: string;
  title: string;
  imageHash: string;
  users: string[];
};

// getLeaderboardGroupBySlug
export type GetLeaderboardGroupBySlugData = LeaderboardGroup;
export type GetLeaderboardGroupBySlugArgs = {
  slug: string;
};

// getUserLeaderboards
export type GetLeaderboardGroupsByUserData = UserLeaderboard[];
export type GetLeaderboardGroupsByUserArgs = { user: string };

// getTournaments
export type GetTournamentsData = Tournament[];

// getTournamentBySlug
export type GetTournamentBySlugData = Tournament;
export type GetTournamentBySlugArgs = {
  slug: string;
};

// getPortfolioFeedByAddress
export type GetPortfolioFeedByAddressData = FeedActivity[];

export type GetPortfolioFeedByAddressArgs = {
  address: string;
  networkId: string;
};
