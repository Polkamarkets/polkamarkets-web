import { lazy } from 'react';

import ui from './ui';

const Leaderboard = lazy(() => import('pages/Leaderboard'));
const pages = {
  profile: {
    pathname: '/user/:address',
    Component: lazy(() => import('pages/Profile')),
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: true
  },
  club: {
    pathname: '/clubs/:slug',
    Component: Leaderboard,
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: ui.clubs.enabled
  },
  clubs: {
    pathname: '/clubs',
    Component: lazy(() => import('pages/Clubs')),
    exact: true,
    navigation: true,
    name: 'Clubs',
    meta: {
      title: 'Clubs - Polkamarkets',
      description:
        "Build your own Club, league and leaderboard with your friends, against colleagues or around communities. Wear your own logo, tease your clubmates and let all fight to climb the Club's leaderboard.",
      image: `${process.env.PUBLIC_URL}/metadata-homepage.png`
    },
    enabled: ui.clubs.enabled
  },
  leaderboard: {
    pathname: '/leaderboard',
    Component: Leaderboard,
    exact: false,
    navigation: true,
    name: 'Leaderboard',
    meta: {
      title: 'Leaderboard - Polkamarkets',
      description:
        'Rank up higher on the leaderboard and be the #1 forecaster of Polkamarkets.',
      image: `${process.env.PUBLIC_URL}/metadata-leaderboard.png`
    },
    enabled: true
  },
  achievements: {
    pathname: '/achievements',
    Component: lazy(() => import('pages/Achievements')),
    exact: false,
    navigation: true,
    name: 'Achievements',
    meta: {
      title: 'Achievements - Polkamarkets',
      description:
        'Place predictions in the Polkamarkets app and grab your exclusive NFT Achievements.',
      image: `${process.env.PUBLIC_URL}/metadata-homepage.png`
    },
    enabled: ui.achievements.enabled
  },
  portfolio: {
    pathname: '/portfolio',
    Component: lazy(() => import('pages/Portfolio')),
    exact: false,
    navigation: true,
    name: 'Portfolio',
    meta: {
      title: 'Portfolio - Polkamarkets',
      description:
        'Participate in the Polkamarkets app and compete with your friends, coworkers or other community members.',
      image: `${process.env.PUBLIC_URL}/metadata-portfolio.png`
    },
    enabled: true
  },
  home: {
    pathname: '/',
    Component: lazy(() => import('pages/Home')),
    exact: false,
    navigation: true,
    name: 'Markets',
    meta: {
      title: 'Polkamarkets - Autonomous Prediction Markets',
      description:
        'Polkamarkets is a DeFi-Powered Prediction Market built for cross-chain information exchange.',
      image: `${process.env.PUBLIC_URL}/polkamarkets_meta.jpg`
    },
    enabled: true,
    pages: {
      create: {
        pathname: '/market/create',
        Component: lazy(() => import('pages/CreateMarket')),
        exact: false,
        navigation: false,
        name: '',
        meta: null,
        enabled: true
      },
      market: {
        pathname: '/markets/:marketId',
        Component: lazy(() => import('pages/Market')),
        exact: false,
        navigation: false,
        name: '',
        meta: null,
        enabled: true
      }
    }
  }
} as const;

export default pages;
