import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { useAppSelector } from 'hooks';

import ReportFormActions from './ReportFormActions';
import ReportFormArbitration from './ReportFormArbitration';
import ReportFormDetails from './ReportFormDetails';
import ReportFormInput from './ReportFormInput';
import ReportFormOutcomeSelect from './ReportFormOutcomeSelect';

type ReportFormData = {
  market: string;
  outcome: string;
  bond: number;
};

function ReportForm() {
  // Selectors
  const { isLoading } = useAppSelector(state => state.market);
  const marketId = useAppSelector(state => state.market.market.id);
  const { bond, isPendingArbitration, isPendingArbitrationRequest } =
    useAppSelector(state => state.market.market.question);
  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );
  const { outcomes } = useAppSelector(state => state.market.market);
  const isMarketQuestionFinalized = useAppSelector(
    state => state.market.market.question.isFinalized
  );

  // Derivated state
  const minimumBond = bond * 2;

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
    console.log(_values);
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
      <Form className="pm-c-trade-form">
        <div className="pm-c-trade-form__view">
          <ReportFormOutcomeSelect />
        </div>
        <div className="pm-c-trade-form__actions">
          {!isMarketQuestionFinalized &&
          !isPendingArbitration &&
          !isPendingArbitrationRequest ? (
            <>
              <ReportFormInput />
              <ReportFormDetails />
            </>
          ) : null}
          {!isPendingArbitration && !isPendingArbitrationRequest ? (
            <ReportFormActions
              marketQuestionFinalized={isMarketQuestionFinalized}
            />
          ) : (
            <ReportFormArbitration />
          )}
        </div>
      </Form>
    </Formik>
  );
}

export default ReportForm;
