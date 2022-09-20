/* eslint-disable react/jsx-indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { WalletIcon } from 'assets/icons';

import { Button } from '../Button';
import StepSlider from '../StepSlider';
import Text from '../Text';

type AmountInputProps = {
  label: string;
  max: number;
  onChange: (value: number) => void;
  currency: any;
  customHeaderItem?: React.ReactNode;
  disabled?: boolean;
};

function round(value) {
  return Math.floor(value * 1e5) / 1e5;
}

function AmountInput({
  label,
  max,
  onChange,
  currency,
  customHeaderItem,
  disabled = false
}: AmountInputProps) {
  const [amount, setAmount] = useState<number | undefined>(0);
  const [stepAmount, setStepAmount] = useState<number>(0);

  useEffect(() => {
    onChange(0);
    setAmount(0);
    setStepAmount(0);
  }, [max]);

  function handleChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { value } = event.currentTarget;

    const newAmount = value ? parseFloat(value) : undefined;

    setAmount(newAmount);
    setStepAmount(100 * ((newAmount || 0) / max));
    onChange(newAmount || 0);
  }

  function handleSetMaxAmount() {
    const roundedMax = round(max);

    setAmount(roundedMax);
    setStepAmount(100);
    onChange(roundedMax);
  }

  function handleChangeSlider(value: number) {
    const percentage = value / 100;

    const newAmount = round(max * percentage);

    setAmount(newAmount);
    onChange(newAmount);
    setStepAmount(value);
  }

  return (
    <div className="pm-c-amount-input">
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
      <div className="pm-c-amount-input__group">
        <input
          className="pm-c-amount-input__input"
          type="number"
          id={label}
          value={amount}
          step=".00001"
          min={0}
          max={max}
          onChange={event => handleChangeAmount(event)}
          onWheel={event => event.currentTarget.blur()}
          disabled={disabled}
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
      <StepSlider
        currentValue={stepAmount}
        onChange={value => handleChangeSlider(value)}
        disabled={disabled}
      />
    </div>
  );
}

AmountInput.displayName = 'AmountInput';

export default AmountInput;
