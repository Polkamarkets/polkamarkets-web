import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useCallback
} from 'react';

import cn from 'classnames';
import { useField, useFormikContext } from 'formik';
import { roundNumber } from 'helpers/math';
import omit from 'lodash/omit';

import Text from '../Text';
import InputErrorMessage from './InputErrorMessage';

type ProbabilityInputProps = {
  name: string;
};

const ProbabilityInput = forwardRef<
  HTMLInputElement,
  ProbabilityInputProps & InputHTMLAttributes<HTMLInputElement>
>(({ name, ...props }, ref) => {
  const { setFieldValue } = useFormikContext();

  const [field, meta] = useField(name);

  const handleChangeProbability = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { value } = event.currentTarget;

      const newProbability = value
        ? roundNumber(parseFloat(value), 2)
        : undefined;

      setFieldValue(name, newProbability);
    },
    [name, setFieldValue]
  );

  const hasError = meta.touched && meta.error;

  return (
    <div className="pm-c-probability-input--default__group">
      <div
        className={cn({
          'pm-c-probability-input--error__wrapper': hasError,
          'pm-c-probability-input--default__wrapper': !hasError
        })}
      >
        <input
          id={name}
          ref={ref}
          type="number"
          min={0}
          max={100}
          step={0.01}
          onWheel={event => event.currentTarget.blur()}
          onChange={event => handleChangeProbability(event)}
          className={cn({
            'pm-c-probability-input--error': hasError,
            'pm-c-probability-input--default': !hasError
          })}
          {...omit(field, ['onChange'])}
          {...props}
        />
        <Text as="span" scale="caption" fontWeight="semibold" color="primary">
          %
        </Text>
      </div>
      {hasError && meta.error ? (
        <InputErrorMessage message={meta.error} />
      ) : null}
    </div>
  );
});

ProbabilityInput.displayName = 'ProbabilityInput';

export default ProbabilityInput;
