import { Network } from 'types/network';
import {
  gnosis,
  gnosisChiado,
  goerli,
  localhost,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  moonriver,
  polygon,
  polygonMumbai,
  polygonZkEvm
} from 'viem/chains';

import currencies from './currencies';
import environment from './environment';

const { ERC20_CONTRACT_ADDRESS } = environment;

const { DEV, ETH, MOVR, GLMR, MATIC, XDAI } = currencies;

const networks: {
  [key: string]: Network;
} = Object.freeze({
  '0x1': {
    id: '1',
    name: 'Ethereum Mainnet',
    key: 'mainnet',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://etherscan.io',
    rpcUrls: [],
    viemChain: mainnet
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
    rpcUrls: [],
    viemChain: goerli
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
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${ERC20_CONTRACT_ADDRESS}&inputCurrency=ETH`
  },
  '0x64': {
    id: '100',
    name: 'Gnosis',
    key: 'gnosis',
    colorAccent: 'blue',
    currency: XDAI,
    decimals: 18,
    explorerURL: 'https://gnosisscan.io',
    rpcUrls: ['https://rpc.gnosischain.com'],
    viemChain: gnosis
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
    buyEc20Url: `//app.solarflare.io/exchange/swap?outputCurrency=${ERC20_CONTRACT_ADDRESS}`,
    viemChain: moonbeam
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
    buyEc20Url: `//app.sushi.com/swap?inputCurrency=&outputCurrency=${ERC20_CONTRACT_ADDRESS}`,
    viemChain: moonriver
  },
  '0x507': {
    id: '1287',
    name: 'Moonbase Alpha',
    key: 'moonbase-alpha',
    colorAccent: 'blue',
    currency: DEV,
    decimals: 18,
    explorerURL: 'https://moonbase-blockscout.testnet.moonbeam.network',
    rpcUrls: ['https://rpc.testnet.moonbeam.network'],
    viemChain: moonbaseAlpha
  },
  '0x89': {
    id: '137',
    name: 'Polygon Mainnet',
    key: 'polygon',
    colorAccent: 'purple',
    currency: MATIC,
    decimals: 18,
    explorerURL: 'https://polygonscan.com/',
    rpcUrls: ['https://polygon-rpc.com'],
    viemChain: polygon
  },
  '0x44d': {
    id: '1101',
    name: 'Polygon zkEVM',
    key: 'zkevm',
    colorAccent: 'purple',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://zkevm.polygonscan.com',
    rpcUrls: ['https://zkevm-rpc.com'],
    viemChain: polygonZkEvm
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
    buyEc20Url: `//app.uniswap.org/#/swap?outputCurrency=${ERC20_CONTRACT_ADDRESS}&inputCurrency=ETH`,
    viemChain: localhost
  },
  '0x5a2': {
    id: '1442',
    name: 'zkEVM Testnet',
    key: 'zkevm-testnet',
    colorAccent: 'blue',
    currency: ETH,
    decimals: 18,
    explorerURL: 'https://testnet-zkevm.polygonscan.com',
    rpcUrls: ['https://rpc.public.zkevm-test.net']
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
  },
  '0x27d8': {
    id: '10200',
    name: 'Chiado',
    key: 'chiado',
    colorAccent: 'blue',
    currency: XDAI,
    decimals: 18,
    explorerURL: 'https://gnosis-chiado.blockscout.com/',
    rpcUrls: ['https://rpc.chiadochain.net'],
    viemChain: gnosisChiado
  },
  '0x13881': {
    id: '80001',
    name: 'Mumbai Testnet',
    key: 'mumbai',
    colorAccent: 'blue',
    currency: MATIC,
    decimals: 18,
    explorerURL: 'https://mumbai.polygonscan.com',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    viemChain: polygonMumbai
  }
});

export default networks;
