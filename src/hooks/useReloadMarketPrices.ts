import { useCallback } from 'react';

import { Market } from 'models/market';

import useAppDispatch from 'hooks/useAppDispatch';
import useNetwork from 'hooks/useNetwork';

export default function useReloadMarketPrices({
  id: marketId
}: Pick<Market, 'id'>) {
  const dispatch = useAppDispatch();
  const { networkConfig } = useNetwork();

  return useCallback(async () => {
    const { default: PolkamarketsService } = await import(
      'services/PolkamarketsService'
    );
    const markets = await import('redux/ducks/markets');
    const market = await import('redux/ducks/market');
    const marketData = await new PolkamarketsService(
      networkConfig
    ).getMarketData(marketId);

    marketData.outcomes.forEach((outcomeData, outcomeId) => {
      const data = { price: outcomeData.price, shares: outcomeData.shares };

      // updating both market/markets redux
      dispatch(markets.changeMarketOutcomeData({ marketId, outcomeId, data }));
      dispatch(market.changeOutcomeData({ marketId, outcomeId, data }));
      dispatch(
        markets.changeMarketData({
          marketId,
          data: { liquidity: marketData.liquidity }
        })
      );
      dispatch(
        market.changeData({ data: { liquidity: marketData.liquidity } })
      );
    });
  }, [dispatch, marketId, networkConfig]);
}
