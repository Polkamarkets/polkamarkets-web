/* eslint-disable import/prefer-default-export */
import { ArrowDownSmallestIcom, ArrowUpSmallestIcon } from 'assets/icons';

const filters = [
  {
    value: 'expiresAt',
    name: 'Expiration Date',
    optionalTriggers: [
      {
        name: 'asc',
        icon: <ArrowUpSmallestIcon />
      },
      {
        name: 'desc',
        icon: <ArrowDownSmallestIcom />
      }
    ]
  },
  {
    value: 'volume',
    name: 'Volume',
    optionalTriggers: [
      {
        name: 'asc',
        icon: <ArrowUpSmallestIcon />
      },
      {
        name: 'desc',
        icon: <ArrowDownSmallestIcom />
      }
    ]
  },
  {
    value: 'liquidity',
    name: 'Liquidity',
    optionalTriggers: [
      {
        name: 'asc',
        icon: <ArrowUpSmallestIcon />
      },
      {
        name: 'desc',
        icon: <ArrowDownSmallestIcom />
      }
    ]
  },
  {
    value: 'id',
    name: 'Newest',
    optionalTriggers: [
      {
        name: 'asc',
        icon: <ArrowUpSmallestIcon />
      },
      {
        name: 'desc',
        icon: <ArrowDownSmallestIcom />
      }
    ]
  }
];

export { filters };
