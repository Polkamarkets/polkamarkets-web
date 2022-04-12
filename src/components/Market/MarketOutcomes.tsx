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

import { useAppDispatch, useAppSelector } from 'hooks';

import MiniAreaChart from '../MiniAreaChart';
import Text from '../Text';

const outcomeStates = {
  success: { icon: <CheckIcon /> },
  warning: { icon: <WarningIcon /> },
  danger: { icon: <RemoveIcon /> },
  voided: { icon: <RepeatCycleIcon /> }
};

type MarketOutcomesItemProps = {
  market: Market;
  outcome: {
    id: string | number;
    title: string;
    state: {
      isDefault: boolean;
      isSuccess: boolean;
      isDanger: boolean;
      isActive: boolean;
    };
    price: {
      isPriceUp: boolean;
      value: string;
      lastWeekPricesChartSeries: any;
    };
    result: {
      isResolved: boolean;
      state: {
        isWon: boolean;
        isLoss: boolean;
        isVoided: boolean;
      };
    };
  };
};

function MarketOutcomesItem({ market, outcome }: MarketOutcomesItemProps) {
  const dispatch = useAppDispatch();
  const { title, state, price, result } = outcome;

  useEffect(() => {
    if (state.isActive) {
      dispatch(openTradeForm());
    }
  }, [dispatch, state.isActive]);

  function handleItemSelection() {
    if (market.state === 'closed') {
      dispatch(openReportForm());
    } else {
      dispatch(openTradeForm());
    }
    dispatch(marketSelected(market));

    if (!state.isActive) {
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
        'pm-c-market-outcomes__item--default': state.isDefault,
        'pm-c-market-outcomes__item--success': state.isSuccess,
        'pm-c-market-outcomes__item--danger': state.isDanger,
        active: state.isActive
      })}
      disabled={result.isResolved}
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
            {price.value}
          </Text>
          {!result.isResolved ? (
            <>{price.isPriceUp ? <ArrowUpIcon /> : <ArrowDownIcon />}</>
          ) : null}
        </div>
      </div>
      {result.isResolved ? (
        <div className="pm-c-market-outcomes__item-result">
          {result.state.isWon ? outcomeStates.success.icon : null}
          {result.state.isLoss ? outcomeStates.danger.icon : null}
          {result.state.isVoided ? outcomeStates.voided.icon : null}
        </div>
      ) : (
        <div className="pm-c-market-outcomes__item-chart">
          <MiniAreaChart
            serie={price.lastWeekPricesChartSeries}
            color={price.isPriceUp ? 'success' : 'danger'}
            width={48}
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
          <MarketOutcomesItem market={market} outcome={outcome} />
        </li>
      ))}
    </ul>
  );
}

export default MarketOutcomes;
