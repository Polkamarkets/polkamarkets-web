import { useEffect } from 'react';

import classNames from 'classnames';
import { Market } from 'models/market';
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

import { useAppDispatch } from 'hooks';

import Text from '../Text';

const outcomeStates = {
  success: { icon: <CheckIcon /> },
  warning: { icon: <WarningIcon /> },
  danger: { icon: <RemoveIcon /> },
  voided: { icon: <RepeatCycleIcon /> }
};

type MarketOutcomeProps = {
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

function MarketOutcome({ market, outcome }: MarketOutcomeProps) {
  const dispatch = useAppDispatch();
  const { id: marketId, networkId } = market;
  const { id, title, state, price, result } = outcome;
  const { isPriceUp, lastWeekPricesChartSeries } = price;

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
          <Area
            id={`${networkId}-${marketId}-${id}`}
            data={lastWeekPricesChartSeries}
            color={isPriceUp ? 'green' : 'red'}
            width={48}
            height={30}
          />
        </div>
      )}
    </button>
  );
}

export default MarketOutcome;
