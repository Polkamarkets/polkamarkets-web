import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { formatNumberToString } from 'helpers/math';
import shortenAddress from 'helpers/shortenAddress';
import { useTheme } from 'ui';

import { MetaMaskIcon as MetaMaskIconUI } from 'assets/icons';

import { useAppSelector, useNetwork } from 'hooks';

import { Transak } from '../integrations';
import walletInfoClasses from './WalletInfo.module.scss';
import WalletInfoClaim from './WalletInfoClaim';

function MetaMaskIcon() {
  return (
    <span className={walletInfoClasses.metamask}>
      <MetaMaskIconUI />
    </span>
  );
}
function MetaMaskWallet(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  return <div className={walletInfoClasses.action} {...props} />;
}
export default function WalletInfo() {
  const theme = useTheme();
  const { network } = useNetwork();
  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);
  const ethBalance = useAppSelector(state => state.polkamarkets.ethBalance);
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);
  const isPolkClaimed = useAppSelector(state => state.polkamarkets.polkClaimed);
  const MetaMaskWalletComponent = theme.device.isDesktop
    ? MetaMaskWallet
    : Fragment;

  return (
    <div className={walletInfoClasses.root}>
      <div className={cn(walletInfoClasses.action, walletInfoClasses.polk)}>
        {formatNumberToString(polkBalance)}
        <span className={walletInfoClasses.actionTicker}>POLK</span>
        {theme.device.isDesktop && (
          <>
            {!isPolkClaimed && <WalletInfoClaim />}
            {network.buyEc20Url && (
              <a
                href={network.buyEc20Url}
                rel="noreferrer"
                target="_blank"
                className={cn(
                  'pm-c-button-normal--default pm-c-button--sm',
                  walletInfoClasses.actionButton,
                  walletInfoClasses.polkBuy
                )}
              >
                Buy {theme.device.isDesktop && '$POLK'}
              </a>
            )}
          </>
        )}
      </div>
      <MetaMaskWalletComponent>
        {theme.device.isDesktop && (
          <>
            <MetaMaskIcon />
            {ethBalance.toFixed(4)}
            <span className={walletInfoClasses.actionTicker}>
              {network.currency.ticker}
            </span>
          </>
        )}
        <Link
          to={`/user/${ethAddress}`}
          className={cn(
            walletInfoClasses.profile,
            walletInfoClasses.actionButton,
            walletInfoClasses.root,
            'pm-c-button-subtle--default pm-c-button--sm'
          )}
        >
          {!theme.device.isDesktop && <MetaMaskIcon />}
          {shortenAddress(ethAddress)}
        </Link>
        {theme.device.isDesktop && <Transak />}
      </MetaMaskWalletComponent>
    </div>
  );
}
