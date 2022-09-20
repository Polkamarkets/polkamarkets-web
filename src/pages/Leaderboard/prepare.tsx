import { Link } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import { GetLeaderboardByTimeframeData } from 'services/Polkamarkets/types';

import {
  FirstPlaceIcon,
  SecondPlaceIcon,
  ThirdPlaceIcon,
  MyPlaceIcon,
  RankStableIcon
} from 'assets/icons/pages/leaderboard';

import { Achievement, LeaderboardTableRow } from './types';

const WALLET_PLACES = {
  1: {
    icon: <FirstPlaceIcon />,
    textColor: 'warning'
  },
  2: {
    icon: <SecondPlaceIcon />,
    textColor: 'violets-are-blue'
  },
  3: {
    icon: <ThirdPlaceIcon />,
    textColor: 'maximum-blue-green'
  }
};

// Table

// Columns

type AchievementsColumnRenderArgs = Achievement[];

function achievementsColumnRender(
  achievements: AchievementsColumnRenderArgs,
  size: 'medium' | 'small',
  marginLeft: number = 0
) {
  const visibleAchievements = achievements.slice(0, 3);
  const remainingAchievements = achievements.slice(3);

  return (
    <div
      className="pm-c-leaderboard-table__achievements-list"
      style={{ marginLeft }}
    >
      {!isEmpty(remainingAchievements) ? (
        <div
          id={`achievement${0}`}
          className={`pm-c-leaderboard-table__achievement--${size} pm-c-leaderboard-table__achievement--more`}
        >
          <span
            className={`${
              size === 'small' ? 'tiny' : 'caption'
            } semibold text-primary`}
          >
            {`${remainingAchievements.length}+`}
          </span>
        </div>
      ) : null}
      {visibleAchievements.slice(0, 3).map((achievement, index) => (
        <img
          id={`achievement${index}`}
          className={`pm-c-leaderboard-table__achievement--${size}`}
          key={achievement.id}
          src={achievement.image}
          alt={achievement.name}
        />
      ))}
    </div>
  );
}
type WalletColumnRenderArgs = {
  isLoggedInUser: boolean;
  address: string;
  place: number;
  explorerURL: string;
  achievements: Achievement[];
};

function walletColumnRender({
  isLoggedInUser,
  address,
  place,
  achievements
}: WalletColumnRenderArgs) {
  const walletPlace = WALLET_PLACES[place] || {
    icon: null,
    textColor: '1'
  };

  return (
    <div className="pm-c-leaderboard-table__wallet">
      {walletPlace.icon}
      {isLoggedInUser ? <MyPlaceIcon /> : null}
      <Link
        className={`caption semibold text-${
          isLoggedInUser ? '1' : walletPlace.textColor
        }`}
        to={`/user/${address}`}
      >
        {`${address.substring(0, 6)}...${address.substring(
          address.length - 4
        )}`}
        {isLoggedInUser ? (
          <span className="caption semibold text-3">{` (You)`}</span>
        ) : null}
      </Link>
      {achievementsColumnRender(
        achievements,
        'medium',
        5 + 20 * Math.min(achievements.length, 4)
      )}
    </div>
  );
}

type VolumeColumnRenderArgs = {
  volume: number;
  ticker: string;
};

function volumeColumnRender({ volume, ticker }: VolumeColumnRenderArgs) {
  return (
    <span className="pm-c-leaderboard-table__volume caption semibold text-1">
      {`${volume.toFixed(1)} `}
      <strong className="caption semibold text-3">{ticker}</strong>
    </span>
  );
}

type LiquidityColumnRenderArgs = {
  liquidity: number;
  ticker: string;
};

function liquidityColumnRender({
  liquidity,
  ticker
}: LiquidityColumnRenderArgs) {
  return (
    <span className="pm-c-leaderboard-table__liquidity caption semibold text-1">
      {`${liquidity.toFixed(1)} `}
      <strong className="caption semibold text-3">{ticker}</strong>
    </span>
  );
}

type RankColumnRenderArgs = {
  place: number;
  change: 'up' | 'down' | 'stable';
};

function rankColumnRender({ place }: RankColumnRenderArgs) {
  return (
    <div className="pm-c-leaderboard-table__rank">
      {place === 0 ? (
        <RankStableIcon />
      ) : (
        <span className="caption semibold text-1">{place}</span>
      )}
    </div>
  );
}

export {
  walletColumnRender,
  volumeColumnRender,
  achievementsColumnRender,
  liquidityColumnRender,
  rankColumnRender
};

// Rows

export type PrepareLeaderboardTableRowsArgs = {
  rows?: GetLeaderboardByTimeframeData;
  ticker: string;
  sortBy: string;
  loggedInUser?: string;
};

