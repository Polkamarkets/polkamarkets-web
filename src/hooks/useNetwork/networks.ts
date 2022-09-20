import { environment } from 'config';
import { Currency } from 'types/currency';

import { DEV, ETH, MOVR, GLMR } from 'hooks/useNetwork/currencies';

export type Network = {
  id: string;
  name: string;
  key: string;
  colorAccent: 'blue' | 'orange' | 'green';
  currency: Currency;
  decimals: number;
  explorerURL: string;
  rpcUrls: Array<string>;
  buyEc20Url?: string;
};

const NETWORKS: {
  [key: string]: Network;
} = {
  '0x1': {
    id: '1',
    name: 'Ethereum Mainnet',
    key: 'mainnet',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: []
  },
  '0x3': {
    id: '3',
    name: 'Ropsten Testnet',
    key: 'ropsten',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://ropsten.etherscan.io',
    rpcUrls: []
  },
  '0x4': {
    id: '4',
    name: 'Rinkeby Testnet',
    key: 'rinkeby',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://rinkeby.etherscan.io',
    rpcUrls: []
  },
  '0x5': {
    id: '5',
    name: 'Goerli Testnet',
    key: 'goerli',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://goerli.etherscan.io',
    rpcUrls: []
  },
  '0x2a': {
    id: '42',
    name: 'Kovan Testnet',
    key: 'kovan',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://kovan.etherscan.io',
    rpcUrls: [],
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${environment.ERC20_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x501': {
    id: '1281',
    name: 'Moonbase Local',
    key: 'moonbase-local',
    colorAccent: 'blue',
    currency: DEV,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: ['http://localhost:9933']
  },
  '0x504': {
    id: '1284',
    name: 'Moonbeam',
    key: 'moonbeam',
    colorAccent: 'green',
    currency: GLMR,
    decimals: 18,
    explorerURL: 'https://moonbeam.moonscan.io',
    rpcUrls: ['https://rpc.api.moonbeam.network'],
    buyEc20Url: `//app.solarflare.io/exchange/swap?outputCurrency=${environment.ERC20_CONTRACT_ADDRESS}`
  },
  '0x505': {
    id: '1285',
    name: 'Moonriver',
    key: 'moonriver',
    colorAccent: 'orange',
    currency: MOVR,
    decimals: 18,
    explorerURL: 'https://moonriver.moonscan.io',
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    buyEc20Url: `//app.sushi.com/swap?inputCurrency=&outputCurrency=${environment.ERC20_CONTRACT_ADDRESS}`
  },
  '0x507': {
    id: '1287',
    name: 'Moonbase Alpha',
    key: 'moonbase-alpha',
    colorAccent: 'blue',
    currency: DEV,
    decimals: 18,
    explorerURL: 'https://moonbase-blockscout.testnet.moonbeam.network',
    rpcUrls: ['https://rpc.testnet.moonbeam.network']
  },
  '0x539': {
    id: '1337',
    name: 'Local Testnet',
    key: 'local',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: ['http://localhost:8545'],
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${environment.ERC20_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x270f': {
    id: '9999',
    name: 'Unknown',
    key: 'unknown',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: []
  }
};

export default NETWORKS;
