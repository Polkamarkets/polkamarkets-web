import { useState, useRef, useEffect } from 'react';

import classNames from 'classnames';
import { environment } from 'config';
import findKey from 'lodash/findKey';

import { CaretDownFilledIcon } from 'assets/icons';

import { useAppSelector, useNetwork } from 'hooks';
import networks, { Network } from 'hooks/useNetwork/networks';

import Text from '../Text';

const availableNetworks = Object.values(networks).filter(network =>
  Object.keys(environment.NETWORKS).includes(network.id)
);

function Networks() {
  const { network, setNetwork } = useNetwork();
  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  const [isChangingNetwork, setIsChangingNetwork] = useState(false);
  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

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

  function changeLocalNetwork(newNetwork: Network) {
    setNetwork(newNetwork.id);
    handleCloseDropdown();
  }

  async function changeMetamaskNetwork(newNetwork: Network) {
    setIsChangingNetwork(true);
    try {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: findKey(networks, newNetwork)
            }
          ]
        });
        setIsChangingNetwork(false);
        handleCloseDropdown();
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: findKey(networks, newNetwork),
                chainName: newNetwork.name,
                nativeCurrency: {
                  name: newNetwork.currency.ticker,
                  symbol: newNetwork.currency.ticker,
                  decimals: newNetwork.decimals
                },
                rpcUrls: newNetwork.rpcUrls,
                blockExplorerUrls: [newNetwork.explorerURL]
              }
            ]
          });
        }
        setIsChangingNetwork(false);
        handleCloseDropdown();
      }
    } catch (error: any) {
      setIsChangingNetwork(false);
      handleCloseDropdown();
    }
  }

  async function handleChangeNetwork(newNetwork: Network) {
    if (!window.ethereum || !walletConnected) {
      changeLocalNetwork(newNetwork);
    } else {
      await changeMetamaskNetwork(newNetwork);
    }
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
        className={`pm-c-button pm-c-networks__selected--${network.colorAccent}`}
        onClick={handleToggleDropdownVisibility}
        disabled={isChangingNetwork}
      >
        {network.currency.icon}
        <Text
          as="span"
          scale="caption"
          fontWeight="semibold"
          className="pm-c-networks__selected-name"
        >
          {network.name}
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
        {availableNetworks.map(availableNetwork => (
          <li key={availableNetwork.id}>
            <button
              type="button"
              className="pm-c-button-normal--noborder pm-c-networks__dropdown-item"
              onClick={() => handleChangeNetwork(availableNetwork)}
              disabled={isChangingNetwork || availableNetwork.id === network.id}
            >
              {availableNetwork.currency.icon}
              <Text
                as="span"
                scale="caption"
                fontWeight="semibold"
                className="pm-c-networks__dropdown-item-name"
              >
                {availableNetwork.name}
              </Text>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Networks;
