import useAppSelector from 'hooks/useAppSelector';

type Outcomes = Record<number, Record<'shares' | 'price', number>>;

export default function usePredictedOutcome(marketId: string) {
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);

  let predictedOutcomeId = '';

  if (!portfolio[marketId]) return predictedOutcomeId;

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, { shares }] of Object.entries(
    portfolio[marketId].outcomes as Outcomes
  )) {
    if (shares >= 0.0005) predictedOutcomeId = key;
  }

  return predictedOutcomeId;
}
