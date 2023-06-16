import cn from 'classnames';
import { useFormikContext } from 'formik';
import type { Token } from 'types/token';

import { Button, ButtonLoading } from 'components/Button';

import { useAppSelector, useNetwork } from 'hooks';

import ApproveToken from '../ApproveToken';
import StepsClasses from './Steps.module.scss';
import type { Step } from './Steps.type';

type StepsProps = {
  current: number;
  currentStepFields: string[];
  steps: Step[];
  onChange: (step: number) => void;
};

function Steps({ current, currentStepFields, steps, onChange }: StepsProps) {
  const { isValid, touched, isSubmitting } = useFormikContext();
  const { network } = useNetwork();

  const createMarketToken = useAppSelector(
    state => state.polkamarkets.createMarketToken
  );

  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

  let address = '';

  const token = createMarketToken || network.currency;

  if (createMarketToken && (createMarketToken as Token).addresses) {
    address = (createMarketToken as Token).addresses[network.key];
  }

  const isCurrentStepValid =
    currentStepFields.every(field => touched[field]) && isValid;

  return (
    <div className={StepsClasses.root}>
      <div className={StepsClasses.steps}>
        {steps.map((step, index) => {
          const inProgress = index === current;
          const finished = index < current;
          const waiting = index > current;

          return (
            <div
              key={step.id}
              className={cn({
                [StepsClasses.stepInProgress]: inProgress,
                [StepsClasses.stepFinished]: finished,
                [StepsClasses.stepWaiting]: waiting
              })}
            >
              <span
                className={cn({
                  [StepsClasses.stepInProgressTitle]: inProgress,
                  [StepsClasses.stepFinishedTitle]: finished,
                  [StepsClasses.stepWaitingTitle]: waiting
                })}
              >{`${index + 1}. ${step.title}`}</span>
            </div>
          );
        })}
      </div>
      <div className={StepsClasses.currentStep}>
        {steps[current] ? steps[current].component : null}
      </div>
      <div className={StepsClasses.footer}>
        <p className={StepsClasses.footerHelperText}>
          * This information is mandatory
        </p>
        <div className={StepsClasses.controls}>
          {current > 0 ? (
            <Button
              variant="ghost"
              color="default"
              onClick={() => onChange(current - 1)}
              disabled={isSubmitting}
            >
              Previous Step
            </Button>
          ) : null}
          {current === steps.length - 1 ? (
            <ApproveToken address={address} ticker={token.ticker}>
              <ButtonLoading
                type="submit"
                variant="normal"
                color="success"
                loading={isSubmitting}
                disabled={
                  !walletConnected || !isCurrentStepValid || isSubmitting
                }
              >
                Create Market
              </ButtonLoading>
            </ApproveToken>
          ) : (
            <Button
              variant="subtle"
              color="default"
              onClick={() => onChange(current + 1)}
              disabled={current === steps.length - 1 || !isCurrentStepValid}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Steps;
