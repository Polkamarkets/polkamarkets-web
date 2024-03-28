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
  token: {
    address: string;
    decimals: number;
    imageUrl: string;
    name: string;
    symbol: string;
    wrapped: false;
  };
  tags: string[];
  socialUrls: {
    [key: string]: string;
  };
  createdAt: string;
};
