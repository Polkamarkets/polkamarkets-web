import React from 'react';

import cn from 'classnames';
import { useField } from 'formik';

import InputErrorMessage from './InputErrorMessage';

type InputProps = {
  label?: string;
  name: string;
  description?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, name, description, className, required = false, ...props },
    ref
  ) => {
    const [field, meta] = useField(name);

    const hasError = meta.touched && meta.error;

    return (
      <div className="pm-c-input__group">
        {!!label && (
          <label
            htmlFor={name}
            className={cn({
              'pm-c-input__label--error': hasError,
              'pm-c-input__label--default': !hasError,
              'pm-c-input__label--required': required
            })}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            {
              'pm-c-input--error': hasError,
              'pm-c-input--default': !hasError
            },
            className
          )}
          id={name}
          {...field}
          {...props}
        />
        {hasError && meta.error ? (
          <InputErrorMessage message={meta.error} />
        ) : null}
        {description && !hasError ? (
          <span className="pm-c-input__description">{description}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
