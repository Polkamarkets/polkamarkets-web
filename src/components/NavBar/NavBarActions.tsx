import { useEffect } from 'react';

import { formatNumberToString } from 'helpers/math';
import { login } from 'redux/ducks/bepro';
import { BeproService } from 'services';

import { MetaMaskIconSmall, PolkamarketsIconSmall } from 'assets/icons';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';
import useAlertNotification from 'hooks/useAlertNotification';

import { AlertInline } from '../Alert';
import { Button } from '../Button';
import Link from '../Link';
import NetworkInfo from '../NetworkInfo';
import WalletInfo from '../WalletInfo';

function NavBarActions() {
  const { show } = useAlertNotification();
  const dispatch = useAppDispatch();
  const network = useNetwork();

  const beproService = new BeproService();

  const walletConnected = useAppSelector(state => state.bepro.isLoggedIn);
  const ethBalance = useAppSelector(state => state.bepro.ethBalance);
  const governanceBalance = useAppSelector(
    state => state.bepro.governanceBalance
  );
  const walletAddress = useAppSelector(state => state.bepro.ethAddress);

  // Example
  useEffect(() => {
    show('beta-testing');
  }, [show, walletConnected]);

  const handleConnectWallet = async () => {
    await beproService.login();
    await login(dispatch);
  };

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
      {network && network.key !== 'unknown' ? (
        <NetworkInfo name={network.name} slug={network.key} />
      ) : null}
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
              balance: formatNumberToString(governanceBalance),
              currencyIcon: <PolkamarketsIconSmall />
            }
          ]}
          address={walletAddress}
        />
      ) : (
        <Button
          variant="outline"
          color="default"
          size="sm"
          aria-label="Connect MetaMask"
          onClick={handleConnectWallet}
        >
          <MetaMaskIconSmall />
          Connect MetaMask
        </Button>
      )}
    </div>
  );
}

export default NavBarActions;
