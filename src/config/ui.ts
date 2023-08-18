import capitalize from 'helpers/capitalize';
import isTrue from 'helpers/isTrue';
import intersection from 'lodash/intersection';

import {
  leaderboardColumns,
  defaultLeaderboardColumns
} from 'pages/Leaderboard/Leaderboard.util';

import environment from './environment';
import features from './features';

export type Providers =
  | 'Google'
  | 'Facebook'
  | 'Discord'
  | 'Email'
  | 'Metamask';

const providers = (environment.FEATURE_SOCIAL_LOGIN_PROVIDERS?.split(',').map(
  capitalize
) || ['Google', 'Facebook', 'Discord', 'Email']) as unknown as Array<Providers>;
const ui = {
  layout: {
    header: {
      networkSelector: {
        enabled: features.regular.enabled
      },
      helpUrl: environment.UI_HELP_URL,
      communityUrls: {
        enabled: isTrue(environment.UI_COMMUNITY_URLS),
        twitter: environment.UI_COMMUNITY_TWITTER_URL,
        medium: environment.UI_COMMUNITY_MEDIUM_URL,
        telegram: environment.UI_COMMUNITY_TELEGRAM_URL,
        youtube: environment.UI_COMMUNITY_YOUTUBE_URL,
        linkedin: environment.UI_COMMUNITY_LINKEDIN_URL,
        github: environment.UI_COMMUNITY_GITHUB_URL
      }
    },
    disclaimer: {
      enabled: features.regular.enabled
    },
    alert: {
      enabled: isTrue(environment.FEATURE_ALERT)
    },
    footer: {
      text: environment.UI_FOOTER_TEXT
    }
  },
  hero: {
    enabled: !!environment.UI_HERO_IMAGE,
    image: environment.UI_HERO_IMAGE,
    image_url: environment.UI_HERO_IMAGE_URL,
    header: environment.UI_HERO_HEADER,
    title: environment.UI_HERO_TITLE,
    action: {
      title: environment.UI_HERO_ACTION_TITLE,
      url: environment.UI_HERO_ACTION_URL
    }
  },
  logo: environment.UI_LOGO,
  filters: {
    categories: environment.UI_FILTERS_CATEGORIES?.split(','),
    tokens: ['USDT', 'USDC', 'DAI', 'MATIC', 'GLMR', 'MOVR']
  },
  selectTokenModal: {
    blacklist: environment.UI_TOKEN_BLACKLIST?.split(',')
  },
  tradeForm: {
    liquidity: {
      enabled: features.regular.enabled
    }
  },
  reportForm: {
    enabled: features.regular.enabled
  },
  leaderboard: {
    columns: intersection(
      environment.UI_LEADERBOARD_COLUMNS?.split(',') ||
        defaultLeaderboardColumns,
      leaderboardColumns
    ),
    default_column: environment.UI_LEADERBOARD_DEFAULT_COLUMN
  },
  clubs: {
    enabled: isTrue(environment.FEATURE_CLUBS)
  },
  tournaments: {
    enabled: isTrue(environment.FEATURE_TOURNAMENTS)
  },
  achievements: {
    enabled: isTrue(environment.FEATURE_ACHIEVEMENTS)
  },
  profile: {
    summary: {
      liquidityProvided: {
        enabled: features.regular.enabled
      }
    }
  },
  portfolio: {
    analytics: {
      liquidityProvided: {
        enabled: features.regular.enabled
      },
      liquidityFeesEarned: {
        enabled: features.regular.enabled
      }
    },
    tabs: {
      liquidityPositions: {
        enabled: features.regular.enabled
      },
      reportPositions: {
        enabled: features.regular.enabled
      }
    }
  },
  market: {
    news: {
      enabled: isTrue(environment.FEATURE_NEWS)
    },
    voting: {
      enabled: isTrue(environment.FEATURE_VOTING)
    }
  },
  socialLogin: {
    enabled: isTrue(environment.FEATURE_SOCIAL_LOGIN),
    networkId: environment.FEATURE_SOCIAL_LOGIN_NETWORK_ID,
    isTestnet: isTrue(environment.FEATURE_SOCIAL_LOGIN_IS_TESTNET),
    providers
  }
} as const;

export default ui;
