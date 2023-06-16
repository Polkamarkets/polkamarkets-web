import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { features } from 'config';
import { Formik, Form } from 'formik';
import { fetchAditionalData, login } from 'redux/ducks/polkamarkets';
import * as marketService from 'services/Polkamarkets/market';
import { Token } from 'types/token';

import {
  useNetwork,
  useAppSelector,
  usePolkamarketsService,
  useAppDispatch
} from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Button } from '../Button';
import CreateMarketFormDetails from '../CreateMarketFormDetails';
import CreateMarketFormFund from '../CreateMarketFormFund';
import CreateMarketFormOutcomes from '../CreateMarketFormOutcomes';
import FormikPersist from '../FormikPersist';
import Steps from '../Steps';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';
import type { CreateMarketFormData } from './CreateMarketForm.type';
import { initialValues, validationSchema } from './CreateMarketForm.util';

function CreateMarketForm() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const { network, networkConfig } = useNetwork();
  const { show, close } = useToastNotification();
  const { createMarketToken } = useAppSelector(state => state.polkamarkets);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  const handleFormRef = useCallback(
    (hasError: boolean) => (node: HTMLFormElement | null) =>
      hasError && node?.scrollIntoView(),
    []
  );

  function resetLocalStorage() {
    localStorage.removeItem('createMarketValues');
    localStorage.removeItem('createMarketTouched');
    localStorage.removeItem('createMarketCurrentStep');
  }

  async function updateWallet() {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }

  async function handleFormSubmit(values: CreateMarketFormData) {
    const closingDate = new Date(values.closingDate).getTime() / 1000; // TODO: move to dayjs
    let wrapped = false;
    let token = '';

    // fetching token address
    if (createMarketToken && (createMarketToken as Token).addresses) {
      token = (createMarketToken as Token).addresses[network.key];
    } else {
      wrapped = true;
    }

    const outcomes = values.outcomes.map(outcome => outcome.name);
    const odds = values.outcomes.map(outcome => outcome.probability);

    // data format: "category;subcategory;resolutionSource"
    const data = `${values.category};${values.subcategory};${
      features.regular.enabled ? values.resolutionSource : ''
    }`;

    const response = await polkamarketsService.createMarket(
      values.question,
      values.description,
      values.image.hash,
      closingDate,
      outcomes,
      data,
      values.liquidity,
      odds,
      values.fee,
      token,
      wrapped,
      values.treasuryFee
    );

    show('createMarket');

    const { marketId } = response.events.MarketCreated.returnValues;

    try {
      const res = await marketService.createMarket(
        marketId,
        networkConfig.NETWORK_ID
      );

      await updateWallet();
      resetLocalStorage();
      history.push(`/markets/${res.data.slug}`);
    } catch (err) {
      history.push('/');
    }
  }

  const currentValidationSchema = validationSchema[currentStep];

  return (
    <>
      <ToastNotification id="createMarket" duration={10000}>
        <Toast
          variant="success"
          title="Success"
          description="Market successfuly created!"
        >
          <Toast.Actions>
            <Button
              size="sm"
              variant="subtle"
              onClick={() => close('createMarket')}
            >
              Dismiss
            </Button>
          </Toast.Actions>
        </Toast>
      </ToastNotification>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await handleFormSubmit(values);
          actions.setSubmitting(false);
        }}
        validationSchema={currentValidationSchema}
      >
        {values => (
          <Form
            ref={handleFormRef(values.isSubmitting && !values.isValid)}
            className="pm-c-create-market-form"
          >
            <FormikPersist
              currentStep={currentStep}
              onChangeCurrentStep={handleStepChange}
            />
            <Steps
              current={currentStep}
              currentStepFields={Object.keys(currentValidationSchema.fields)}
              steps={[
                {
                  id: 'details',
                  title: 'Market Details',
                  component: <CreateMarketFormDetails />
                },
                {
                  id: 'outcomes',
                  title: 'Choose Outcomes',
                  component: <CreateMarketFormOutcomes />
                },
                {
                  id: 'fund',
                  title: 'Funding Information',
                  component: <CreateMarketFormFund />
                }
              ]}
              onChange={handleStepChange}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateMarketForm;
