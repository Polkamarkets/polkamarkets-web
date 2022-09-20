/* eslint-disable import/prefer-default-export */
import { roundNumber } from 'helpers/math';
import pick from 'lodash/pick';
import snakeCase from 'lodash/snakeCase';
import { AchievementAction, AchievementRarity } from 'types/achievement';
import { LeaderboardAchievement } from 'types/leaderboard';
import { FeedActionAccentColor } from 'types/portfolio';

import {
  GetAchievementsData,
  GetLeaderboardByAddressData,
  GetLeaderboardByTimeframeData,
  GetPortfolioByAddressData,
  GetPortfolioFeedByAddressData
} from './types';

// getAchievements

function pluralizeAction(count: number, word: string, suffix: string) {
  return `${count} ${word}${count !== 1 ? suffix : ''}`;
}

const achievementActions = {
  buy: (occurrences: number) =>
    `${pluralizeAction(occurrences, 'Prediction', 's')} made`,
  add_liquidity: (occurrences: number) =>
    `Liquidity added to ${pluralizeAction(occurrences, 'market', 's')}`,
  bond: (occurrences: number) =>
    `${pluralizeAction(occurrences, 'POLK bond', 's')} placed`,
  claim_winnings: (occurrences: number) =>
    `${pluralizeAction(occurrences, 'Prediction', 's')} Won`,
  create_market: (occurrences: number) =>
    `${pluralizeAction(occurrences, 'Market', 's')} created`
};

const achievementRarity = (occurrences: number): AchievementRarity =>
  occurrences < 5 ? 'common' : 'rare';

export function getAchievementsTransformResponse(
  response: GetAchievementsData
): GetAchievementsData {
  return response.map(achievement => {
    return {
      ...achievement,
      actionTitle: achievementActions[achievement.action](
        achievement.occurrences
      ),
      rarity: achievementRarity(achievement.occurrences)
    };
  });
}

// getPortfolioByAddress
export function getPortfolioByAddressTransformResponse(
  response: GetPortfolioByAddressData
): GetPortfolioByAddressData {
  return pick(response, [
    'openPositions',
    'wonPositions',
    'totalPositions',
    'closedMarketsProfit',
    'liquidityProvided',
    'firstPositionAt'
  ]);
}

// getLeaderboard

function transformLeaderboardAchievements(
  achievements: LeaderboardAchievement[]
): LeaderboardAchievement[] {
  return achievements.map(achievement => {
    const actionAttribute = achievement.attributes.find(
      att => att.traitType === 'Action'
    )!;
    const occurencesAttribute = achievement.attributes.find(
      att => att.traitType === 'Occurrences'
    )!;

    return {
      ...achievement,
      action: actionAttribute.value as AchievementAction,
      actionTitle: achievementActions[snakeCase(`${actionAttribute.value}`)](
        occurencesAttribute.value
      ),
      rarity: achievementRarity(parseInt(`${occurencesAttribute.value}`, 10))
    };
  });
}

// getLeaderboardByTimeframe
export function getLeaderboardByTimeframeTransformResponse(
  response: GetLeaderboardByTimeframeData
): GetLeaderboardByTimeframeData {
  return response.map(user => {
    return {
      ...user,
      achievements: transformLeaderboardAchievements(user.achievements)
    };
  });
}

// getLeaderboardByAddress
export function getLeaderboardByAddressTransformResponse(
  response: GetLeaderboardByAddressData
): GetLeaderboardByAddressData {
  return {
    ...response,
    achievements: transformLeaderboardAchievements(response.achievements)
  };
}

// getPortfolioFeedByAddress

const feedActions = {
  buy: (shares: number, outcomeTitle?: string) =>
    `Bought ${shares} shares of outcome "${outcomeTitle}"`,
  sell: (shares: number, outcomeTitle?: string) =>
    `Sold ${shares} shares of outcome "${outcomeTitle}"`,
  add_liquidity: (shares: number, _outcomeTitle?: string) =>
    `Added ${shares} liquidity shares`,
  remove_liquidity: (shares: number, _outcomeTitle?: string) =>
    `Removed ${shares} liquidity shares`,
  claim_winnings: (_shares: number, _outcomeTitle?: string) =>
    'Won a prediction',
  create_market: (_shares: number, _outcomeTitle?: string) => 'Created a market'
};

const feedAccentColors: { [key: string]: FeedActionAccentColor } = {
  buy: 'success',
  sell: 'danger',
  add_liquidity: 'primary',
  remove_liquidity: 'danger',
  claim_winnings: 'success',
  create_market: 'primary'
};

export function getPortfolioFeedByAddressTransformResponse(
  response: GetPortfolioFeedByAddressData
): GetPortfolioFeedByAddressData {
  return response.map(feed => {
    return {
      ...feed,
      actionTitle: feedActions[feed.action](
        roundNumber(feed.shares, 3),
        feed.outcomeTitle
      ),
      accentColor: feedAccentColors[feed.action]
    };
  });
}
