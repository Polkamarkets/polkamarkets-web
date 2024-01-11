import { Currency } from 'types/currency';

import {
  EthereumIcon,
  MoonbeamIcon,
  MoonriverIcon,
  PolygonIcon,
  TokenIcon
} from 'assets/icons';

const currencies: { [key: string]: Currency } = Object.freeze({
  DEV: {
    name: 'Dev',
    ticker: 'DEV',
    symbol: 'Ξ',
    icon: <EthereumIcon />,
    iconName: 'Ethereum'
  },
  ETH: {
    name: 'Ethereum',
    ticker: 'ETH',
    symbol: 'Ξ',
    icon: <EthereumIcon />,
    iconName: 'Ethereum'
  },
  MOVR: {
    name: 'MOVR',
    ticker: 'MOVR',
    symbol: 'MOVR',
    icon: <MoonriverIcon />,
    iconName: 'Moonriver'
  },
  GLMR: {
    name: 'Moonbeam',
    ticker: 'GLMR',
    symbol: 'GLMR',
    icon: <MoonbeamIcon />,
    iconName: 'Moonbeam'
  },
  MATIC: {
    name: 'Polygon',
    ticker: 'MATIC',
    symbol: 'MATIC',
    icon: <PolygonIcon />,
    iconName: 'Polygon'
  },
  TOKEN: {
    name: 'Token',
    ticker: 'TOKEN',
    symbol: 'TOKEN',
    icon: <TokenIcon ticker="TOK" />,
    iconName: 'Token'
  },
  XDAI: {
    name: 'xDAI',
    ticker: 'XDAI',
    symbol: 'xDAI',
    icon: <TokenIcon ticker="XDAI" />,
    iconName: 'Token'
  }
});

export default currencies;
