import { ui } from 'config';
import { fromPriceChartToLineChartSeries } from 'helpers/chart';
import { roundNumber } from 'helpers/math';
import type { Outcome, PriceChart } from 'models/market';

export type SortOutcomes = {
  timeframe: string;
  outcomes: Outcome[];
};

function getPricesDiff(priceChart?: PriceChart) {
  const pricesArr = priceChart?.prices;

  if (!pricesArr || pricesArr.length < 2)
    return {
      value: '0',
      pct: '0%'
    };

  const [initial, ...prices] = pricesArr;
  const diffValue = prices[prices.length - 1].value - initial.value;
  const diffSign = Math.sign(diffValue) < 0 ? '' : '+';

  return {
    value: `${diffSign}${roundNumber(diffValue, 3)}`,
    pct: `${diffSign}${roundNumber(
      Math.abs(priceChart.changePercent || 0) * 100,
      2
    )}%`
  } as const;
}

export default function sortOutcomes(args: SortOutcomes) {
  return [...args.outcomes]
    .sort((compareA, compareB) => {
      if (ui.market.outcomes.sorting.alphabetically.enabled) {
        const exclude = ui.market.outcomes.sorting.alphabetically.exclude || [];

        if (exclude.includes(compareA.title.toLowerCase())) return 1;

        return compareA.title.localeCompare(compareB.title);
      }

      return compareB.price - compareA.price;
    })
    .map(outcome => {
      const priceChart = outcome.priceCharts?.find(
        chart => chart.timeframe === args.timeframe
      );

      return {
        ...outcome,
        price: +outcome.price.toFixed(3) * Math.sign(outcome.price),
        pricesDiff: getPricesDiff(priceChart),
        isPriceUp: outcome.priceChange24h > 0,
        name: outcome.title,
        data: fromPriceChartToLineChartSeries(priceChart?.prices || [])
      };
    });
}

export type SortedOutcomes = ReturnType<typeof sortOutcomes>;
