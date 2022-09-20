import { TableColumn } from 'components/new/Table';
import { TableMiniColumn, TableMiniRow } from 'components/new/TableMini';

// Table

export type LeaderboardTableColumn = TableColumn;

export type Achievement = { id: number; name: string; image: string };

export type LeaderboardTableRow = {
  key: string;
  highlight?: boolean;
  wallet: {
    isLoggedInUser: boolean;
    address: string;
    place: number;
  };
  volume: {
    volume: number;
    ticker: string;
  };
  marketsCreated: number;
  wonPredictions: number;
  netVolume: {
    volume: number;
    ticker: string;
  };
  netLiquidity: {
    liquidity: number;
    ticker: string;
  };
  achievements: Achievement[];
  rank: {
    place: number;
    change: 'up' | 'down' | 'stable';
  };
};

// Top Wallets

export type LeaderboardTopWalletsColumn = TableMiniColumn;
export type LeaderboardTopWalletsRow = TableMiniRow;