function prepareLeaderboardTableRows({
  rows = [],
  ticker,
  sortBy,
  loggedInUser
}: PrepareLeaderboardTableRowsArgs): LeaderboardTableRow[] {
  const sortedRows = orderBy(rows, sortBy, 'desc');

  return sortedRows.map((row, index) => {
    const isLoggedInUser = loggedInUser === row.user;

    return {
      key: row.user,
      highlight: isLoggedInUser,
      wallet: {
        isLoggedInUser,
        address: row.user,
        place: index + 1,
        achievements: row.achievements
      },
      volume: {
        volume: row.volume,
        ticker
      },
      marketsCreated: row.marketsCreated,
      wonPredictions: row.claimWinningsCount,
      netVolume: {
        volume: row.tvlVolume,
        ticker
      },
      netLiquidity: {
        liquidity: row.tvlLiquidity,
        ticker
      },
      achievements: row.achievements,
      rank: {
        place: index + 1,
        change: 'stable'
      }
    };
  });
}

export { prepareLeaderboardTableRows };

// Your stats

function prepareLeaderboardYourStatsRow(rows: LeaderboardTableRow[]) {
  const yourStats = rows.find(row => row.wallet.isLoggedInUser);

  return {
    rank: {
      value: yourStats
        ? {
            place: yourStats.rank.place,
            change: yourStats.rank.change
          }
        : null,
      render: rankColumnRender
    },
    volume: {
      value: yourStats
        ? {
            volume: yourStats.volume.volume,
            ticker: yourStats.volume.ticker
          }
        : null,
      render: volumeColumnRender
    },
    marketsCreated: {
      value: yourStats ? yourStats.marketsCreated : null
    },
    wonPredictions: {
      value: yourStats ? yourStats.wonPredictions : null
    },
    netVolume: {
      value: yourStats
        ? {
            volume: yourStats.netVolume.volume,
            ticker: yourStats.netVolume.ticker
          }
        : null,
      render: volumeColumnRender
    },
    netLiquidity: {
      value: yourStats
        ? {
            liquidity: yourStats.netLiquidity.liquidity,
            ticker: yourStats.netLiquidity.ticker
          }
        : null,
      render: liquidityColumnRender
    },
    achievements: {
      value: yourStats ? yourStats.achievements : null,
      render: achievements => achievementsColumnRender(achievements, 'small')
    }
  };
}

export { prepareLeaderboardYourStatsRow };

// Top wallets

type TopWalletRenderArgs = {
  address: string;
  place: number;
};

function topWalletColumnRender({ address, place }: TopWalletRenderArgs) {
  const walletPlace = WALLET_PLACES[place] || {
    icon: null,
    textColor: '1'
  };

  return (
    <div className="pm-c-leaderboard-top-wallets__wallet">
      {walletPlace.icon}
      <Link
        className={`caption semibold text-${walletPlace.textColor}`}
        to={`/user/${address}`}
      >
        {`${address.substring(0, 6)}...${address.substring(
          address.length - 4
        )}`}
      </Link>
    </div>
  );
}

type topWalletRowRenderArgs = {
  place: number;
  change: 'up' | 'down' | 'stable';
};

function topWalletRowRender({ place }: topWalletRowRenderArgs) {
  return (
    <div className="pm-c-leaderboard-table__rank">
      <span className="caption semibold text-1">{place}</span>
      {/* {change === 'up' ? <RankUpIcon /> : null}
      {change === 'down' ? <RankDownIcon /> : null}
      {change === 'stable' ? <RankStableIcon /> : null} */}
    </div>
  );
}

type PrepareLeaderboardTopWalletsRowArgs = {
  rows?: GetLeaderboardByTimeframeData;
  sortBy: string;
};

function prepareLeaderboardTopWalletsRow({
  rows,
  sortBy
}: PrepareLeaderboardTopWalletsRowArgs) {
  const sortedRows = orderBy(
    rows,
    sortBy,
    'desc'
  ) as GetLeaderboardByTimeframeData;

  const firstPlace = sortedRows[0];
  const secondPlace = sortedRows[1];
  const thirdPlace = sortedRows[2];

  return {
    firstPlace: {
      value: firstPlace
        ? {
            address: firstPlace.user,
            place: 1,
            change: 'stable'
          }
        : null,
      render: topWalletRowRender
    },
    secondPlace: {
      value: secondPlace
        ? {
            address: secondPlace.user,
            place: 2,
            change: 'stable'
          }
        : null,
      render: topWalletRowRender
    },
    thirdPlace: {
      value: thirdPlace
        ? {
            address: thirdPlace.user,
            place: 3,
            change: 'stable'
          }
        : null,
      render: topWalletRowRender
    }
  };
}

export {
  topWalletColumnRender,
  topWalletRowRender,
  prepareLeaderboardTopWalletsRow
};
