import { lazy } from 'react';

import features from './features';
import ui from './ui';

const defaultMetadata = {
  title:
    process.env.REACT_APP_METADATA_TITLE ||
    'Polkamarkets - Autonomous Prediction Markets',
  description:
    process.env.REACT_APP_METADATA_DESCRIPTION ||
    'Polkamarkets is a DeFi-Powered Prediction Market built for cross-chain information exchange.',
  image: process.env.REACT_APP_METADATA_IMAGE || '/metadata-homepage.png'
};

const metadataByPage = {
  achievements: {
    title:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_TITLE ||
      'Achievements - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_DESCRIPTION ||
      'Place predictions in the Polkamarkets app and grab your exclusive NFT Achievements.',
    image:
      process.env.REACT_APP_METADATA_ACHIEVEMENTS_IMAGE ||
      '/metadata-homepage.png'
  },
  clubs: {
    title: process.env.REACT_APP_METADATA_CLUBS_TITLE || 'Clubs - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_CLUBS_DESCRIPTION ||
      "Build your own Club, league and leaderboard with your friends, against colleagues or around communities. Wear your own logo, tease your clubmates and let all fight to climb the Club's leaderboard.",
    image:
      process.env.REACT_APP_METADATA_CLUBS_IMAGE || '/metadata-homepage.png'
  },
  tournaments: {
    title:
      process.env.REACT_APP_METADATA_TOURNAMENTS_TITLE ||
      'Tournaments - Polkamarkets',
    description: process.env.REACT_APP_METADATA_TOURNAMENTS_DESCRIPTION || '',
    image:
      process.env.REACT_APP_METADATA_TOURNAMENTS_IMAGE ||
      '/metadata-homepage.png'
  },
  leaderboard: {
    title:
      process.env.REACT_APP_METADATA_LEADERBOARD_TITLE ||
      'Leaderboard - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_LEADERBOARD_DESCRIPTION ||
      'Rank up higher on the leaderboard and be the #1 forecaster of Polkamarkets.',
    image:
      process.env.REACT_APP_METADATA_LEADERBOARD_IMAGE ||
      '/metadata-leaderboard.png'
  },
  portfolio: {
    title:
      process.env.REACT_APP_METADATA_PORTFOLIO_TITLE ||
      'Portfolio - Polkamarkets',
    description:
      process.env.REACT_APP_METADATA_PORTFOLIO_DESCRIPTION ||
      'Participate in the Polkamarkets app and compete with your friends, coworkers or other community members.',
    image:
      process.env.REACT_APP_METADATA_PORTFOLIO_IMAGE ||
      '/metadata-portfolio.png'
  }
};

const Leaderboard = lazy(() => import('pages/Leaderboard'));
const pages = {
  resetAccount: {
    pathname: '/reset',
    Component: lazy(() => import('pages/ResetAccount')),
    exact: true,
    navigation: false,
    name: '',
    meta: defaultMetadata,
    enabled: features.fantasy.enabled
  },
  restrictedCountry: {
    pathname: '/blocked',
    Component: lazy(() => import('pages/RestrictedCountry')),
    exact: true,
    navigation: false,
    name: '',
    meta: defaultMetadata,
    enabled: false
  },
  whitelist: {
    pathname: '/whitelist',
    Component: lazy(() => import('pages/Whitelist')),
    exact: true,
    navigation: false,
    name: '',
    meta: defaultMetadata,
    enabled: false
  },
  profile: {
    pathname: '/user/:address',
    Component: lazy(() => import('pages/Profile')),
    exact: false,
    navigation: false,
    name: '',
    meta: defaultMetadata,
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
    meta: metadataByPage.clubs,
    enabled: ui.clubs.enabled
  },
  tournamentLeaderboard: {
    pathname: `/tournaments/:slug${
      features.fantasy.enabled ? '/leaderboard' : ''
    }`,
    Component: Leaderboard,
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: ui.tournaments.enabled
  },
  tournament: {
    pathname: '/tournaments/:slug',
    Component: lazy(() => import('pages/Tournament')),
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: ui.tournaments.enabled
  },
  tournaments: {
    pathname: '/tournaments',
    Component: lazy(() => import('pages/Tournaments')),
    exact: true,
    navigation: false,
    name: 'Tournaments',
    meta: metadataByPage.tournaments,
    enabled: false
  },
  leaderboard: {
    pathname: '/leaderboard',
    Component: Leaderboard,
    exact: true,
    navigation: true,
    name: 'Leaderboard',
    meta: metadataByPage.leaderboard,
    enabled: !ui.tournaments.enabled
  },
  achievements: {
    pathname: '/achievements',
    Component: lazy(() => import('pages/Achievements')),
    exact: true,
    navigation: true,
    name: 'Achievements',
    meta: metadataByPage.achievements,
    enabled: ui.achievements.enabled
  },
  portfolio: {
    pathname: '/portfolio',
    Component: lazy(() => import('pages/Portfolio')),
    exact: true,
    navigation: true,
    name: 'Portfolio',
    meta: metadataByPage.portfolio,
    enabled: false
  },
  home: {
    pathname: '/',
    Component: lazy(() => import('pages/Home')),
    exact: true,
    navigation: !features.fantasy.enabled,
    name: 'Home',
    meta: defaultMetadata,
    enabled: features.fantasy.enabled && ui.tournaments.enabled
  },
  markets: {
    pathname:
      features.fantasy.enabled && ui.tournaments.enabled ? '/markets' : '/',
    Component: lazy(() => import('pages/Markets')),
    exact: false,
    navigation: !features.fantasy.enabled,
    name: 'Markets',
    meta: defaultMetadata,
    enabled: true,
    pages: {
      create: {
        pathname: '/markets/create',
        Component: lazy(() => import('pages/CreateMarket')),
        exact: false,
        navigation: false,
        name: '',
        meta: defaultMetadata,
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
  },
  land: {
    pathname: '/:slug',
    Component: lazy(() => import('pages/Land')),
    exact: false,
    navigation: false,
    name: '',
    meta: null,
    enabled: ui.tournaments.enabled
  },
  embed: {
    pathname: '/embed/markets/:marketSlug',
    Component: lazy(() => import('pages/Embed')),
    exact: true,
    navigation: false,
    name: '',
    meta: null,
    enabled: false
  }
} as const;

export default pages;
export { defaultMetadata, metadataByPage };
