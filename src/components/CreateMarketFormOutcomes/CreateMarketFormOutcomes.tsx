import { useCallback, Fragment, useMemo } from 'react';
import uuid from 'react-uuid';

import cn from 'classnames';
import { useFormikContext, getIn } from 'formik';
import { almost, roundNumber } from 'helpers/math';
import sum from 'lodash/sum';

import {
  CreateMarketFormData,
  Outcome
} from 'components/CreateMarketForm/CreateMarketForm.type';

import { Button } from '../Button';
import Icon from '../Icon';
import {
  ImageUploadInput,
  InputErrorMessage,
  OutcomeInput,
  ProbabilityInput
} from '../Input';
import CreateMarketFormOutcomesClasses from './CreateMarketFormOutcomes.module.scss';

function CreateMarketFormOutcomes() {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<CreateMarketFormData>();

  const outcomes = getIn(values, 'outcomes') as Outcome[];

  const updateOutcomes = useCallback(
    (newOutcomes: any) => {
      setFieldTouched('outcomes', true);
      setFieldValue('outcomes', newOutcomes);
    },
    [setFieldTouched, setFieldValue]
  );

  const validProbabilities = useMemo(() => {
    const probabilities = outcomes.map(outcome => outcome.probability);
    const sumOfProbabilities = sum(probabilities);
    return almost(sumOfProbabilities, 100, 0.1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcomes]);

  const imagesRequired = useMemo(() => {
    const hasImage = outcomes.some(
      outcome => outcome.image && outcome.image.hash
    );

    if (!hasImage) {
      return false;
    }

    return !outcomes.every(outcome => outcome.image && outcome.image.hash);
  }, [outcomes]);

  const handleAddOutcome = () => {
    const probability = roundNumber(100 / (outcomes.length + 1), 2);

    outcomes.forEach((_outcome, outcomeIndex) => {
      outcomes[outcomeIndex].probability = probability;
    });

    const newOutcomes = [
      ...outcomes,
      {
        id: uuid(),
        image: {
          file: undefined,
          hash: '',
          isUploaded: false
        },
        name: '',
        probability
      }
    ];
    updateOutcomes(newOutcomes);
  };

  const handleRemoveOutcome = useCallback(
    (outcomeId: string) => {
      const outcome = outcomes.find(o => o.id === outcomeId);
      if (!outcome) return;
      const index = outcomes.indexOf(outcome);

      outcomes.splice(index, 1);

      const probability = roundNumber(100 / outcomes.length, 2);

      outcomes.forEach((_outcome, outcomeIndex) => {
        outcomes[outcomeIndex].probability = probability;
      });

      const newOutcomes = [...outcomes];

      updateOutcomes(newOutcomes);
    },
    [outcomes, updateOutcomes]
  );

  const hasMoreThanTwoOutcomes = outcomes.length > 2;

  return (
    <div className={CreateMarketFormOutcomesClasses.root}>
      <div>
        <div className={cn(CreateMarketFormOutcomesClasses.outcomes)}>
          <span
            className={cn(
              'pm-c-input__label--default',
              CreateMarketFormOutcomesClasses.headerOutcomes
            )}
          >
            Outcome
          </span>
          <span
            className={cn(
              'pm-c-input__label--default',
              CreateMarketFormOutcomesClasses.headerProbability
            )}
          >
            Probability
          </span>

          {outcomes.map((outcome, index) => {
            const field = `outcomes.${index}`;
            const image = outcome.image?.hash
              ? `https://polkamarkets.infura-ipfs.io/ipfs/${outcome.image.hash}`
              : undefined;
            return (
              <Fragment key={outcome.id}>
                <ImageUploadInput
                  key={`${outcome.id}[image]`}
                  as="icon"
                  name={`${field}.image`}
                  notUploadedActionLabel="Upload Image"
                  uploadedActionLabel="Re-Upload"
                  value={image}
                />
                <OutcomeInput
                  key={`${outcome.id}[name]`}
                  index={index}
                  name={`${field}.name`}
                  placeholder="Outcome"
                />
                <ProbabilityInput
                  key={`${outcome.id}[probability]`}
                  name={`${field}.probability`}
                />
                <Button
                  key={`${outcome.id}[action]`}
                  variant="subtle"
                  color="default"
                  size="normal"
                  className={CreateMarketFormOutcomesClasses.remove}
                  onClick={() => handleRemoveOutcome(outcome.id)}
                  disabled={!hasMoreThanTwoOutcomes}
                >
                  <Icon name="Minus" size="md" />
                </Button>
              </Fragment>
            );
          })}
        </div>
        <div className={CreateMarketFormOutcomesClasses.error}>
          {imagesRequired ? (
            <InputErrorMessage message="All outcomes must have an image" />
          ) : null}
          {!validProbabilities ? (
            <InputErrorMessage message="Sum of probabilities must be 100%" />
          ) : null}
        </div>

        <Button
          fullwidth
          variant="subtle"
          color="primary"
          size="normal"
          onClick={handleAddOutcome}
        >
          Add more
        </Button>
      </div>
    </div>
  );
}

export default CreateMarketFormOutcomes;
