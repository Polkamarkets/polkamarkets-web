import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

const environmentConfigVariables = [
  'ERC20_CONTRACT_ADDRESS',
  'TRANSAK_API_KEY',
  'TRANSAK_ENVIRONMENT',
  'IP_API_KEY',
  'NETWORK_ID',
  'POLKAMARKETS_API_URL',
  'PREDICTION_MARKET_CONTRACT_ADDRESS',
  'REALITIO_ERC20_CONTRACT_ADDRESS',
  'RESTRICTED_COUNTRIES',
  'WEB3_PROVIDER',
  'FEATURE_FANTASY',
  'FEATURE_ALERT',
  'FEATURE_VOTING',
  'FEATURE_FANTASY_TOKEN_TICKER',
  'FEATURE_FANTASY_WHITELIST',
  'FEATURE_NEWS',
  'FEATURE_CLUBS',
  'FEATURE_TOURNAMENTS',
  'FEATURE_ACHIEVEMENTS',
  'FEATURE_SOCIAL_LOGIN',
  'FEATURE_SOCIAL_LOGIN_NETWORK_ID',
  'FEATURE_SOCIAL_LOGIN_IS_TESTNET',
  'FEATURE_SOCIAL_LOGIN_PROVIDERS',
  'PUBLIC_URL',
  'UI_NAVBAR_ITEMS',
  'UI_HERO_IMAGE',
  'UI_HERO_IMAGE_URL',
  'UI_HERO_HEADER',
  'UI_HERO_TITLE',
  'UI_HERO_ACTION_TITLE',
  'UI_HERO_ACTION_URL',
  'UI_LEADERBOARD_COLUMNS',
  'UI_LEADERBOARD_DEFAULT_COLUMN',
  'UI_THEME_MODE',
  'UI_FILTERS_CATEGORIES',
  'UI_TOKEN_BLACKLIST',
  'UI_LOGO',
  'UI_LOGO_MOBILE',
  'UI_FOOTER_TEXT',
  'UI_HELP_URL',
  'UI_FOOTER_TEXT',
  'UI_COMMENTS_DISABLED',
  'UI_COMMUNITY_URLS',
  'UI_COMMUNITY_TWITTER_URL',
  'UI_COMMUNITY_MEDIUM_URL',
  'UI_COMMUNITY_TELEGRAM_URL',
  'UI_COMMUNITY_YOUTUBE_URL',
  'UI_COMMUNITY_LINKEDIN_URL',
  'UI_COMMUNITY_GITHUB_URL',
  'UI_MARKET_OUTCOMES_SORTING_ALPHABETICALLY',
  'UI_MARKET_OUTCOMES_SORTING_ALPHABETICALLY_EXCLUDE',
  'UI_SUSPICIOUS_ACTIVITY_URL',
  'UI_FILTERS_DISABLED',
  'UI_FILTERS_CATEGORIES_DISABLED',
  'UI_FILTERS_STATE_DISABLED',
  'UI_FILTERS_VOLUME_DISABLED',
  'UI_FILTERS_END_DATE_DISABLED',
  'UI_FILTERS_FAVORITES_DISABLED',
  'UI_FILTERS_EXTRA_FILTERS',
  'UI_TOURNAMENTS_UPCOMING_ENABLED',
  'UI_TOURNAMENTS_TABS_ENABLED',
  'UI_TWITTER_SHARE_INTENT',
  'UI_ONBOARDING',
  'SENTRY_DSN',
  'FAVICON_URL',
  'TOUCHICON_URL',
  'HOMEPAGE_URL',
  'DEFAULT_LANGUAGE',
  'UI_SOCIAL_LOGIN_AUTO_CLAIM',
  'EXTERNAL_JS_URL'
] as const;

export type EnvironmentConfigVariable =
  typeof environmentConfigVariables[number];

export type EnvironmentConfig = {
  [_variable in typeof environmentConfigVariables[number]]: string | undefined;
};

function getEnvironmentConfigVariable(
  variable: EnvironmentConfigVariable
): string | undefined {
  if (!(`REACT_APP_${variable}` in process.env)) {
    return undefined;
  }
  return process.env[`REACT_APP_${variable}`];
}

function buildEnvironmentConfigObject() {
  return environmentConfigVariables.reduce(
    (acc, variable) => ({
      ...acc,
      [variable]: getEnvironmentConfigVariable(variable)
    }),
    {} as EnvironmentConfig
  );
}

const environmentConfig = buildEnvironmentConfigObject();

type NetworkConfigVariable =
  | 'ERC20_CONTRACT_ADDRESS'
  | 'NETWORK_ID'
  | 'PREDICTION_MARKET_CONTRACT_ADDRESS'
  | 'REALITIO_ERC20_CONTRACT_ADDRESS'
  | 'ACHIEVEMENTS_CONTRACT_ADDRESS'
  | 'VOTING_CONTRACT_ADDRESS'
  | 'ARBITRATION_CONTRACT_ADDRESS'
  | 'ARBITRATION_PROXY_CONTRACT_ADDRESS'
  | 'WEB3_PROVIDER'
  | 'WEB3_EVENTS_PROVIDER'
  | 'ARBITRATION_NETWORK_ID'
  | 'DISABLED';

export type NetworkConfig = {
  ERC20_CONTRACT_ADDRESS: string;
  NETWORK_ID: string | number;
  PREDICTION_MARKET_CONTRACT_ADDRESS: string;
  REALITIO_ERC20_CONTRACT_ADDRESS: string;
  ACHIEVEMENTS_CONTRACT_ADDRESS?: string;
  VOTING_CONTRACT_ADDRESS?: string;
  ARBITRATION_CONTRACT_ADDRESS?: string;
  ARBITRATION_PROXY_CONTRACT_ADDRESS?: string;
  WEB3_PROVIDER: string;
  WEB3_EVENTS_PROVIDER?: string;
  ARBITRATION_NETWORK_ID?: string;
  DISABLED?: string;
};

export type NetworksConfigs = { [key: number]: NetworkConfig };

const networkVariableRegularExp = new RegExp(
  '^REACT_APP_NETWORK_([0-9]+)((_[A-Z0-9]+)*)$'
);

function getNetworksConfigVariablesFromEnv() {
  const networksVariables = Object.keys(process.env).filter(variable =>
    variable.match(networkVariableRegularExp)
  );

  return networksVariables as NetworkConfigVariable[];
}

function buildNetworksConfigObject(variables: NetworkConfigVariable[]) {
  const networks: { [key: string]: NetworkConfig } = {};

  function addVariableToGroup(variable: NetworkConfigVariable) {
    const regexMatchResult = variable.match(networkVariableRegularExp);
    const group = !isNull(regexMatchResult) ? regexMatchResult[1] : undefined;

    if (!isUndefined(group)) {
      networks[group] = {
        ...networks[group],
        [variable.split(`${group}_`)[1] as NetworkConfigVariable]:
          process.env[variable]
      } as NetworkConfig;
    }
  }

  variables.forEach(addVariableToGroup);

  return networks;
}

const networkVariables = getNetworksConfigVariablesFromEnv();
const networksConfig = buildNetworksConfigObject(networkVariables);

export default { ...environmentConfig, NETWORKS: networksConfig };
