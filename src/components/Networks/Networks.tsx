import { useState, useRef, useEffect } from 'react';

import classNames from 'classnames';

import { CaretDownFilledIcon } from 'assets/icons';

import { useNetworks } from 'contexts/networks';

import { Network } from 'hooks/useNetwork/networks';

import Text from '../Text';

function Networks() {
  const {
    network: currentNetwork,
    networks,
    changeToNetwork,
    isChangingNetwork
  } = useNetworks();

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);

  const ref = useRef<HTMLOListElement>(null);

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

  async function handleChangeNetwork(newNetwork: Network) {
    await changeToNetwork(newNetwork);
    handleCloseDropdown();
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <div className="pm-c-networks">
      <button
        type="button"
        className={`pm-c-button pm-c-networks__selected--${currentNetwork.colorAccent}`}
        onClick={handleToggleDropdownVisibility}
        disabled={isChangingNetwork}
      >
        {currentNetwork.currency.icon}
        <Text
          as="span"
          scale="caption"
          fontWeight="semibold"
          className="pm-c-networks__selected-name"
        >
          {currentNetwork.name}
        </Text>
        <CaretDownFilledIcon className="pm-c-networks__selected-caret-icon" />
      </button>
      <ol
        ref={ref}
        className={classNames({
          'pm-c-networks__dropdown': true,
          visible: dropdownIsVisible
        })}
      >
        {networks.map(network => (
          <li key={network.id}>
            <button
              type="button"
              className="pm-c-button-normal--noborder pm-c-networks__dropdown-item"
              onClick={() => handleChangeNetwork(network)}
              disabled={isChangingNetwork || network.id === currentNetwork.id}
            >
              {network.currency.icon}
              <Text
                as="span"
                scale="caption"
                fontWeight="semibold"
                className="pm-c-networks__dropdown-item-name"
              >
                {network.name}
              </Text>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Networks;
