import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { environment, networks, ui } from 'config';
import { toHexadecimal } from 'helpers/string';
import { fetchAditionalData, login } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';

import { useWhitelist } from 'contexts/whitelist';

import useAppDispatch from '../useAppDispatch';
import useAppSelector from '../useAppSelector';
import useLocalStorage from '../useLocalStorage';
import useQuery from '../useQuery';
import { NetworkContextState } from './useNetwork.type';

export const NetworkContext = createContext<NetworkContextState>(
  {} as NetworkContextState
);

// Constants
const AVAILABLE_NETWORKS = Object.keys(environment.NETWORKS);
const DEFAULT_NETWORK_ID = toHexadecimal(environment.NETWORK_ID || 5);
const DEFAULT_NETWORK = networks[DEFAULT_NETWORK_ID];
const DEFAULT_NETWORK_CONFIG = environment.NETWORKS[DEFAULT_NETWORK.id];

const UNKNOWN_NETWORK = networks['0x270f'];

function getNetwork(networkId) {
  if (ui.socialLogin.enabled) {
    return (
      networks[toHexadecimal(ui.socialLogin.networkId as string)] ||
      UNKNOWN_NETWORK
    );
  }

  return networks[networkId] || UNKNOWN_NETWORK;
}

type NetworkProviderProps = {
  children: ReactNode;
};

function NetworkProvider({ children }: NetworkProviderProps) {
  const location = useLocation();
  const history = useHistory();
  const query = useQuery();
  const dispatch = useAppDispatch();

  const { isEnabled, isWhitelisted } = useWhitelist();

  const walletIsConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

  const [localNetwork, setLocalNetwork] = useLocalStorage<string>(
    'localNetwork',
    DEFAULT_NETWORK.id
  );

  const [metaMaskNetwork, setMetaMaskNetwork] = useState<string>();

  const setNetwork = useCallback(
    (networkId: string) => {
      const network = getNetwork(toHexadecimal(networkId));

      if (network.id !== localNetwork) {
        setLocalNetwork(network.id);
      }

      if (walletIsConnected && network.id !== metaMaskNetwork) {
        setMetaMaskNetwork(network.id);
      }
    },
    [localNetwork, metaMaskNetwork, setLocalNetwork, walletIsConnected]
  );

  const reloadWindow = useCallback(() => {
    if (!query.has('m') && ui.layout.disclaimer.enabled) {
      query.set('m', 'f');
    }

    history.push({
      pathname: location.pathname,
      search: query.toString()
    });

    window.location.reload();
  }, [history, location.pathname, query]);

  useEffect(() => {
    async function getMetaMaskNetwork() {
      const ethNetworkId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const ethNetwork = getNetwork(ethNetworkId);

      setNetwork(ethNetwork.id);
    }

    if (window.ethereum && walletIsConnected) {
      getMetaMaskNetwork();
    }
  }, [setNetwork, walletIsConnected]);

  const network = getNetwork(toHexadecimal(metaMaskNetwork || localNetwork));
  const isAnAvailableNetwork = AVAILABLE_NETWORKS.includes(network.id);
  const networkConfig =
    environment.NETWORKS[network.id] || DEFAULT_NETWORK_CONFIG;

  const polkamarketService = useMemo(
    () => new PolkamarketsService(networkConfig),
    [networkConfig]
  );

  useEffect(() => {
    dispatch(
      login(
        polkamarketService,
        ui.socialLogin.hasAutoClaim && (!isEnabled || isWhitelisted)
      )
    );
  }, [dispatch, isEnabled, isWhitelisted, polkamarketService]);

  useEffect(() => {
    async function fetchUserData() {
      dispatch(fetchAditionalData(polkamarketService));
    }

    if (walletIsConnected && isAnAvailableNetwork) {
      fetchUserData();
    }
  }, [dispatch, isAnAvailableNetwork, polkamarketService, walletIsConnected]);

  useEffect(() => {
    window.ethereum?.on('chainChanged', reloadWindow);

    return () => window.ethereum?.removeListener('chainChanged', reloadWindow);
  }, [reloadWindow]);

  useEffect(() => {
    window.ethereum?.on('accountsChanged', reloadWindow);

    return () =>
      window.ethereum?.removeListener('accountsChanged', reloadWindow);
  }, [reloadWindow]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        networkConfig,
        setNetwork
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;
