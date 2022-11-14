import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

import { environment } from 'config';
import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';

import { useAppSelector, useNetwork } from 'hooks';
import networks, { Network } from 'hooks/useNetwork/networks';

export type NetworksContextState = {
  network: Network;
  networks: Network[];
  changeToNetwork: (network: Network) => Promise<void>;
  isChangingNetwork: boolean;
};

const NetworksContext = createContext<NetworksContextState>(
  {} as NetworksContextState
);

function NetworksProvider({ children }) {
  const { network: currentNetwork, setNetwork } = useNetwork();

  const walletIsConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

  const [isChangingNetwork, setIsChangingNetwork] = useState(false);

  const availableNetworks = useMemo(
    () =>
      Object.values(networks).filter(network =>
        Object.keys(environment.NETWORKS).includes(network.id)
      ),
    []
  );

  const changeMetaMaskNetwork = useCallback(async (network: Network) => {
    setIsChangingNetwork(true);
    try {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: findKey(networks, network)
            }
          ]
        });
        setIsChangingNetwork(false);
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: findKey(networks, network),
                chainName: network.name,
                nativeCurrency: {
                  name: network.currency.ticker,
                  symbol: network.currency.ticker,
                  decimals: network.decimals
                },
                rpcUrls: network.rpcUrls,
                blockExplorerUrls: [network.explorerURL]
              }
            ]
          });
        }
        setIsChangingNetwork(false);
      }
    } catch (error: any) {
      setIsChangingNetwork(false);
    }
  }, []);

  const changeToNetwork = useCallback(
    async (network: Network) => {
      if (!window.ethereum || !walletIsConnected) {
        setNetwork(network.id);
      } else {
        await changeMetaMaskNetwork(network);
      }
    },
    [changeMetaMaskNetwork, setNetwork, walletIsConnected]
  );

  return (
    <NetworksContext.Provider
      value={{
        network: currentNetwork,
        networks: availableNetworks,
        changeToNetwork,
        isChangingNetwork
      }}
    >
      {children}
    </NetworksContext.Provider>
  );
}

function useNetworks() {
  const context = useContext(NetworksContext);

  if (isEmpty(context)) {
    throw new Error('useNetworks must be used within a NetworksProvider');
  }
  return context;
}

export { NetworksProvider, useNetworks };
