import type { Tournament } from './tournament';

export type Land = {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  position: number;
  tournaments: Omit<Tournament, 'land'>[];
  users: number;
};
