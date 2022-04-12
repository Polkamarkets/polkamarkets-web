import { useCallback, useMemo } from 'react';

import { fromPriceChartToLineChartSeries } from 'helpers/chart';
import { Market, Outcome } from 'models/market';

import { useAppSelector } from 'hooks';

import MarketOutcome from './MarketOutcome';

type MarketOutcomesProps = {
  market: Market;
};

function MarketOutcomes({ market }: MarketOutcomesProps) {
  const { outcomes, resolvedOutcomeId } = market;

  const { selectedMarketId, selectedOutcomeId } = useAppSelector(
    state => state.trade
  );

  const isMarketResolved = market.state === 'resolved';
  const isMarketVoided = market.voided;

  const buildOutcomeObject = useCallback(
    (outcome: Outcome) => {
      // States
      const isSelectedOutcome =
        market.id === selectedMarketId && outcome.id === selectedOutcomeId;
      const isWinningOutcome =
        isMarketResolved && resolvedOutcomeId === outcome.id;

      // Prices
      const lastWeekPrices = outcome.priceCharts.find(
        priceChart => priceChart.timeframe === '7d'
      );
      const lastWeekPricesChartSeries = fromPriceChartToLineChartSeries(
        lastWeekPrices?.prices || []
      );
      const isPriceUp =
        !lastWeekPrices?.changePercent || lastWeekPrices?.changePercent > 0;

      return {
        id: outcome.id,
        title: outcome.title,
        state: {
          isDefault: !isMarketResolved,
          isSuccess: isWinningOutcome,
          isDanger: !isWinningOutcome,
          isActive: isSelectedOutcome
        },
        price: {
          isPriceUp,
          value: outcome.price.toFixed(3),
          lastWeekPricesChartSeries
        },
        result: {
          isResolved: isMarketResolved,
          state: {
            isWon: isWinningOutcome && !isMarketVoided,
            isLoss: !isWinningOutcome && !isMarketVoided,
            isVoided: isMarketVoided
          }
        }
      };
    },
    [
      isMarketResolved,
      isMarketVoided,
      market.id,
      resolvedOutcomeId,
      selectedMarketId,
      selectedOutcomeId
    ]
  );

  const outcomesObjects = useMemo(() => {
    return outcomes.map(outcome => buildOutcomeObject(outcome));
  }, [buildOutcomeObject, outcomes]);

  return (
    <ul className="pm-c-market-outcomes">
      {outcomesObjects.map(outcome => (
        <li key={outcome.id}>
          <MarketOutcome market={market} outcome={outcome} />
        </li>
      ))}
    </ul>
  );
}

export default MarketOutcomes;
