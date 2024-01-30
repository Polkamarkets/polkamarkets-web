import capitalize from 'helpers/capitalize';
import isTrue from 'helpers/isTrue';
import intersection from 'lodash/intersection';

import {
  leaderboardColumns,
  defaultLeaderboardColumns
} from 'pages/Leaderboard/Leaderboard.util';

import environment from './environment';
import features from './features';
import { parseFiltersFromEnv, parseNavbarItemsFromEnv } from './ui.utils';

const providers = [
  'Google',
  'Facebook',
  'Discord',
  'MetaMask',
  'Twitter',
  'Email'
] as const;

const categories = [
  'Society',
  'Economy/Finance',
  'Politics',
  'Entertainment/Arts',
  'Sports',
  'Other'
];

export type Providers = typeof providers[number];

const ui = {
  layout: {
    navbar: {
      items: parseNavbarItemsFromEnv(environment.UI_NAVBAR_ITEMS)
    },
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
    onboarding: {
      steps: environment.UI_ONBOARDING
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
  logo: { desktop: environment.UI_LOGO, mobile: environment.UI_LOGO_MOBILE },
  filters: {
    enabled: !isTrue(environment.UI_FILTERS_DISABLED),
    favorites: {
      enabled: !isTrue(environment.UI_FILTERS_FAVORITES_DISABLED)
    },
    states: {
      enabled: !isTrue(environment.UI_FILTERS_STATE_DISABLED)
    },
    volume: {
      enabled: !isTrue(environment.UI_FILTERS_VOLUME_DISABLED)
    },
    endDate: {
      enabled: !isTrue(environment.UI_FILTERS_END_DATE_DISABLED)
    },
    categories: {
      enabled: !isTrue(environment.UI_FILTERS_CATEGORIES_DISABLED),
      options: environment.UI_FILTERS_CATEGORIES?.split(',') || categories
    },
    tokens: ['USDT', 'USDC', 'DAI', 'MATIC', 'GLMR', 'MOVR'],
    tournaments: {
      enabled: isTrue(environment.FEATURE_TOURNAMENTS)
    },
    extra: {
      filters: parseFiltersFromEnv(environment.UI_FILTERS_EXTRA_FILTERS)
    }
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
    default_column: environment.UI_LEADERBOARD_DEFAULT_COLUMN,
    wallet: {
      suspiciousActivityUrl: environment.UI_SUSPICIOUS_ACTIVITY_URL
    }
  },
  clubs: {
    enabled: isTrue(environment.FEATURE_CLUBS)
  },
  tournaments: {
    enabled: isTrue(environment.FEATURE_TOURNAMENTS),
    upcoming: {
      enabled: isTrue(environment.UI_TOURNAMENTS_UPCOMING_ENABLED)
    },
    tabs: {
      enabled: isTrue(environment.UI_TOURNAMENTS_TABS_ENABLED)
    }
  },
  achievements: {
    enabled: isTrue(environment.FEATURE_ACHIEVEMENTS)
  },
  comments: {
    enabled: !isTrue(environment.UI_COMMENTS_DISABLED)
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
    },
    outcomes: {
      sorting: {
        alphabetically: {
          enabled: isTrue(
            environment.UI_MARKET_OUTCOMES_SORTING_ALPHABETICALLY
          ),
          exclude:
            environment.UI_MARKET_OUTCOMES_SORTING_ALPHABETICALLY_EXCLUDE?.split(
              ','
            )
        }
      }
    }
  },
  socialLogin: {
    hasAutoClaim: isTrue(environment.UI_SOCIAL_LOGIN_AUTO_CLAIM),
    enabled: isTrue(environment.FEATURE_SOCIAL_LOGIN),
    networkId: environment.FEATURE_SOCIAL_LOGIN_NETWORK_ID,
    isTestnet: isTrue(environment.FEATURE_SOCIAL_LOGIN_IS_TESTNET),
    providers:
      (
        environment.FEATURE_SOCIAL_LOGIN_PROVIDERS?.split(
          ','
        ) as Array<Providers>
      )?.map(capitalize) || providers
  }
} as const;

export default ui;
