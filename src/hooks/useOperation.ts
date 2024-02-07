import { useCallback, useMemo } from 'react';

import { features } from 'config';
import type { Market, Outcome } from 'models/market';

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
          market?.outcomes.some(
            predictedOutcome => +predictedOutcome.id === outcomeId
          )
      )?.[0],
    [market.id, market.networkId, market?.outcomes, userOperations.data]
  );
  const predictedOutcome = useMemo(() => {
    if (
      isLoading ||
      !portfolio?.[market.id]?.outcomes ||
      !features.fantasy.enabled
    )
      return null;

    return Object.entries(portfolio[market.id].outcomes as Outcomes).reduce(
      (acc, [outcomeId, { shares }]) =>
        shares > 1 ? market.outcomes?.[outcomeId] : acc,
      null as Outcome | null
    );
  }, [isLoading, market.id, market.outcomes, portfolio]);

  // Criteria for the outcome status
  // 1. If there's a pending user operation, always show the pending status
  // 2. If user holds an outcome on portfolio, show success (using the portfolio condition, not the operation success status)
  // 3. If user has a failed operation, show the failed status

  const getOutcomeStatus = useCallback(
    (id: number) => {
      if (data?.status === 'pending' && data.outcomeId === id) return 'pending';
      if (data?.status === 'pending' && data.outcomeId !== id) return undefined;
      if (predictedOutcome && predictedOutcome.id === id) return 'success';
      if (predictedOutcome && predictedOutcome.id !== id) return undefined;
      if (data?.status === 'failed' && data.outcomeId === id && !isLoading)
        return 'failed';
      return undefined;
    },
    [data, isLoading, predictedOutcome]
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
      if (predictedOutcome && ids.some(id => predictedOutcome.id === id)) {
        return 'success';
      }
      if (predictedOutcome && !ids.some(id => predictedOutcome.id === id)) {
        return undefined;
      }
      if (
        data?.status === 'failed' &&
        ids.some(id => data.outcomeId === id) &&
        !isLoading
      ) {
        return 'failed';
      }
      return undefined;
    },
    [data, isLoading, predictedOutcome]
  );

  const getMarketStatus = useCallback(() => {
    if (data?.status === 'pending') return 'pending';
    if (predictedOutcome) return 'success';
    if (data?.status === 'failed' && !isLoading) return 'failed';
    return undefined;
  }, [data, isLoading, predictedOutcome]);

  return {
    data,
    predictedOutcome,
    getOutcomeStatus,
    getMultipleOutcomesStatus,
    getMarketStatus
  };
}
