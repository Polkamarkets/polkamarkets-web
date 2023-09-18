import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from 'config';
import { camelizeKeys } from 'humps';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import uniq from 'lodash/uniq';

import {
  getAchievementsTransformResponse,
  getLeaderboardByAddressTransformResponse,
  getLeaderboardByTimeframeTransformResponse,
  getPortfolioByAddressTransformResponse
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
  GetPortfolioFeedByAddressArgs,
  CreateLeaderboardGroupData,
  CreateLeaderboardGroupParams,
  GetLeaderboardGroupBySlugData,
  GetLeaderboardGroupBySlugArgs,
  EditLeaderboardGroupData,
  EditLeaderboardGroupParams,
  GetLeaderboardGroupsByUserData,
  GetLeaderboardGroupsByUserArgs,
  JoinLeaderboardGroupData,
  JoinLeaderboardGroupParams,
  GetTournamentsData,
  GetTournamentBySlugData,
  GetTournamentBySlugArgs
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
      query: ({ timeframe, networkId, tournamentId }) => ({
        url: `/leaderboards`,
        params: pickBy(
          {
            timeframe,
            network_id: networkId,
            tournament_id: tournamentId
          },
          identity
        )
      }),
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
    createLeaderboardGroup: builder.mutation<
      CreateLeaderboardGroupData,
      CreateLeaderboardGroupParams
    >({
      query: ({ title, users, imageHash, createdBy }) => ({
        url: `/group_leaderboards`,
        method: 'POST',
        body: pickBy(
          {
            title,
            users,
            image_hash: imageHash,
            created_by: createdBy
          },
          identity
        )
      }),
      transformResponse: (response: CreateLeaderboardGroupData) =>
        camelize(response)
    }),
    editLeaderboardGroup: builder.mutation<
      EditLeaderboardGroupData,
      EditLeaderboardGroupParams
    >({
      query: ({ slug, title, imageHash, users }) => ({
        url: `/group_leaderboards/${slug}`,
        method: 'PUT',
        body: {
          title,
          image_hash: imageHash,
          users
        }
      }),
      transformResponse: (response: EditLeaderboardGroupData) =>
        camelize(response)
    }),
    joinLeaderboardGroup: builder.mutation<
      JoinLeaderboardGroupData,
      JoinLeaderboardGroupParams
    >({
      query: ({ slug, user }) => ({
        url: `/group_leaderboards/${slug}/join`,
        method: 'POST',
        body: {
          user
        }
      })
    }),
    getLeaderboardGroupBySlug: builder.query<
      GetLeaderboardGroupBySlugData,
      GetLeaderboardGroupBySlugArgs
    >({
      query: ({ slug }) => `/group_leaderboards/${slug}`,
      transformResponse: (response: GetLeaderboardGroupBySlugData) =>
        camelize(response)
    }),
    getLeaderboardGroupsByUser: builder.query<
      GetLeaderboardGroupsByUserData,
      GetLeaderboardGroupsByUserArgs
    >({
      query: ({ user }) => `/group_leaderboards/?user=${user}`,
      transformResponse: (response: GetLeaderboardGroupsByUserData) =>
        camelize(response)
    }),
    getTournaments: builder.query<GetTournamentsData, void>({
      query: () => `/tournaments`,
      transformResponse: (response: GetTournamentsData) => camelize(response)
    }),
    getTournamentBySlug: builder.query<
      GetTournamentBySlugData,
      GetTournamentBySlugArgs
    >({
      query: ({ slug }) => `/tournaments/${slug}`,
      transformResponse: (response: GetTournamentBySlugData) =>
        camelize(response)
    }),
    getPortfolioFeedByAddress: builder.query<
      GetPortfolioFeedByAddressData,
      GetPortfolioFeedByAddressArgs
    >({
      query: ({ address, networkId }) =>
        `/portfolios/${address}/feed?network_id=${networkId}`,
      transformResponse: (response: GetPortfolioFeedByAddressData) =>
        camelize(response)
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
  useCreateLeaderboardGroupMutation,
  useEditLeaderboardGroupMutation,
  useJoinLeaderboardGroupMutation,
  useGetLeaderboardGroupBySlugQuery,
  useGetLeaderboardGroupsByUserQuery,
  useGetTournamentsQuery,
  useGetTournamentBySlugQuery,
  useGetPortfolioFeedByAddressQuery
} = polkamarketsApi;
