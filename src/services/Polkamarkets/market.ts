import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import { Market } from 'models/market';

import api, { polkamarketsApiUrl } from './api';
import { GetMarketsByStateArgs, GetMarketsByIdsArgs } from './types';

async function getMarket(marketSlug: string) {
  const url = `${polkamarketsApiUrl}/markets/${marketSlug}`;
  return api.get<Market>(url);
}

const getMarketsAbortControllers: { [key: string]: any } = {
  open: undefined,
  closed: undefined,
  resolved: undefined
};

async function getMarkets({ state, networkId }: GetMarketsByStateArgs) {
  if (typeof getMarketsAbortControllers[state] !== typeof undefined) {
    getMarketsAbortControllers[state].abort();
  }

  getMarketsAbortControllers[state] = new AbortController();

  const url = `${polkamarketsApiUrl}/markets`;
  return api.get<Market[]>(url, {
    params: pickBy(
      {
        state,
        network_id: networkId
      },
      identity
    ),
    signal: getMarketsAbortControllers[state].signal
  });
}

async function getMarketsByIds({ ids, networkId }: GetMarketsByIdsArgs) {
  const url = `${polkamarketsApiUrl}/markets`;
  return api.get<Market[]>(url, {
    params: pickBy(
      {
        id: ids.join(','),
        network_id: networkId
      },
      identity
    )
  });
}

async function reloadMarket(marketSlug: string) {
  const url = `${polkamarketsApiUrl}/markets/${marketSlug}/reload`;
  return api.post(url);
}

async function createMarket(marketId: string, networkId: string | number) {
  const url = `${polkamarketsApiUrl}/markets/`;
  return api.post(url, { id: marketId, network_id: networkId });
}

export { getMarkets, getMarket, getMarketsByIds, reloadMarket, createMarket };
