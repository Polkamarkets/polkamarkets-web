import 'react-datepicker/dist/react-datepicker.css';
import { DateTimePickerProps, DateTimePicker } from '@material-ui/pickers';
import { useField, useFormikContext } from 'formik';
import styled from 'styled-components';
import { ThemeProps, isThemeDark, useTheme } from 'ui';

import InputErrorMessage from './InputErrorMessage';

type StyledDateTimePickerProps = { theme: ThemeProps; $hasError: boolean };

const StyledDateTimePicker = styled(DateTimePicker)<StyledDateTimePickerProps>`
  .MuiOutlinedInput-root {
    outline: none;
    background-color: ${props =>
      isThemeDark(props.theme.device.mode)
        ? 'rgba(35, 42, 54, 0.3)'
        : 'rgba(227, 231, 240, 0.3)'};
    transition: 0.2s border-color ease-out;

    &:hover {
      fieldset {
        border: 1.5px solid;
        border-color: ${props => {
          if (props.$hasError) return '#e12d39';
          if (isThemeDark(props.theme.device.mode)) return '#252c3b';
          return '#e0e2e7';
        }};
      }
    }

    fieldset {
      border: 1.5px solid;
      border-color: ${props => {
        if (props.$hasError) return '#e12d39';
        if (isThemeDark(props.theme.device.mode)) return '#252c3b';
        return '#e0e2e7';
      }};
    }

    &.Mui-focused {
      background-color: ${props => {
        if (props.$hasError)
          return isThemeDark(props.theme.device.mode)
            ? 'rgba(35, 42, 54, 0.3)'
            : 'rgba(227, 231, 240, 0.3)';
        return isThemeDark(props.theme.device.mode) ? '#232a36' : '#dde1e8';
      }}

      transition: 0.2s border-color ease-out;

      fieldset {
        outline: none;
        border: 1.5px solid;
        border-color: ${props => (props.$hasError ? '#e12d39' : '#7069fa')};
      }
    }

    &.Mui-selected {
      outline: none;
      border: none;
    }

    &.Mui-disabled {
      background-color: ${props =>
        isThemeDark(props.theme.device.mode) ? '#292d32' : '#eff1f4'};

      fieldset {
        border: 1.5px solid transparent;
      }
    }
  }

  .MuiOutlinedInput-input {
    padding: var(--size-16);

    font-family: Inter, sans-serif;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;

    color: ${props =>
      isThemeDark(props.theme.device.mode) ? '#f9fafb' : '#171b23'};

    &:hover,
    &:focus {
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
  const theme = useTheme();
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const hasError = meta.touched && meta.error;

  function handleChange(date) {
    if (!meta.touched) {
      setFieldTouched(name, true);
    }

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
