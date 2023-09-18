import { useCallback, useState, Fragment, useMemo, useEffect } from 'react';
import uuid from 'react-uuid';

import cn from 'classnames';
import { useFormikContext, getIn } from 'formik';
import { almost, roundNumber } from 'helpers/math';
import sum from 'lodash/sum';

import { usePrevious } from 'hooks';

import { Button } from '../Button';
import ButtonGroup from '../ButtonGroup';
import Icon from '../Icon';
import {
  ImageUploadInput,
  InputErrorMessage,
  OutcomeInput,
  ProbabilityInput
} from '../Input';
import CreateMarketFormOutcomesClasses from './CreateMarketFormOutcomes.module.scss';
import { ProbabilityDistribution } from './CreateMarketFormOutcomes.type';

function CreateMarketFormOutcomes() {
  const [probabilityDistribution, setProbabilityDistribution] =
    useState<ProbabilityDistribution>('uniform');

  const { values, setFieldValue, setFieldTouched } = useFormikContext();

  const answerType = getIn(values, 'answerType');
  const { current: previousAnswerType } = usePrevious(answerType);

  const outcomes = getIn(values, 'outcomes');

  useEffect(() => {
    setFieldTouched('outcomes', true);
  }, [setFieldTouched]);

  const updateOutcomes = useCallback(
    (newOutcomes: any) => {
      setFieldTouched('outcomes', true);
      setFieldValue('outcomes', newOutcomes);
    },
    [setFieldTouched, setFieldValue]
  );

  useEffect(() => {
    if (answerType === 'binary' && previousAnswerType === 'multiple') {
      setProbabilityDistribution('uniform');
      updateOutcomes([
        {
          id: uuid(),
          image: {
            file: undefined,
            hash: '',
            isUploaded: false
          },
          name: 'Yes',
          probability: 50
        },
        {
          id: uuid(),
          image: {
            file: undefined,
            hash: '',
            isUploaded: false
          },
          name: 'No',
          probability: 50
        }
      ]);
    }
  }, [answerType, previousAnswerType, updateOutcomes]);

  const validProbabilities = useMemo(() => {
    const probabilities = outcomes.map(outcome => outcome.probability);
    const sumOfProbabilities = sum(probabilities);
    return almost(sumOfProbabilities, 100, 0.1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcomes, probabilityDistribution]);

  const imagesRequired = useMemo(() => {
    const hasImage = outcomes.some(
      outcome => outcome.image && outcome.image.hash
    );

    if (!hasImage) {
      return false;
    }

    return !outcomes.every(outcome => outcome.image && outcome.image.hash);
  }, [outcomes]);

  const toggleProbabilityDistribution = useCallback(() => {
    if (probabilityDistribution === 'uniform') {
      setProbabilityDistribution('manual');
    } else {
      setProbabilityDistribution('uniform');

      const probability = roundNumber(100 / outcomes.length, 2);

      outcomes.forEach((_outcome, outcomeIndex) => {
        outcomes[outcomeIndex].probability = probability;
      });

      const newOutcomes = [...outcomes];

      updateOutcomes(newOutcomes);
    }
  }, [outcomes, probabilityDistribution, updateOutcomes]);

  const handleAddOutcome = useCallback(() => {
    if (probabilityDistribution === 'manual') {
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
          probability: 0.1
        }
      ];
      updateOutcomes(newOutcomes);
    } else {
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
    }
  }, [outcomes, probabilityDistribution, updateOutcomes]);

  const handleRemoveOutcome = useCallback(
    (outcomeId: number) => {
      const index = outcomes.indexOf(
        outcomes.find(outcome => outcome.id === outcomeId)
      );

      outcomes.splice(index, 1);

      if (probabilityDistribution === 'uniform') {
        const probability = roundNumber(100 / outcomes.length, 2);

        outcomes.forEach((_outcome, outcomeIndex) => {
          outcomes[outcomeIndex].probability = probability;
        });
      }

      const newOutcomes = [...outcomes];

      updateOutcomes(newOutcomes);
    },
    [outcomes, probabilityDistribution, updateOutcomes]
  );

  const hasMoreThanTwoOutcomes = outcomes.length > 2;

  return (
    <div className={CreateMarketFormOutcomesClasses.root}>
      <div className="pm-c-input__group">
        <span className="pm-c-input__label--default">Answer type</span>
        <ButtonGroup
          className={{
            group: CreateMarketFormOutcomesClasses.answerTypeSelector,
            button: CreateMarketFormOutcomesClasses.answerTypeSelectorButton
          }}
          defaultActiveId={answerType}
          buttons={[
            { id: 'binary', name: 'Yes / No', color: 'primary' },
            { id: 'multiple', name: 'Multi Choice', color: 'primary' }
          ]}
          onChange={type => setFieldValue('answerType', type)}
        />
      </div>
      <div>
        <div className={CreateMarketFormOutcomesClasses.header}>
          <span className="pm-c-input__label--default">Outcome</span>
          <span className="pm-c-input__label--default">Probability</span>
          <button
            type="button"
            className={cn(
              CreateMarketFormOutcomesClasses.action,
              CreateMarketFormOutcomesClasses.distribuitionTypeSelector,
              'caption',
              'semibold'
            )}
            onClick={toggleProbabilityDistribution}
          >
            {probabilityDistribution === 'uniform'
              ? 'Set manually'
              : 'Set uniformly'}
          </button>
        </div>
        <div
          className={cn(CreateMarketFormOutcomesClasses.outcomes, {
            [CreateMarketFormOutcomesClasses.outcomesWithImages]: true
          })}
        >
          {outcomes.map((outcome, index) => {
            const field = `outcomes.${index}`;

            return (
              <Fragment key={outcome.id}>
                <ImageUploadInput
                  key={`${outcome.id}[image]`}
                  as="icon"
                  name={`${field}.image`}
                  notUploadedActionLabel="Upload Image"
                  uploadedActionLabel="Re-Upload"
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
        {answerType === 'multiple' ? (
          <Button
            fullwidth
            variant="subtle"
            color="primary"
            size="normal"
            onClick={handleAddOutcome}
          >
            <Icon name="Plus" size="md" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default CreateMarketFormOutcomes;
