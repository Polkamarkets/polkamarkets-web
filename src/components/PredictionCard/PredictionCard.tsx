import { Link } from 'react-router-dom';

import { Market as MarketInterface } from 'models/market';
import { clearMarket } from 'redux/ducks/market';
import {
  changeChartsVisibility,
  changePredictionsVisibility
} from 'redux/ducks/trade';
import { openTradeForm } from 'redux/ducks/ui';

import { useAppDispatch } from 'hooks';
import useCurrency from 'hooks/useCurrency';

import Market from '../Market';

type PredictionCardProps = {
  market: MarketInterface;
};

function PredictionCard({ market }: PredictionCardProps) {
  const dispatch = useAppDispatch();
  const { ticker } = useCurrency();

  const { slug } = market;

  function handleNavigation() {
    dispatch(clearMarket());
    dispatch(openTradeForm());
    dispatch(changeChartsVisibility(false));
    dispatch(changePredictionsVisibility(true));
  }

  return (
    <div className="prediction-card">
      <div className="prediction-card__body">
        <Link to={`/markets/${slug}`} onClick={handleNavigation}>
          <Market market={market} />
        </Link>
        <Market.Outcomes market={market} />
      </div>
      <div className="prediction-card__footer">
        <Market.Footer market={market} ticker={ticker} />
      </div>
    </div>
  );
}

PredictionCard.displayName = 'PredictionCard';

export default PredictionCard;
