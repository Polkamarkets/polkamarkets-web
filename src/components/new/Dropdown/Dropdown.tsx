import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import { ArrowDownSmallIcon } from 'assets/icons';

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: Option[];
  defaultOption: string;
  onSelect: (_value: any) => void;
};

function Dropdown({ options, defaultOption, onSelect }: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState(
    options.find(({ value }) => value === defaultOption) || options[0]
  );
  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);

  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    onSelect(selectedOption.value);
  }, [onSelect, selectedOption]);

  function handleToggleDropdownVisibility() {
    setDropdownIsVisible(!dropdownIsVisible);
  }

  function handleCloseDropdown() {
    setDropdownIsVisible(false);
  }

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      handleCloseDropdown();
    }
  }

  function handleSelectOption(option: Option) {
    setSelectedOption(option);
    handleCloseDropdown();
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <div className="pm-c-dropdown">
      <button
        type="button"
        className={classNames({
          'pm-c-dropdown__selected': true,
          'text-1': true,
          caption: true,
          semibold: true
        })}
        onClick={handleToggleDropdownVisibility}
      >
        {selectedOption.label}
        <ArrowDownSmallIcon />
      </button>
      <ol
        ref={ref}
        style={{ zIndex: 100 }}
        className={classNames({
          'pm-c-dropdown__content': true,
          'margin-top-3': true,
          'padding-3': true,
          'border-solid': true,
          'border-1': true,
          'border-radius-small': true,
          'bg-3': dropdownIsVisible,
          visible: dropdownIsVisible
        })}
      >
        {options
          .filter(({ value }) => value !== selectedOption.value)
          .map(({ label, value }) => (
            <li key={value} className="padding-3">
              <button
                type="button"
                className={classNames({
                  'pm-c-button-normal--noborder': true,
                  caption: true,
                  semibold: true,
                  'text-2': true,
                  'text-1-on-hover': true
                })}
                onClick={() => handleSelectOption({ label, value })}
              >
                {label}
              </button>
            </li>
          ))}
      </ol>
    </div>
  );
}

export default Dropdown;
