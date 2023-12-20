import { Market } from 'models/market';

import type { Land } from './land';

export type TournamentGroup = {
  id: number;
  slug: string;
  title: string;
  description: string;
  position: number;
};

export type Tournament = {
  id: number;
  networkId: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  markets?: Pick<Market, 'id' | 'title' | 'imageUrl' | 'slug'>[];
  group: TournamentGroup | null;
  land: Omit<Land, 'tournaments'> | null;
  users: number;
  expiresAt: string;
  rankBy: string;
  rewards: string | null;
  rules: string | null;
};
