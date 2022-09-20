import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { environment } from 'config';
import { NetworkConfig } from 'config/environment';
import { toHexadecimal } from 'helpers/string';
import {
  changeNetworkId,
  fetchAditionalData,
  login
} from 'redux/ducks/polkamarkets';
import store from 'redux/store';

import { useAppDispatch } from 'hooks';

import useAppSelector from '../useAppSelector';
import useLocalStorage from '../useLocalStorage';
import NETWORKS, { Network } from './networks';

declare global {
  interface Window {
    ethereum: any;
  }
}

function fetchUserData(networkConfig: NetworkConfig) {
  store.dispatch(login(networkConfig));
  store.dispatch(fetchAditionalData(networkConfig));
}

function useNetwork() {
  // Constants
  const DEFAULT_NETWORK_ID = toHexadecimal(environment.NETWORK_ID || 42);
  const DEFAULT_NETWORK = NETWORKS[DEFAULT_NETWORK_ID];
  const DEFAULT_NETWORK_CONFIG = environment.NETWORKS[DEFAULT_NETWORK.id];

  const UNKNOWN_NETWORK = NETWORKS['0x270f'];

  const AVAILABLE_NETWORKS = Object.keys(environment.NETWORKS);

  // Third-party hooks
  const location = useLocation();
  const history = useHistory();

  // Custom hooks
  const dispatch = useAppDispatch();
  const [localNetwork, setLocalNetwork] = useLocalStorage<string>(
    'localNetwork',
    DEFAULT_NETWORK.id
  );

  // Redux state selectors
  const metamaskWalletIsConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );
  const metamaskNetworkId = useAppSelector(
    state => state.polkamarkets.networkId
  );

  // Derivated state
  const metamaskNetwork = metamaskNetworkId
    ? NETWORKS[metamaskNetworkId] || UNKNOWN_NETWORK
    : null;

  const localEthereumNetworkId = toHexadecimal(localNetwork);
  const localEthereumNetwork =
    NETWORKS[localEthereumNetworkId] || UNKNOWN_NETWORK;

  const [network, setNetwork] = useState<Network>(
    metamaskNetwork || localEthereumNetwork || DEFAULT_NETWORK
  );

  const networkConfig = environment.NETWORKS[network.id];

  if (metamaskNetwork && network !== metamaskNetwork) {
    setNetwork(metamaskNetwork);
  }

  useEffect(() => {
    async function getCurrentEthereumNetworkId() {
      if (window.ethereum && metamaskWalletIsConnected) {
        const currentEthereumNetworkId = await window.ethereum.request({
          method: 'eth_chainId'
        });

        const currentEthereumNetwork =
          NETWORKS[currentEthereumNetworkId] || UNKNOWN_NETWORK;

        setNetwork(currentEthereumNetwork);

        if (
          metamaskWalletIsConnected &&
          AVAILABLE_NETWORKS.includes(currentEthereumNetwork.id) &&
          currentEthereumNetworkId !== metamaskNetworkId
        ) {
          fetchUserData(environment.NETWORKS[currentEthereumNetwork.id]);
        }
        // changing networkId on redux only after fetch portfolio has been called
        dispatch(changeNetworkId(currentEthereumNetworkId));
      } else {
        setNetwork(localEthereumNetwork);
      }
    }

    getCurrentEthereumNetworkId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNetwork]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        history.push(`${location.pathname}?m=f`);
        window.location.reload();
      });
    }
  }, [history, location.pathname]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        history.push(`${location.pathname}?m=f`);
        window.location.reload();
      });
    }
  }, [history, location.pathname]);

  return {
    network,
    networkConfig: networkConfig || DEFAULT_NETWORK_CONFIG,
    setNetwork: setLocalNetwork
  };
}

export default useNetwork;
