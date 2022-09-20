import { useCallback, useMemo } from 'react';

import { fromPriceChartToLineChartSeries } from 'helpers/chart';
import { Market, Outcome } from 'models/market';

import { useAppSelector } from 'hooks';

import MarketOutcome from './MarketOutcome';
import MarketOutcomeMultiple from './MarketOutcomeMultiple';

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

  const buildOutcomeMultipleObject = useCallback(
    (outcomesSlice: Outcome[]) => {
      const ids = outcomesSlice.map(outcome => outcome.id);
      const titles = outcomesSlice.map(outcome => outcome.title);

      const title = `${titles.length}+ ${'Outcome'}${
        titles.length !== 1 ? 's' : ''
      }`;

      const subtitle = titles.join(', ');

      // States
      const isSelectedOutcome =
        market.id === selectedMarketId && ids.includes(selectedOutcomeId);
      const isWinningOutcome =
        isMarketResolved && ids.includes(resolvedOutcomeId);

      return {
        ids,
        title,
        subtitle,
        state: {
          isDefault: !isMarketResolved,
          isSuccess: isWinningOutcome,
          isDanger: !isWinningOutcome,
          isActive: isSelectedOutcome
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

  const hasMultipleOutcomes = outcomes.length > 3;

  const outcomesObjects = useMemo(() => {
    if (hasMultipleOutcomes) {
      return outcomes.slice(0, 2).map(outcome => buildOutcomeObject(outcome));
    }

    return outcomes.slice(0, 2).map(outcome => buildOutcomeObject(outcome));
  }, [buildOutcomeObject, hasMultipleOutcomes, outcomes]);

  const multipleOutcomesObject = useMemo(() => {
    if (!hasMultipleOutcomes) return undefined;
    return buildOutcomeMultipleObject(outcomes.slice(2));
  }, [buildOutcomeMultipleObject, hasMultipleOutcomes, outcomes]);

  return (
    <ul className="pm-c-market-outcomes">
      {outcomesObjects.map(outcome => (
        <li key={outcome.id}>
          <MarketOutcome market={market} outcome={outcome} />
        </li>
      ))}
      {multipleOutcomesObject ? (
        <li>
          <MarketOutcomeMultiple
            market={market}
            outcome={multipleOutcomesObject}
          />
        </li>
      ) : null}
    </ul>
  );
}

export default MarketOutcomes;
