import type { Network } from 'types/network';
import { Banner } from 'ui';

import Link from 'components/Link';
import NetworkSelector from 'components/NetworkSelector';

import wrongNetworkClasses from './WrongNetwork.module.scss';

type WrongNetworkProps = {
  network: Network;
};

export default function WrongNetwork({ network }: WrongNetworkProps) {
  return (
    <Banner
      $type="warning"
      $variant="subtle"
      actions={<NetworkSelector $color="warn" $size="sm" />}
    >
      The selected network <strong>{network.name}</strong> does not match
      Polkamarkets&apos; networks. <strong>Change</strong> the App network or
      learn{' '}
      <Link
        className={wrongNetworkClasses.link}
        title="how to change"
        target="_blank"
        rel="noreferrer noopener"
        href="https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC"
      />{' '}
      it in MetaMask.
    </Banner>
  );
}
