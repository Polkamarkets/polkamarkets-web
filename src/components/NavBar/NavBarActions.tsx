import { useEffect } from 'react';

import { formatNumberToString } from 'helpers/math';

import { PolkamarketsIconSmall } from 'assets/icons';

import { useAppSelector, useNetwork } from 'hooks';
import useAlertNotification from 'hooks/useAlertNotification';

import { AlertInline } from '../Alert';
import Link from '../Link';
import Networks from '../Networks';
import WalletInfo from '../WalletInfo';
import NavBarActionsMetamask from './NavBarActionsMetaMask';

function NavBarActions() {
  const { show } = useAlertNotification();
  const { network } = useNetwork();

  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );
  const ethBalance = useAppSelector(state => state.polkamarkets.ethBalance);
  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);
  const walletAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  // Example
  useEffect(() => {
    show('beta-testing');
  }, [show, walletConnected]);

  return (
    <div className="pm-l-navbar__actions">
      <AlertInline
        id="beta-testing"
        variant="warning"
        description={
          <>
            {`Welcome to Polkamarkets! You’re on ${network.name} and placing predictions with ${network.currency.ticker}. Your `}
            <Link
              title="feedback"
              target="_blank"
              href="//discord.gg/Szjn2EEf7w"
              rel="noreferrer"
              variant="warning"
            />
            {` is highly appreciated 🎉`}
          </>
        }
      />
      {network && network.key !== 'unknown' ? <Networks /> : null}
      {walletConnected ? (
        <WalletInfo
          wallets={[
            {
              id: network.currency.name,
              balance: ethBalance.toFixed(4),
              currencyIcon: network.currency.icon
            },
            {
              id: 'polk',
              balance: formatNumberToString(polkBalance),
              currencyIcon: <PolkamarketsIconSmall />
            }
          ]}
          address={walletAddress}
        />
      ) : (
        <NavBarActionsMetamask />
      )}
    </div>
  );
}

export default NavBarActions;
