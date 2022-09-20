import { Currency } from 'types/currency';

import { EthereumIcon, MoonbeamIcon, MoonriverIcon } from 'assets/icons';

const DEV: Currency = {
  name: 'Dev',
  ticker: 'DEV',
  symbol: 'Ξ',
  icon: <EthereumIcon />
};

const ETH: Currency = {
  name: 'Ethereum',
  ticker: 'ETH',
  symbol: 'Ξ',
  icon: <EthereumIcon />
};

const MOVR: Currency = {
  name: 'MOVR',
  ticker: 'MOVR',
  symbol: 'MOVR',
  icon: <MoonriverIcon />
};

const GLMR: Currency = {
  name: 'Moonbeam',
  ticker: 'GLMR',
  symbol: 'GLMR',
  icon: <MoonbeamIcon />
};

export { DEV, ETH, MOVR, GLMR };
