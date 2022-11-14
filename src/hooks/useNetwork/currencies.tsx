import { Currency } from 'types/currency';

import { EthereumIcon, MoonbeamIcon, MoonriverIcon } from 'assets/icons';

const DEV: Currency = {
  name: 'Dev',
  ticker: 'DEV',
  symbol: 'Ξ',
  icon: <EthereumIcon />,
  iconName: 'Ethereum'
};

const ETH: Currency = {
  name: 'Ethereum',
  ticker: 'ETH',
  symbol: 'Ξ',
  icon: <EthereumIcon />,
  iconName: 'Ethereum'
};

const MOVR: Currency = {
  name: 'MOVR',
  ticker: 'MOVR',
  symbol: 'MOVR',
  icon: <MoonriverIcon />,
  iconName: 'Moonriver'
};

const GLMR: Currency = {
  name: 'Moonbeam',
  ticker: 'GLMR',
  symbol: 'GLMR',
  icon: <MoonbeamIcon />,
  iconName: 'Moonbeam'
};

export { DEV, ETH, MOVR, GLMR };
