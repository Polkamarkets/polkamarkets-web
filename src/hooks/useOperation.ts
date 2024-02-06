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
        shares > 1e-5 ? market.outcomes?.[outcomeId] : acc,
      null as Outcome | null
    );
  }, [isLoading, market.id, market.outcomes, portfolio]);

  const getStatus = useCallback(
    (id: number) => {
      if (data) {
        if (data.outcomeId === id) return data.status;
      } else if (predictedOutcome?.id === id) return 'success';
      return undefined;
    },
    [data, predictedOutcome?.id]
  );

  return {
    data,
    predictedOutcome,
    getStatus
  };
}
