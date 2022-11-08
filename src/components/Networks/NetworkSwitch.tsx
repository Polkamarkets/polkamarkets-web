import { useState } from 'react';

import findKey from 'lodash/findKey';

import { useAppSelector, useNetwork } from 'hooks';
import networks from 'hooks/useNetwork/networks';

import { Button } from '../Button';
import NetworkSwitchClasses from './NetworkSwitch.module.scss';

function toHex(value: string) {
  return `0x${Number(value).toString(16)}`;
}

function getNetworkById(id: string) {
  return networks[toHex(id)];
}

type NetworkSwitchProps = {
  targetNetworkId?: string;
};

function NetworkSwitch({ targetNetworkId }: NetworkSwitchProps) {
  const { setNetwork } = useNetwork();
  const [isChangingNetwork, setIsChangingNetwork] = useState(false);

  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const networkId = targetNetworkId || marketNetworkId;

  const marketNetwork = getNetworkById(networkId);

  function changeLocalNetwork() {
    setNetwork(marketNetwork.id);
  }

  async function changeMetamaskNetwork() {
    setIsChangingNetwork(true);
    try {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: findKey(networks, marketNetwork)
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
                chainId: findKey(networks, marketNetwork),
                chainName: marketNetwork.name,
                nativeCurrency: {
                  name: marketNetwork.currency.ticker,
                  symbol: marketNetwork.currency.ticker,
                  decimals: marketNetwork.decimals
                },
                rpcUrls: marketNetwork.rpcUrls,
                blockExplorerUrls: [marketNetwork.explorerURL]
              }
            ]
          });
        }
        setIsChangingNetwork(false);
      }
    } catch (error: any) {
      setIsChangingNetwork(false);
    }
  }

  async function handleChangeNetwork() {
    if (!window.ethereum || !walletConnected) {
      changeLocalNetwork();
    } else {
      await changeMetamaskNetwork();
    }
  }

  if (!marketNetwork) return null;

  return (
    <Button
      className={NetworkSwitchClasses.button}
      variant="subtle"
      color="default"
      fullwidth
      onClick={() => handleChangeNetwork()}
      loading={isChangingNetwork}
      disabled={isChangingNetwork}
    >
      Switch Network
      {marketNetwork.currency.icon}
    </Button>
  );
}

export default NetworkSwitch;
