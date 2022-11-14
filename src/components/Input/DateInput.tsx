/* eslint-disable no-nested-ternary */
import 'react-datepicker/dist/react-datepicker.css';
import { DateTimePickerProps, DateTimePicker } from '@material-ui/pickers';
import { useField, useFormikContext } from 'formik';
import styled from 'styled-components';

import { useTheme } from 'hooks';

import InputErrorMessage from './InputErrorMessage';

const StyledDateTimePicker = styled(DateTimePicker)<{ $hasError: boolean }>`
  .MuiOutlinedInput-input {
    padding: 1.2rem;

    font-family: 'Gilroy', sans-serif;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.014rem;

    color: ${props => (props.theme === 'dark' ? '#f9fafb' : '#171b23')};
    border: 0.1rem solid transparent;

    &:hover,
    &:focus {
      border: 0.1rem solid transparent;
    }
  }

  .MuiOutlinedInput-root {
    outline: none;
    border: 0.1rem solid
      ${props =>
        props.$hasError
          ? '#e12d39'
          : props.theme === 'dark'
          ? '#252c3b'
          : '#e0e2e7'};
    transition: 0.2s border ease-out;

    &:hover {
      outline: none;
      border: 0.1rem solid
        ${props =>
          props.$hasError
            ? '#e12d39'
            : props.theme === 'dark'
            ? '#637084'
            : '#c2cad6'};
    }

    &.Mui-focused fieldset {
      outline: none;
      border: none;
    }

    &.Mui-selected {
      outline: none;
      border: none;
    }
  }
`;

interface DateInputProps
  extends Omit<DateTimePickerProps, 'value' | 'onChange'> {
  label?: string;
  name: string;
  description?: string;
}

function DateInput({ label, name, description, ...props }: DateInputProps) {
  const { theme } = useTheme();
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const hasError = meta.touched && meta.error;

  function handleChange(date) {
    setFieldValue(name, new Date(date));
  }

  return (
    <div className="pm-c-date-input__group">
      {!!label && (
        <label
          htmlFor={name}
          className={`pm-c-date-input__label--${
            hasError ? 'error' : 'default'
          }`}
        >
          {label}
        </label>
      )}
      <StyledDateTimePicker
        theme={theme}
        $hasError={!!hasError}
        inputVariant="outlined"
        disablePast
        error={false}
        helperText={null}
        ampm
        format="DD/MM/YYYY, hh:mm a"
        emptyLabel="DD/MM/YYYY, --:-- --"
        value={field.value}
        onChange={date => handleChange(date)}
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

export default DateInput;
