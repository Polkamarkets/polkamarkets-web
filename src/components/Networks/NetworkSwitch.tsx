import { useNetworks } from 'contexts/networks';

import { useAppSelector } from 'hooks';
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
  const { changeToNetwork, isChangingNetwork } = useNetworks();

  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const networkId = targetNetworkId || marketNetworkId;

  const marketNetwork = getNetworkById(networkId);

  async function handleChangeNetwork() {
    await changeToNetwork(marketNetwork);
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
