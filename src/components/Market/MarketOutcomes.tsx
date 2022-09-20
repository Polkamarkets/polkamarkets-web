import { useCallback, useEffect, useMemo } from 'react';

import classNames from 'classnames';
import { fromPriceChartToLineChartSeries } from 'helpers/chart';
import { Market, Outcome } from 'models/market';
import { marketSelected } from 'redux/ducks/market';
import { selectOutcome } from 'redux/ducks/trade';
import { closeTradeForm, openReportForm, openTradeForm } from 'redux/ducks/ui';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  RemoveIcon,
  RepeatCycleIcon,
  WarningIcon
} from 'assets/icons';

import { Area } from 'components/plots';

import { useAppDispatch, useAppSelector } from 'hooks';

import Text from '../Text';
import MarketOutcomeMultiple from './MarketOutcomeMultiple';

const outcomeStates = {
  success: { icon: <CheckIcon /> },
  warning: { icon: <WarningIcon /> },
  danger: { icon: <RemoveIcon /> },
  voided: { icon: <RepeatCycleIcon /> }
};

type MarketOutcomesItemProps = {
  market: Market;
  outcome: Outcome;
};

function MarketOutcomesItem({ market, outcome }: MarketOutcomesItemProps) {
  const dispatch = useAppDispatch();
  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );
  const selectedMarketId = useAppSelector(
    state => state.trade.selectedMarketId
  );

  const { id, marketId, title, price } = outcome;

  const isCurrentSelectedMarket = marketId === selectedMarketId;
  const isCurrentSelectedPrediction =
    marketId === selectedMarketId && id === selectedOutcomeId;

  const isMarketResolved = market.state === 'resolved';
  const isVoided = market.voided;
  const isWinningOutcome = isMarketResolved && market.resolvedOutcomeId === id;

  useEffect(() => {
    if (isCurrentSelectedPrediction) {
      dispatch(openTradeForm());
    }
  }, [dispatch, isCurrentSelectedPrediction]);

  // using 7d timeframe
  const marketPriceChart = outcome.priceCharts?.find(
    priceChart => priceChart.timeframe === '7d'
  );
  const marketPriceUp =
    !marketPriceChart?.changePercent || marketPriceChart?.changePercent > 0;
  const chartData = fromPriceChartToLineChartSeries(
    marketPriceChart?.prices || []
  );

  function handleItemSelection() {
    if (market.state === 'closed') {
      dispatch(openReportForm());
    } else {
      dispatch(openTradeForm());
    }

    if (!isCurrentSelectedMarket) {
      dispatch(marketSelected(market));
    }

    if (!isCurrentSelectedPrediction) {
      dispatch(selectOutcome(market.id, outcome.id));
    } else {
      dispatch(selectOutcome(market.id, ''));
      dispatch(closeTradeForm());
    }
  }

  return (
    <button
      type="button"
      className={classNames({
        'pm-c-market-outcomes__item--default': !isMarketResolved,
        'pm-c-market-outcomes__item--success': isWinningOutcome,
        'pm-c-market-outcomes__item--danger': !isWinningOutcome,
        active: isCurrentSelectedPrediction
      })}
      disabled={isMarketResolved}
      onClick={handleItemSelection}
    >
      <div className="pm-c-market-outcomes__item-group--column">
        <Text
          as="p"
          scale="caption"
          fontWeight="semibold"
          className="pm-c-market-outcomes__item-title"
        >
          {title}
        </Text>
        <div className="pm-c-market-outcomes__item-group--row">
          <Text
            as="p"
            scale="tiny-uppercase"
            fontWeight="medium"
            className="pm-c-market-outcomes__item-odd"
          >
            PRICE
          </Text>
          <Text
            as="span"
            scale="tiny"
            fontWeight="medium"
            className="pm-c-market-outcomes__item-value"
          >
            {price.toFixed(3)}
          </Text>
          {!isMarketResolved ? (
            <>{marketPriceUp ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
          ) : null}
        </div>
      </div>
      {isMarketResolved ? (
        <div className="pm-c-market-outcomes__item-result">
          {isWinningOutcome && !isVoided ? outcomeStates.success.icon : null}
          {!isWinningOutcome && !isVoided ? outcomeStates.danger.icon : null}
          {isVoided ? outcomeStates.voided.icon : null}
        </div>
      ) : (
        <div className="pm-c-market-outcomes__item-chart">
          <Area
            id={`${marketId}-${id}-${title}`}
            data={chartData}
            color={marketPriceUp ? 'green' : 'red'}
            width={48}
            height={30}
          />
        </div>
      )}
    </button>
  );
}

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
      const lastWeekPrices = outcome.priceCharts?.find(
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
      {outcomes.map(outcome => (
        <li key={outcome.id}>
          <MarketOutcomesItem market={market} outcome={outcome} />
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
