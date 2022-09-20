import { AchievementAction, AchievementRarity } from './achievement';

export type LeaderboardAchievement = {
  id: number;
  name: string;
  image: string;
  description: string;
  attributes: {
    value: number | string;
    traitType: string;
  }[];
  action: AchievementAction;
  actionTitle: string;
  occurences: number;
  rarity: AchievementRarity;
  tokenCount: number;
};

export type LeaderboardTimeframe = '1w' | '1m' | 'at';
