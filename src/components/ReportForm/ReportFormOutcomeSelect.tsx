import { useField } from 'formik';
import { Outcome as MarketOutcome } from 'models/market';
import { selectOutcome } from 'redux/ducks/trade';
import { PolkamarketsService } from 'services';

import { useAppSelector } from 'hooks';

import { BadgeColor } from '../Badge';
import Outcome from '../Outcome';

function ReportFormOutcomeSelect() {
  // Selectors
  const { outcomes, questionId } = useAppSelector(state => state.market.market);
  const marketId = useAppSelector(state => state.market.market.id);
  const isMarketQuestionFinalized = useAppSelector(
    state => state.market.market.question.isFinalized
  );
  const { bestAnswer, bond } = useAppSelector(
    state => state.market.market.question
  );
  const { bonds, portfolio } = useAppSelector(state => state.polkamarkets);

  // Form state
  const [field, _meta, helpers] = useField('outcome');

  // converting bytes32 to int
  const resolvedOutcomeId = PolkamarketsService.bytes32ToInt(bestAnswer);
  const isStarted = bond > 0;

  const getOutcomeColor = (outcome: MarketOutcome): BadgeColor =>
    outcomes.indexOf(outcome) === 0 ? 'blue' : 'pink';

  function handleOutcomeSelect(id: string) {
    selectOutcome(marketId, id);
    helpers.setValue(id);
  }

  const isSelected = outcome =>
    field.value && `${field.value}` === `${outcome.id}`;

  const isWinningOutcome = outcome =>
    `${resolvedOutcomeId}` === `${outcome.id}`;

  const isWon = outcome =>
    isMarketQuestionFinalized && isWinningOutcome(outcome);

  const checkOutcomeState = outcome => {
    if (isWon(outcome)) return 'won';
    if (isMarketQuestionFinalized) return 'default';
    if (isSelected(outcome)) return 'selected';
    return 'default';
  };

  const getOutcomeBond = outcomeId => {
    const answerId = PolkamarketsService.intToBytes32(outcomeId);

    if (!bonds[questionId]) return 0;

    return bonds[questionId].answers[answerId] || 0;
  };

  return (
    <div className="pm-c-report-form-outcome-select">
      {outcomes.map(outcome => (
        <Outcome
          key={outcome.id}
          id={`${outcome.id}`}
          title={outcome.title}
          shares={portfolio[marketId]?.outcomes[outcome.id]?.shares || 0}
          bond={getOutcomeBond(outcome.id)}
          color={getOutcomeColor(outcome)}
          state={checkOutcomeState(outcome)}
          resolvedOutcomeId={resolvedOutcomeId}
          marketQuestionFinalized={isMarketQuestionFinalized}
          onSelect={handleOutcomeSelect}
          isStarted={isStarted}
        />
      ))}
      <Outcome
        id="-1"
        title="Invalid"
        helpText="A market is invalid when no outcome is correct"
        color="warning"
        state={checkOutcomeState({ id: '-1' })}
        bond={getOutcomeBond(-1)}
        resolvedOutcomeId={resolvedOutcomeId}
        marketQuestionFinalized={isMarketQuestionFinalized}
        onSelect={handleOutcomeSelect}
        isStarted={isStarted}
      />
    </div>
  );
}

export default ReportFormOutcomeSelect;
