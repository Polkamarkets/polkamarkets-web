import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { useAppSelector } from 'hooks';

import ReportFormActions from './ReportFormActions';
import ReportFormDetails from './ReportFormDetails';
import ReportFormInfo from './ReportFormInfo';
import ReportFormInput from './ReportFormInput';
import ReportFormOutcomeSelect from './ReportFormOutcomeSelect';
import { ReportFormOutcomeSelectType } from './ReportFormOutcomeSelect.type';

type ReportFormData = {
  market: string;
  outcome: string;
  bond: number;
};

function ReportForm() {
  // Selectors
  const { isLoading } = useAppSelector(state => state.market);
  const marketId = useAppSelector(state => state.market.market.id);
  const marketBond = useAppSelector(state => state.market.market.question.bond);
  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );
  const { outcomes } = useAppSelector(state => state.market.market);
  const isMarketQuestionFinalized = useAppSelector(
    state => state.market.market.question.isFinalized
  );

  const outcomeSelectType: ReportFormOutcomeSelectType =
    outcomes.length > 2 ? 'multiple' : 'binary';

  // Derivated state
  const minimumBond = marketBond * 2;

  const initialData: ReportFormData = {
    market: marketId,
    outcome:
      `${selectedOutcomeId}` !== `${outcomes[0].id}`
        ? `${selectedOutcomeId}`
        : `${outcomes[0].id}`,
    bond: 0
  };

  const validationSchema = Yup.object().shape({
    market: Yup.string().required('Market is required!'),
    outcome: Yup.string().required('Outcome is required!'),
    bond: Yup.number()
      .min(
        minimumBond,
        `The minimum amount to bound is ${minimumBond.toFixed(2)} POLK`
      )
      .required('Bond is required!')
  });

  async function handleFormSubmit(_values: ReportFormData) {
    // console.log(values);
  }

  if (isLoading) return null;

  return (
    <Formik
      initialValues={initialData}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await handleFormSubmit(values);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >
      <Form className="pm-c-report-form">
        <div className="pm-c-report-form__view">
          <ReportFormInfo />
          <ReportFormOutcomeSelect type={outcomeSelectType} />
        </div>
        <div className="pm-c-report-form__actions">
          {!isMarketQuestionFinalized ? (
            <>
              <ReportFormInput />
              <ReportFormDetails />
            </>
          ) : null}
          <ReportFormActions
            marketQuestionFinalized={isMarketQuestionFinalized}
          />
        </div>
      </Form>
    </Formik>
  );
}

export default ReportForm;
