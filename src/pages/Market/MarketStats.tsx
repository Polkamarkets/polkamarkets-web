import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';

import { Card, Text } from 'components';

import { useAppSelector } from 'hooks';

type MarketStatsProps = {
  market: Market;
};

function MarketStats({ market }: MarketStatsProps) {
  const currency = useAppSelector(state => state.market.market.currency);
  const { symbol } = currency;
  const outcomeStats = market.outcomes.map(outcome => {
    const chartData = outcome.priceCharts?.find(
      chart => chart.timeframe === '24h'
    );

    const changePercent = chartData?.changePercent ?? 0;
    const changeColor = changePercent >= 0 ? 'success' : 'danger';

    return {
      title: outcome.title,
      price: outcome.price,
      changePercent,
      changeColor
    };
  });

  return (
    <div className="pm-p-market__stats">
      <Card
        className="pm-p-market__stats-item"
        size="lg"
        title={
          <Text
            as="label"
            scale="tiny-uppercase"
            fontWeight="bold"
            color="gray"
          >
            {outcomeStats[0].title}
          </Text>
        }
      >
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          className="pm-p-market__stats-item__price"
        >
          {`${roundNumber(outcomeStats[0].price, 3)} ${symbol}`}
        </Text>
      </Card>
      <Card
        className="pm-p-market__stats-item"
        size="lg"
        title={
          <Text
            as="label"
            scale="tiny-uppercase"
            fontWeight="bold"
            color="gray"
          >
            24H %
          </Text>
        }
      >
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          // eslint-disable-next-line no-undef
          color={outcomeStats[0].changeColor as any}
        >
          {`${roundNumber(
            Math.abs(outcomeStats[0].changePercent || 0) * 100,
            2
          )}%`}
        </Text>
      </Card>
      <Card
        className="pm-p-market__stats-item"
        size="lg"
        title={
          <Text
            as="label"
            scale="tiny-uppercase"
            fontWeight="bold"
            color="gray"
          >
            {outcomeStats[1].title}
          </Text>
        }
      >
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          className="pm-p-market__stats-item__price"
        >
          {`${roundNumber(outcomeStats[1].price, 3)} ${symbol}`}
        </Text>
      </Card>
      <Card
        className="pm-p-market__stats-item"
        size="lg"
        title={
          <Text
            as="label"
            scale="tiny-uppercase"
            fontWeight="bold"
            color="gray"
          >
            24H %
          </Text>
        }
      >
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          color={outcomeStats[1].changeColor as any}
        >
          {`${roundNumber(
            Math.abs(outcomeStats[1].changePercent || 0) * 100,
            2
          )}%`}
        </Text>
      </Card>
    </div>
  );
}

export default MarketStats;
