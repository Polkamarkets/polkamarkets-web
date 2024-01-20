import useAppSelector from 'hooks/useAppSelector';

type Outcomes = Record<number, Record<'shares' | 'price', number>>;

const defaultPredictedOutcome = '';

export default function usePredictedOutcome(marketId: string) {
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const market = portfolio[marketId];

  if (!market) return defaultPredictedOutcome;

  return Object.entries(market.outcomes as Outcomes).reduce(
    (acc, [id, { shares }]) => (shares > 1e-5 ? id : acc),
    defaultPredictedOutcome
  );
}
