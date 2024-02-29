import { environment, ui, pages } from 'config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { camelize } from 'humps';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import type { GetTournamentsData } from 'services/Polkamarkets/types';
import type { Network } from 'types/network';

import type { Filters, FiltersState, Option } from './filters.type';

dayjs.extend(utc);

const extraFilters = ui.filters.extra.filters;

const fantasyTokenTicker = environment.FEATURE_FANTASY_TOKEN_TICKER
  ? environment.FEATURE_FANTASY_TOKEN_TICKER
  : undefined;

const defaultRangeOptions: Option[] = [
  { label: 'Any', value: 'any' },
  {
    label: fantasyTokenTicker ? `Under 10 ${fantasyTokenTicker}` : 'Under €10',
    value: '0-10'
  },
  {
    label: fantasyTokenTicker
      ? `10 ${fantasyTokenTicker} - 100 ${fantasyTokenTicker}`
      : '€10 - €100',
    value: '10-100'
  },
  {
    label: fantasyTokenTicker
      ? `100 ${fantasyTokenTicker} - 1000 ${fantasyTokenTicker}`
      : '€100 - €1000',
    value: '100-1000'
  },
  {
    label: fantasyTokenTicker
      ? `Over 1000 ${fantasyTokenTicker}`
      : 'Over €1000',
    value: '1000-'
  }
];

const defaultDateRangeOptions: Option[] = [
  {
    label: 'Any',
    value: 'any'
  },
  {
    label: 'Ends today',
    value: `${dayjs().utc().startOf('day')}-${dayjs().utc().endOf('day')}`
  },
  {
    label: 'End this week',
    value: `${dayjs().utc().startOf('week')}-${dayjs().utc().endOf('week')}`
  },
  {
    label: 'End this month',
    value: `${dayjs().utc().startOf('month')}-${dayjs().utc().endOf('month')}`
  }
];

const categoriesOptionsFromEnvironment = ui.filters.categories.options?.map(
  category => ({
    label: category,
    value: category
  })
);

const filters: Filters = {
  toggles: {
    favorites: {
      title: 'Favorites',
      enabled: ui.filters.favorites.enabled
    }
  },
  dropdowns: {
    states: {
      title: 'State',
      options: [
        {
          label: 'Open',
          value: 'open'
        },
        {
          label: 'Closed',
          value: 'closed'
        },
        {
          label: 'Resolved',
          value: 'resolved'
        }
      ],
      multiple: true,
      enabled: ui.filters.states.enabled
    },
    networks: {
      title: 'Network',
      options: [],
      multiple: true,
      enabled: false
    },
    tokens: {
      title: 'Token',
      options: [
        ...ui.filters.tokens.map(token => ({
          label: token,
          value: token
        })),
        {
          label: 'Other',
          value: 'other'
        }
      ],
      multiple: true,
      enabled: false
    },
    volume: {
      title: 'Volume',
      options: defaultRangeOptions,
      multiple: false,
      enabled: ui.filters.volume.enabled
    },
    liquidity: {
      title: 'Liquidity',
      options: defaultRangeOptions,
      multiple: false,
      enabled: false
    },
    endDate: {
      title: 'End Date',
      options: [
        ...defaultDateRangeOptions,
        {
          label: 'Custom',
          value: 'custom'
        }
      ],
      multiple: false,
      enabled: ui.filters.endDate.enabled
    },
    categories: {
      title: 'Category',
      options: categoriesOptionsFromEnvironment,
      multiple: true,
      enabled: ui.filters.categories.enabled
    },
    tournaments: {
      title: 'Tournament',
      options: [],
      multiple: true,
      enabled: ui.filters.tournaments.enabled
    }
  }
};

function addNetworks(networks: Network[]): Filters {
  const networksOptions = networks.map(network => ({
    label: network.name,
    value: network.id
  }));

  return set(filters, 'dropdowns.networks.options', networksOptions);
}

function addTournaments(tournaments: GetTournamentsData | undefined): Filters {
  const tournamentsOptions =
    tournaments?.map(tournament => ({
      label: tournament.title,
      value: `${tournament.slug},${tournament.networkId}${
        tournament.markets
          ? `,${tournament.markets.map(market => market.id).join(',')}`
          : ''
      }`
    })) || [];

  if (pages.tournaments.enabled) {
    return set(filters, 'dropdowns.tournaments.enabled', false);
  }

  // disabling tournaments view if there are no tournaments from query
  if (tournaments?.length === 0) {
    return set(filters, 'dropdowns.tournaments.enabled', false);
  }

  return set(filters, 'dropdowns.tournaments.options', tournamentsOptions);
}

const dropdownsKeys = Object.keys(filters.dropdowns);

function sanitizeFilterKey(key: string) {
  return camelize(key.replace(/[^\w ]/g, ''));
}

function addExtraFilters() {
  if (isEmpty(extraFilters)) return filters;

  const extraFiltersOptions = {};

  extraFilters
    .filter(filter => !dropdownsKeys.includes(filter.name))
    .forEach(filter => {
      extraFiltersOptions[`${sanitizeFilterKey(filter.name)}`] = {
        title: filter.name,
        options: filter.values.map(option => ({
          label: option,
          value: option.toLowerCase()
        })),
        multiple: filter.multiple,
        enabled: true
      };
    });

  return set(filters, 'dropdowns', {
    ...filters.dropdowns,
    ...extraFiltersOptions
  });
}

const filtersInitialState: FiltersState = {
  toggles: {
    favorites: false
  },
  dropdowns: {
    states: ['open'],
    networks: [],
    tokens: [],
    volume: 'any',
    liquidity: 'any',
    endDate: 'any',
    categories: [],
    tournaments: [],
    ...extraFilters.reduce((acc, filter) => {
      acc[`${sanitizeFilterKey(filter.name)}`] = filter.multiple
        ? []
        : filter.values[0];
      return acc;
    }, {})
  }
};

export {
  filters,
  addNetworks,
  addTournaments,
  addExtraFilters,
  filtersInitialState,
  sanitizeFilterKey
};
