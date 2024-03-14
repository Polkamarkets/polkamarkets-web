/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import cn from 'classnames';
import { useField } from 'formik';

import InputErrorMessage from './InputErrorMessage';

type SelectInputOption = {
  name: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  name: string;
  description?: string;
  options: SelectInputOption[];
  required?: boolean;
};

const SelectInput = React.forwardRef<
  HTMLSelectElement,
  SelectInputProps & React.SelectHTMLAttributes<HTMLSelectElement>
>(
  (
    {
      label,
      name,
      description,
      options,
      placeholder,
      required = false,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [field, meta] = useField(name);

    const hasError = meta.touched && meta.error;

    return (
      <div className="pm-c-select-input__group">
        <label
          htmlFor={name}
          className={cn({
            'pm-c-select-input__label--error': hasError,
            'pm-c-select-input__label--default': !hasError,
            'pm-c-select-input__label--required': required
          })}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={name}
          {...field}
          {...props}
          className={cn({
            'pm-c-input--error': hasError,
            'pm-c-input--default': !hasError,
            'pm-c-select-input--empty': !field.value
          })}
        >
          <option value="" disabled selected={!defaultValue}>
            {placeholder}
          </option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
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

SelectInput.displayName = 'SelectInput';

export default SelectInput;
