import { useCallback, useMemo } from 'react';

import { features } from 'config';
import type { Market } from 'models/market';

import useAppSelector from 'hooks/useAppSelector';
import useUserOperations from 'hooks/useUserOperations';

type Outcomes = Record<number, Record<'shares' | 'price', number>>;

export default function useOperation(
  market: Pick<Market, 'outcomes' | 'id' | 'networkId'>
) {
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const isLoading = useAppSelector(
    state => state.polkamarkets.isLoading.portfolio
  );
  const userOperations = useUserOperations();

  const data = useMemo(
    () =>
      userOperations.data?.filter(
        ({ networkId, marketId, outcomeId }) =>
          networkId === +market.networkId &&
          marketId === +market.id &&
          market?.outcomes.some(outcome => +outcome.id === outcomeId)
      )?.[0],
    [market.id, market.networkId, market?.outcomes, userOperations.data]
  );

  const predictedOutcomes = useMemo(() => {
    if (
      isLoading ||
      !portfolio?.[market.id]?.outcomes ||
      !features.fantasy.enabled
    )
      return [];

    return Object.entries(portfolio[market.id].outcomes as Outcomes)
      .filter(([_, { shares }]) => shares > 1e0)
      .map(([outcomeId]) => market.outcomes?.[+outcomeId]);
  }, [isLoading, market.id, market.outcomes, portfolio]);

  // Criteria for the outcome status
  // 1. If there's a pending user operation, always show the pending status
  // 2. If user holds an outcome on portfolio, show success (using the portfolio condition, not the operation success status)
  // 3. If user has a failed operation, show the failed status

  const getOutcomeStatus = useCallback(
    (id: number) => {
      if (data?.status === 'pending' && data.outcomeId === id) return 'pending';
      // if (data?.status === 'pending' && data.outcomeId !== id) return undefined;
      if (
        predictedOutcomes.length > 0 &&
        predictedOutcomes.some(outcome => outcome.id === id)
      ) {
        return 'success';
      }
      if (
        predictedOutcomes.length > 0 &&
        !predictedOutcomes.some(outcome => outcome.id === id)
      ) {
        return undefined;
      }
      if (data?.status === 'failed' && data.outcomeId === id && !isLoading)
        return 'failed';
      if (
        data?.status === 'success' &&
        data.outcomeId === id &&
        data?.action === 'buy'
      ) {
        return 'success';
      }
      return undefined;
    },
    [data, isLoading, predictedOutcomes]
  );

  const getMultipleOutcomesStatus = useCallback(
    (ids: number[]) => {
      if (data?.status === 'pending' && ids.some(id => data.outcomeId === id)) {
        return 'pending';
      }
      if (
        data?.status === 'pending' &&
        !ids.some(id => data.outcomeId === id)
      ) {
        return undefined;
      }
      if (
        predictedOutcomes.length > 0 &&
        ids.some(id => predictedOutcomes.some(outcome => outcome.id === id))
      ) {
        return 'success';
      }
      if (
        predictedOutcomes.length > 0 &&
        !ids.some(id => predictedOutcomes.some(outcome => outcome.id === id))
      ) {
        return undefined;
      }
      if (
        data?.status === 'failed' &&
        ids.some(id => data.outcomeId === id) &&
        !isLoading
      ) {
        return 'failed';
      }
      if (
        data?.status === 'success' &&
        ids.some(id => data.outcomeId === id) &&
        data?.action === 'buy'
      ) {
        return 'success';
      }
      return undefined;
    },
    [data, isLoading, predictedOutcomes]
  );

  const getMarketStatus = useCallback(() => {
    if (data?.status === 'pending') return 'pending';
    if (predictedOutcomes.length > 0) return 'success';
    if (data?.status === 'failed' && !isLoading) return 'failed';
    if (data?.status === 'success' && data?.action === 'buy') return 'success';
    return undefined;
  }, [data, isLoading, predictedOutcomes]);

  return {
    data,
    getOutcomeStatus,
    getMultipleOutcomesStatus,
    getMarketStatus
  };
}
