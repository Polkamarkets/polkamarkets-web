import { Currency, DEV, ETH, MOVR } from 'hooks/useNetwork/currencies';

export type Network = {
  id: string;
  name: string;
  key: string;
  currency: Currency;
  decimals: number;
  explorerURL: string;
  rpcUrls: Array<string>;
  buyEc20Url?: string;
};

export const { REACT_APP_NETWORK_ID, REACT_APP_GOVERNANCE_CONTRACT_ADDRESS } =
  process.env;

const NETWORKS: {
  [key: string]: Network;
} = {
  '0x1': {
    id: '1',
    name: 'Ethereum Mainnet',
    key: 'mainnet',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: [],
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${REACT_APP_GOVERNANCE_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x3': {
    id: '3',
    name: 'Ropsten Testnet',
    key: 'ropsten',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://ropsten.etherscan.io',
    rpcUrls: []
  },
  '0x4': {
    id: '4',
    name: 'Rinkeby Testnet',
    key: 'rinkeby',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://rinkeby.etherscan.io',
    rpcUrls: []
  },
  '0x5': {
    id: '5',
    name: 'Goerli Testnet',
    key: 'goerli',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://goerli.etherscan.io',
    rpcUrls: []
  },
  '0x2a': {
    id: '42',
    name: 'Kovan Testnet',
    key: 'kovan',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://kovan.etherscan.io',
    rpcUrls: [],
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${REACT_APP_GOVERNANCE_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x501': {
    id: '1281',
    name: 'Moonbase Local',
    key: 'moonbase-local',
    currency: DEV,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: ['http://localhost:9933']
  },
  '0x505': {
    id: '1285',
    name: 'Moonriver',
    key: 'moonriver',
    currency: MOVR,
    decimals: 18,
    explorerURL: 'https://moonriver.moonscan.io',
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    buyEc20Url: `//app.sushi.com/swap?inputCurrency=&outputCurrency=${REACT_APP_GOVERNANCE_CONTRACT_ADDRESS}`
  },
  '0x507': {
    id: '1287',
    name: 'Moonbase Alpha',
    key: 'moonbase-alpha',
    currency: DEV,
    decimals: 18,
    explorerURL: 'https://moonbase-blockscout.testnet.moonbeam.network',
    rpcUrls: ['https://rpc.testnet.moonbeam.network']
  },
  '0x539': {
    id: '1337',
    name: 'Local Testnet',
    key: 'local',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: ['http://localhost:8545'],
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${REACT_APP_GOVERNANCE_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x270f': {
    id: '9999',
    name: 'Unknown',
    key: 'unknown',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: []
  }
};

export default NETWORKS;
