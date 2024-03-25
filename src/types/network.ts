import { Currency } from './currency';

export type Network = {
  id: string;
  name: string;
  key: string;
  colorAccent: 'blue' | 'orange' | 'green' | 'purple';
  currency: Currency;
  decimals: number;
  explorerURL: string;
  rpcUrls: string[];
  buyEc20Url?: string;
  viemChain?: any;
};
