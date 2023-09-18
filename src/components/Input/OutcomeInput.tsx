import { forwardRef, InputHTMLAttributes } from 'react';

import cn from 'classnames';
import { useField } from 'formik';
import { colorByOutcomeId } from 'helpers/color';

import Badge from '../Badge';
import InputErrorMessage from './InputErrorMessage';

type OutcomeInputProps = {
  index: number;
  name: string;
};

const OutcomeInput = forwardRef<
  HTMLInputElement,
  OutcomeInputProps & InputHTMLAttributes<HTMLInputElement>
>(({ index, name, ...props }, ref) => {
  const [field, meta] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="pm-c-outcome-input--default__group">
      <div
        className={cn({
          'pm-c-outcome-input--error__wrapper': hasError,
          'pm-c-outcome-input--default__wrapper': !hasError
        })}
      >
        <Badge color={colorByOutcomeId(index)} />
        <input
          id={name}
          ref={ref}
          className={cn({
            'pm-c-outcome-input--error': hasError,
            'pm-c-outcome-input--default': !hasError
          })}
          {...field}
          {...props}
        />
      </div>
      {hasError && meta.error ? (
        <InputErrorMessage message={meta.error} />
      ) : null}
    </div>
  );
});

OutcomeInput.displayName = 'OutcomeInput';

export default OutcomeInput;
