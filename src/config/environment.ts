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
  'WEB3_PROVIDER'
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
  | 'WEB3_PROVIDER'
  | 'WEB3_EVENTS_PROVIDER';

export type NetworkConfig = {
  ERC20_CONTRACT_ADDRESS: string;
  NETWORK_ID: string | number;
  PREDICTION_MARKET_CONTRACT_ADDRESS: string;
  REALITIO_ERC20_CONTRACT_ADDRESS: string;
  ACHIEVEMENTS_CONTRACT_ADDRESS?: string;
  VOTING_CONTRACT_ADDRESS?: string;
  WEB3_PROVIDER: string;
  WEB3_EVENTS_PROVIDER?: string;
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
