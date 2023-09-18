import { useCallback, useState } from 'react';

import { login } from 'redux/ducks/polkamarkets';
import { Transaction } from 'types/transaction';

import Toast from 'components/Toast';
import ToastNotification from 'components/ToastNotification';

import {
  useAppDispatch,
  useFantasyTokenTicker,
  usePolkamarketsService
} from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Button, ButtonLoading } from '../Button';

export default function WalletInfoClaim() {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const toastNotification = useToastNotification();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const [transaction, setTransaction] = useState<Transaction>({
    state: 'not_started'
  });
  const handleClaim = useCallback(async () => {
    try {
      setTransaction({ state: 'request' });

      // performing claim action on smart contract
      await polkamarketsService.claimPolk();
      setTransaction({ state: 'success' });

      toastNotification.show('claim-success');

      dispatch(login(polkamarketsService));
    } catch (error) {
      setTransaction({ state: 'failure' });
    }
  }, [dispatch, polkamarketsService, toastNotification]);
  const isRequesting = transaction.state === 'request';

  return (
    <>
      {transaction.state === 'success' ? (
        <ToastNotification id="claim-success" duration={10000}>
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toastNotification.close('claim-success')}
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
      <ButtonLoading
        className="pm-c-button-normal--primary pm-c-button--sm pm-c-wallet-info__currency__button pm-c-wallet-info__currency__transak"
        loading={isRequesting}
        disabled={isRequesting}
        onClick={handleClaim}
      >
        {`Claim $${fantasyTokenTicker || 'POLK'}`}
      </ButtonLoading>
    </>
  );
}
