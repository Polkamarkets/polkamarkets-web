import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from 'config';
import { camelizeKeys } from 'humps';
import uniq from 'lodash/uniq';

import {
  getAchievementsTransformResponse,
  getLeaderboardByAddressTransformResponse,
  getLeaderboardByTimeframeTransformResponse,
  getPortfolioByAddressTransformResponse,
  getPortfolioFeedByAddressTransformResponse
} from './functions';
import {
  GetMarketBySlugArgs,
  GetMarketBySlugData,
  GetMarketsByStateArgs,
  GetMarketsByStateData,
  GetMarketsByIdsArgs,
  GetMarketsByIdsData,
  ReloadMarketBySlugArgs,
  ReloadMarketBySlugData,
  CreateMarketByIdArgs,
  CreateMarketByIdData,
  GetPortfolioByAddressArgs,
  GetPortfolioByAddressData,
  ReloadPortfolioByAddressArgs,
  ReloadPortfolioByAddressData,
  GetAchievementsArgs,
  GetAchievementsData,
  GetLeaderboardByTimeframeData,
  GetLeaderboardByTimeframeArgs,
  GetLeaderboardByAddressData,
  GetLeaderboardByAddressArgs,
  GetPortfolioFeedByAddressData,
  GetPortfolioFeedByAddressArgs
} from './types';

function camelize<T extends object>(response: T): T {
  return camelizeKeys(response) as T;
}

const polkamarketsApi = createApi({
  reducerPath: 'polkamarketsApi',
  baseQuery: fetchBaseQuery({ baseUrl: environment.POLKAMARKETS_API_URL }),
  endpoints: builder => ({
    getMarketBySlug: builder.query<GetMarketBySlugData, GetMarketBySlugArgs>({
      query: ({ slug }) => `/markets/${slug}`,
      transformResponse: (response: GetMarketBySlugData) => camelize(response)
    }),
    getMarketsByState: builder.query<
      GetMarketsByStateData,
      GetMarketsByStateArgs
    >({
      query: ({ state }) => `/markets?state=${state}`,
      transformResponse: (response: GetMarketsByStateData) => camelize(response)
    }),
    getMarketsByIds: builder.query<GetMarketsByIdsData, GetMarketsByIdsArgs>({
      query: ({ ids, networkId }) =>
        `/markets?id=${uniq(ids).join(',')}&network_id=${networkId}`,
      transformResponse: (response: GetMarketsByIdsData) => camelize(response)
    }),
    reloadMarketBySlug: builder.mutation<
      ReloadMarketBySlugData,
      ReloadMarketBySlugArgs
    >({
      query: ({ slug }) => ({
        url: `/markets/${slug}/reload`,
        method: 'POST'
      })
    }),
    createMarketById: builder.mutation<
      CreateMarketByIdData,
      CreateMarketByIdArgs
    >({
      query: ({ id }) => ({
        url: `/markets/`,
        method: 'POST',
        body: {
          id
        }
      }),
      transformResponse: (response: CreateMarketByIdData) => camelize(response)
    }),
    getPortfolioByAddress: builder.query<
      GetPortfolioByAddressData,
      GetPortfolioByAddressArgs
    >({
      query: ({ address, networkId }) =>
        `/portfolios/${address}?network_id=${networkId}`,
      transformResponse: (response: GetPortfolioByAddressData) =>
        getPortfolioByAddressTransformResponse(camelize(response))
    }),
    reloadPortfolioByAddress: builder.mutation<
      ReloadPortfolioByAddressData,
      ReloadPortfolioByAddressArgs
    >({
      query: ({ address }) => ({
        url: `/portfolios/${address}/reload`,
        method: 'POST'
      })
    }),
    getAchievements: builder.query<GetAchievementsData, GetAchievementsArgs>({
      query: ({ networkId }) => `/achievements?network_id=${networkId}`,
      transformResponse: (response: GetAchievementsData) =>
        getAchievementsTransformResponse(camelize(response))
    }),
    getLeaderboardByTimeframe: builder.query<
      GetLeaderboardByTimeframeData,
      GetLeaderboardByTimeframeArgs
    >({
      query: ({ timeframe, networkId }) =>
        `/leaderboards?timeframe=${timeframe}&network_id=${networkId}`,
      transformResponse: (response: GetLeaderboardByTimeframeData) =>
        getLeaderboardByTimeframeTransformResponse(camelize(response))
    }),
    getLeaderboardByAddress: builder.query<
      GetLeaderboardByAddressData,
      GetLeaderboardByAddressArgs
    >({
      query: ({ address, timeframe, networkId }) =>
        `/leaderboards/${address}?timeframe=${timeframe}&network_id=${networkId}`,
      transformResponse: (response: GetLeaderboardByAddressData) =>
        getLeaderboardByAddressTransformResponse(camelize(response))
    }),
    getPortfolioFeedByAddress: builder.query<
      GetPortfolioFeedByAddressData,
      GetPortfolioFeedByAddressArgs
    >({
      query: ({ address, networkId }) =>
        `/portfolios/${address}/feed?network_id=${networkId}`,
      transformResponse: (response: GetPortfolioFeedByAddressData) =>
        getPortfolioFeedByAddressTransformResponse(camelize(response))
    })
  })
});

export default polkamarketsApi;

export const {
  useGetMarketBySlugQuery,
  useGetMarketsByStateQuery,
  useGetMarketsByIdsQuery,
  useReloadMarketBySlugMutation,
  useCreateMarketByIdMutation,
  useGetPortfolioByAddressQuery,
  useReloadPortfolioByAddressMutation,
  useGetAchievementsQuery,
  useGetLeaderboardByTimeframeQuery,
  useGetLeaderboardByAddressQuery,
  useGetPortfolioFeedByAddressQuery
} = polkamarketsApi;
