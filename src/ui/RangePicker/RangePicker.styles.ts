import { DatePicker } from '@material-ui/pickers';
import styled from 'styled-components';
import { isThemeDark } from 'ui/';

import { StyledDatePickerProps } from './RangePicker.type';

const StyledDatePicker = styled(DatePicker)<StyledDatePickerProps>`
  .MuiOutlinedInput-input {
    padding: 1.2rem;

    font-family: 'Inter', sans-serif;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.014rem;

    color: ${props =>
      isThemeDark(props.theme.device.mode) ? '#f9fafb' : '#171b23'};
    border: 0.1rem solid transparent;

    &:hover,
    &:focus {
      border: 0.1rem solid transparent;
    }
  }

  .MuiOutlinedInput-root {
    outline: none;
    border: 0.1rem solid
      ${props => {
        if (props.$hasError) return '#e12d39';
        if (isThemeDark(props.theme.device.mode)) return '#252c3b';
        return '#e0e2e7';
      }};
    transition: 0.2s border ease-out;

    &:hover {
      outline: none;
      border: 0.1rem solid
        ${props => {
          if (props.$hasError) return '#e12d39';
          if (isThemeDark(props.theme.device.mode)) return '#637084';
          return '#c2cad6';
        }};
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

export default StyledDatePicker;
