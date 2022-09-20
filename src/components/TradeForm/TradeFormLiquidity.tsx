import { reset } from 'redux/ducks/liquidity';
import { openLiquidityForm } from 'redux/ducks/ui';

import { useAppDispatch, useAppSelector } from 'hooks';

import { Button } from '../Button';

function TradeFormLiquidity() {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const marketId = useAppSelector(state => state.market.market.id);

  function handleAddLiquidity() {
    dispatch(reset());
    dispatch(openLiquidityForm());
  }

  const hasLiquidity = portfolio[marketId]?.liquidity?.shares > 0;

  return (
    <div className="pm-c-trade-form-liquidity">
      <Button variant="subtle" size="xs" fullwidth onClick={handleAddLiquidity}>
        {hasLiquidity ? 'Add/Remove Liquidity' : 'Add Liquidity'}
      </Button>
    </div>
  );
}

TradeFormLiquidity.displayName = 'TradeFormLiquidity';

export default TradeFormLiquidity;
