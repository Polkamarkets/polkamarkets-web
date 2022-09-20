/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';
import omit from 'lodash/omit';

import { WalletIcon } from 'assets/icons';

import { Button } from '../Button';
import StepSlider from '../StepSlider';
import Text from '../Text';

type AmountInputProps = {
  name: string;
  label: string;
  max: number;
  currency: any;
  customHeaderItem?: React.ReactNode;
  disabled?: boolean;
};

type AmountInputContext = {
  amount: number;
};

function round(value) {
  return Math.floor(value * 1e5) / 1e5;
}

const AmountInput = React.forwardRef<
  HTMLInputElement,
  AmountInputProps & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      name,
      label,
      max,
      currency,
      customHeaderItem,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [amount, setAmount] = useState<number | undefined>(0);
    const [stepAmount, setStepAmount] = useState<number>(0);
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched } =
      useFormikContext<AmountInputContext>();

    const hasError = meta.touched && meta.error;

    useEffect(() => {
      setFieldValue(name, meta.initialValue);
      setAmount(meta.initialValue);
      setStepAmount(meta.initialValue);
    }, [max, meta.initialValue, name, setFieldValue]);

    function handleChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
      event.preventDefault();
      const { value } = event.currentTarget;

      const newAmount = value ? parseFloat(value) : undefined;

      setFieldValue(name, newAmount || 0);
      setAmount(newAmount);
      setStepAmount(100 * ((newAmount || 0) / max));
    }

    function handleSetMaxAmount() {
      const roundedMax = round(max);

      setFieldValue(name, roundedMax);
      setStepAmount(100);
      setAmount(roundedMax);
    }

    function handleChangeSlider(value: number) {
      setFieldTouched(name, true);
      const percentage = value / 100;

      const newAmount = round(max * percentage);

      setFieldValue(name, newAmount);
      setAmount(newAmount);
      setStepAmount(value);
    }

    return (
      <form className="pm-c-amount-input">
        <div className="pm-c-amount-input__header">
          <label className="pm-c-amount-input__header-title" htmlFor={label}>
            {label}
          </label>
          {!disabled
            ? customHeaderItem || (
                <div className="pm-c-amount-input__header-wallet">
                  <figure aria-label="Wallet">
                    <WalletIcon />
                  </figure>
                  <Button
                    color="noborder"
                    style={{ gap: '0.2rem' }}
                    onClick={handleSetMaxAmount}
                    disabled={disabled}
                  >
                    <Text
                      as="strong"
                      scale="tiny"
                      fontWeight="semibold"
                      color="light"
                    >
                      {max}
                    </Text>
                    <Text
                      as="span"
                      scale="tiny"
                      fontWeight="semibold"
                      color="gray"
                    >
                      {currency.ticker}
                    </Text>
                  </Button>
                </div>
              )
            : null}
        </div>
        <div
          className={classNames({
            'pm-c-amount-input__group': true,
            'pm-c-amount-input__group--error': hasError && meta.error
          })}
        >
          <input
            className="pm-c-amount-input__input"
            type="number"
            ref={ref}
            id={label}
            step=".0001"
            value={amount}
            min={0}
            max={max}
            onChange={event => handleChangeAmount(event)}
            onWheel={event => event.currentTarget.blur()}
            disabled={disabled}
            {...omit(field, ['value', 'onChange'])}
            {...props}
          />
          <div className="pm-c-amount-input__actions">
            <button
              type="button"
              onClick={handleSetMaxAmount}
              disabled={disabled}
            >
              Max
            </button>
            <div className="pm-c-amount-input__logo">
              {currency.icon ? (
                <figure aria-label={currency.name}>{currency.icon}</figure>
              ) : null}
              <Text as="span" scale="caption" fontWeight="bold">
                {currency.ticker}
              </Text>
            </div>
          </div>
        </div>
        {hasError && meta.error ? (
          <div className="pm-c-input__error">
            <Text
              as="span"
              scale="tiny"
              fontWeight="medium"
              className="pm-c-input__error-message"
            >
              {meta.error}
            </Text>
          </div>
        ) : null}
        <StepSlider
          currentValue={stepAmount}
          onChange={value => handleChangeSlider(value)}
          disabled={disabled}
        />
      </form>
    );
  }
);

AmountInput.displayName = 'Amount input';

export default AmountInput;
