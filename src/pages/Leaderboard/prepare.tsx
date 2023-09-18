import { Link } from 'react-router-dom';

import cn from 'classnames';
import { ui } from 'config';
import shortenAddress from 'helpers/shortenAddress';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';
import { GetLeaderboardByTimeframeData } from 'services/Polkamarkets/types';
import { Avatar } from 'ui';

import {
  FirstPlaceIcon,
  SecondPlaceIcon,
  ThirdPlaceIcon,
  MyPlaceIcon,
  RankStableIcon
} from 'assets/icons/pages/leaderboard';

import { Icon, Tooltip } from 'components';

import LeaderboardClasses from './Leaderboard.module.scss';
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
  malicious?: boolean;
} & Record<'username' | 'userImageUrl', string | null>;

function walletColumnRender({
  isLoggedInUser,
  address,
  place,
  achievements,
  username,
  userImageUrl,
  malicious
}: WalletColumnRenderArgs) {
  const walletPlace = WALLET_PLACES[place] || {
    icon: null,
    textColor: '1'
  };

  return (
    <div className="flex-row gap-3 align-center">
      <Link
        to={`/user/${username || address}`}
        className="pm-c-leaderboard-table__wallet"
      >
        {walletPlace.icon}
        {(() => {
          if (userImageUrl)
            return (
              <Avatar
                $radius="lg"
                $size="x2s"
                alt="Avatar"
                src={userImageUrl}
                className={cn({
                  'pm-c-leaderboard-table__wallet__avatar': isLoggedInUser
                })}
              />
            );
          if (isLoggedInUser) return <MyPlaceIcon />;
          return null;
        })()}
        <p className={cn('caption semibold', `text-${walletPlace.textColor}`)}>
          {username || shortenAddress(address)}
          {isLoggedInUser && (
            <span className="caption semibold text-3"> (You)</span>
          )}
        </p>
        {!isEmpty(achievements)
          ? achievementsColumnRender(
              achievements,
              'medium',
              5 + 20 * Math.min(achievements.length, 4)
            )
          : null}
      </Link>
      {!isUndefined(ui.leaderboard.wallet.suspiciousActivityUrl) &&
      !isUndefined(malicious) &&
      malicious ? (
        <Tooltip
          interactive
          delayHide={250}
          text={
            isLoggedInUser ? (
              <>
                <p className="pm-c-tooltip__text">
                  Your account was flagged for suspicious activity.
                </p>
                <p className="pm-c-tooltip__text">
                  {`Reset it `}
                  <a
                    href="/reset"
                    rel="noreferrer"
                    className="pm-c-tooltip__link"
                  >
                    here
                  </a>
                  {` you're the account owner. `}
                  <a
                    href={ui.leaderboard.wallet.suspiciousActivityUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pm-c-tooltip__link"
                  >
                    More info
                  </a>
                </p>
              </>
            ) : (
              <p className="pm-c-tooltip__text">
                {`This account is flagged for suspicious activity. `}
                <a
                  href={ui.leaderboard.wallet.suspiciousActivityUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pm-c-tooltip__link"
                >
                  More info
                </a>
              </p>
            )
          }
        >
          <Icon
            name="Warning"
            className={LeaderboardClasses.walletWarningFlagIcon}
          />
        </Tooltip>
      ) : null}
    </div>
  );
}

type VolumeColumnRenderArgs = {
  volume: number;
  ticker: string;
};

function volumeColumnRender({ volume, ticker }: VolumeColumnRenderArgs) {
  return (
    <span className="pm-c-leaderboard-table__volume caption semibold text-1 notranslate">
      {`${volume?.toFixed(1)} `}
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
    <span className="pm-c-leaderboard-table__liquidity caption semibold text-1 notranslate">
      {`${liquidity?.toFixed(1)} `}
      <strong className="caption semibold text-3">{ticker}</strong>
    </span>
  );
}

type EarningsColumnRenderArgs = {
  earnings: number;
  ticker: string;
};

function earningsColumnRender({ earnings, ticker }: EarningsColumnRenderArgs) {
  return (
    <span className="pm-c-leaderboard-table__liquidity caption semibold text-1 notranslate">
      {`${earnings?.toFixed(1)} `}
      <strong className="caption semibold text-3">{ticker}</strong>
    </span>
  );
}

type BalanceColumnRenderArgs = {
  balance: number;
  ticker: string;
};

function balanceColumnRender({ balance, ticker }: BalanceColumnRenderArgs) {
  return (
    <span className="pm-c-leaderboard-table__balance caption semibold text-1 notranslate">
      {`${balance?.toFixed(1)} `}
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
  balanceColumnRender,
  rankColumnRender,
  earningsColumnRender
};

// Rows

export type PrepareLeaderboardTableRowsArgs = {
  rows?: GetLeaderboardByTimeframeData;
  ticker: string;
  fantasyTokenTicker?: string;
  sortBy: string;
  loggedInUser?: string;
};

function prepareLeaderboardTableRows({
  rows = [],
  ticker,
  fantasyTokenTicker,
  sortBy,
  loggedInUser
}: PrepareLeaderboardTableRowsArgs): LeaderboardTableRow[] {
  const sortedRows = orderBy(rows, sortBy, 'desc');

  return sortedRows.map((row, index) => {
    const isLoggedInUser = loggedInUser === row.user;

    return pick(
      {
        key: row.user,
        highlight: isLoggedInUser,
        wallet: {
          isLoggedInUser,
          address: row.user,
          place: index + 1,
          achievements: row.achievements,
          malicious: row.malicious,
          username: row.username,
          userImageUrl: row.userImageUrl
        },
        volumeEur: {
          volume: row.volumeEur,
          ticker: fantasyTokenTicker || '€'
        },
        marketsCreated: row.marketsCreated,
        wonPredictions: row.claimWinningsCount,
        netVolume: {
          volume: row.tvlVolumeEur,
          ticker: fantasyTokenTicker || '€'
        },
        netLiquidity: {
          liquidity: row.tvlLiquidityEur,
          ticker: fantasyTokenTicker || '€'
        },
        earnings: {
          earnings: row.earningsEur,
          ticker: fantasyTokenTicker || '€'
        },
        transactions: row.transactions,
        balance: {
          balance: row.erc20Balance,
          ticker: fantasyTokenTicker || ticker
        },
        achievements: row.achievements,
        rank: {
          place: index + 1,
          change: 'stable'
        }
      },
      ['key', 'highlight', 'wallet', 'rank', ...ui.leaderboard.columns]
    ) as LeaderboardTableRow;
  });
}

export { prepareLeaderboardTableRows };

// Your stats

function prepareLeaderboardYourStatsRow(rows: LeaderboardTableRow[]) {
  const yourStats = rows.find(row => row.wallet.isLoggedInUser);

  return pick(
    {
      rank: {
        value: yourStats
          ? {
              place: yourStats.rank.place,
              change: yourStats.rank.change
            }
          : null,
        render: rankColumnRender
      },
      volumeEur: {
        value:
          yourStats && yourStats.volumeEur
            ? {
                volume: yourStats.volumeEur.volume,
                ticker: yourStats.volumeEur.ticker
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
        value:
          yourStats && yourStats.netVolume
            ? {
                volume: yourStats.netVolume.volume,
                ticker: yourStats.netVolume.ticker
              }
            : null,
        render: volumeColumnRender
      },
      netLiquidity: {
        value:
          yourStats && yourStats.netLiquidity
            ? {
                liquidity: yourStats.netLiquidity.liquidity,
                ticker: yourStats.netLiquidity.ticker
              }
            : null,
        render: liquidityColumnRender
      },
      earnings: {
        value:
          yourStats && yourStats.earnings
            ? {
                earnings: yourStats.earnings.earnings,
                ticker: yourStats.earnings.ticker
              }
            : null,
        render: earningsColumnRender
      },
      transactions: {
        value: yourStats ? yourStats.transactions : null
      },
      balance: {
        value:
          yourStats && yourStats.balance
            ? {
                balance: yourStats.balance.balance,
                ticker: yourStats.balance.ticker
              }
            : null,
        render: balanceColumnRender
      },
      achievements: {
        value: yourStats ? yourStats.achievements : null,
        render: achievements => achievementsColumnRender(achievements, 'small')
      }
    },
    ['rank', ...ui.leaderboard.columns]
  );
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
    <div className="pm-c-leaderboard-top-wallets__wallet notranslate">
      {walletPlace.icon}
      <Link
        className={`caption semibold text-${walletPlace.textColor}`}
        to={`/user/${address}`}
      >
        {address.startsWith('0x')
          ? `${address.substring(0, 6)}...${address.substring(
              address.length - 4
            )}`
          : address}
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
            address: firstPlace.username || firstPlace.user,
            place: 1,
            change: 'stable'
          }
        : null,
      render: topWalletRowRender
    },
    secondPlace: {
      value: secondPlace
        ? {
            address: secondPlace.username || secondPlace.user,
            place: 2,
            change: 'stable'
          }
        : null,
      render: topWalletRowRender
    },
    thirdPlace: {
      value: thirdPlace
        ? {
            address: thirdPlace.username || thirdPlace.user,
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
