import { useCallback } from 'react';

import isUndefined from 'lodash/isUndefined';
import { changeTradeType } from 'redux/ducks/trade';

import { useAppDispatch, useAppSelector } from 'hooks';

import ButtonGroup from '../ButtonGroup';
import styles from './Trade.module.scss';

const TRADE_TYPE_FALLBACK = 'buy';

function TradeTypeSelector() {
  const dispatch = useAppDispatch();
  const type = useAppSelector(state => state.trade.type);

  const handleChangeTradeType = useCallback(
    (tradeType: string) => {
      if (!isUndefined(tradeType)) {
        dispatch(changeTradeType(tradeType));
      }
    },
    [dispatch]
  );

  return (
    <ButtonGroup
      fullwidth
      defaultActiveId={type || TRADE_TYPE_FALLBACK}
      buttons={[
        { id: 'buy', name: 'Strengthen', color: 'default' },
        { id: 'sell', name: 'Sell', color: 'default' }
      ]}
      className={{
        group: styles.typeSelector,
        button: styles.typeSelectorButton
      }}
      onChange={tradeType => handleChangeTradeType(tradeType)}
    />
  );
}

export default TradeTypeSelector;
