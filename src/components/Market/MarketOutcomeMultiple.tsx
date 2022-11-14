import { useEffect } from 'react';

import classNames from 'classnames';
import { Market } from 'models/market';
import { marketSelected } from 'redux/ducks/market';
import { selectOutcome } from 'redux/ducks/trade';
import { closeTradeForm, openReportForm, openTradeForm } from 'redux/ducks/ui';

import {
  CheckIcon,
  RemoveIcon,
  RepeatCycleIcon,
  WarningIcon
} from 'assets/icons';

import { useAppDispatch } from 'hooks';

import Text from '../Text';

const outcomeStates = {
  success: { icon: <CheckIcon /> },
  warning: { icon: <WarningIcon /> },
  danger: { icon: <RemoveIcon /> },
  voided: { icon: <RepeatCycleIcon /> }
};

type MarketOutcomeMultipleProps = {
  market: Market;
  outcome: {
    ids: (string | number)[];
    title: string;
    subtitle: string;
    state: {
      isDefault: boolean;
      isSuccess: boolean;
      isDanger: boolean;
      isActive: boolean;
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

function MarketOutcomeMultiple({
  market,
  outcome
}: MarketOutcomeMultipleProps) {
  const dispatch = useAppDispatch();
  const { ids, title, subtitle, state, result } = outcome;

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
      dispatch(selectOutcome(market.id, ids[0]));
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
        multiple: true,
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
            {subtitle}
          </Text>
        </div>
      </div>
      {result.isResolved ? (
        <div className="pm-c-market-outcomes__item-result">
          {result.state.isWon ? outcomeStates.success.icon : null}
          {result.state.isLoss ? outcomeStates.danger.icon : null}
          {result.state.isVoided ? outcomeStates.voided.icon : null}
        </div>
      ) : null}
    </button>
  );
}

export default MarketOutcomeMultiple;
