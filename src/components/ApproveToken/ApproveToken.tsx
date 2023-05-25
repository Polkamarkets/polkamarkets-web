import { useCallback, useEffect, useState } from 'react';

import cn from 'classnames';

import { QuestionIcon } from 'assets/icons';

import { useNetwork, usePolkamarketsService } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Button, ButtonLoading } from '../Button';
import type { ButtonProps } from '../Button';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';
import Tooltip from '../Tooltip';
import approveTokenClasses from './ApproveToken.module.scss';

interface ApproveTokenProps
  extends Pick<ButtonProps, 'fullwidth' | 'children'> {
  address: string;
  ticker: string;
  wrapped?: boolean;
  onApprove?(isApproved: boolean): void;
}

function ApproveToken({
  address,
  ticker,
  wrapped = false,
  children,
  onApprove,
  ...props
}: ApproveTokenProps) {
  const { network } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const { show, close } = useToastNotification();

  const predictionMarketContractAddress =
    polkamarketsService.contracts.pm.getAddress();

  const [isTokenApproved, setIsTokenApproved] = useState(false);
  const [isApprovingToken, setIsApprovingToken] = useState(false);
  const [approveTokenTransactionSuccess, setApproveTokenTransactionSuccess] =
    useState(false);
  const [
    approveTokenTransactionSuccessHash,
    setApproveTokenTransactionSuccessHash
  ] = useState(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function checkTokenApproval(tokenAddress, spenderAddress) {
    const isApproved =
      wrapped ||
      !tokenAddress ||
      (await polkamarketsService.isERC20Approved(tokenAddress, spenderAddress));

    setIsTokenApproved(isApproved);
    onApprove?.(isApproved);
  }

  useEffect(() => {
    checkTokenApproval(address, predictionMarketContractAddress);
  }, [address, checkTokenApproval, predictionMarketContractAddress]);

  const handleApproveToken = useCallback(async () => {
    setIsApprovingToken(true);

    try {
      const response = await polkamarketsService.approveERC20(
        address,
        predictionMarketContractAddress
      );

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setApproveTokenTransactionSuccess(status);
        setApproveTokenTransactionSuccessHash(transactionHash);
        show(`approve-${ticker}`);
      }

      setIsApprovingToken(false);

      checkTokenApproval(address, predictionMarketContractAddress);
    } catch (error) {
      setIsApprovingToken(false);
    }
  }, [
    polkamarketsService,
    address,
    ticker,
    predictionMarketContractAddress,
    checkTokenApproval,
    show
  ]);

  if (!isTokenApproved) {
    return (
      <>
        <ButtonLoading
          color="primary"
          size="sm"
          onClick={handleApproveToken}
          loading={isApprovingToken}
          disabled={isApprovingToken}
          className={cn(approveTokenClasses.root, {
            [approveTokenClasses.center]: isApprovingToken,
            [approveTokenClasses.spaced]: !isApprovingToken
          })}
          {...props}
        >
          {`Allow Polkamarkets to use your ${ticker}`}
          <Tooltip text="You only have to do this once.">
            <QuestionIcon className={approveTokenClasses.icon} />
          </Tooltip>
        </ButtonLoading>
        {approveTokenTransactionSuccess &&
        approveTokenTransactionSuccessHash ? (
          <ToastNotification id={`approve-${ticker}`} duration={10000}>
            <Toast
              variant="success"
              title="Success"
              description="Your transaction is completed!"
            >
              <Toast.Actions>
                <a
                  target="_blank"
                  href={`${network.explorerURL}/tx/${approveTokenTransactionSuccessHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => close(`approve-${ticker}`)}
                >
                  Dismiss
                </Button>
              </Toast.Actions>
            </Toast>
          </ToastNotification>
        ) : null}
      </>
    );
  }

  return <>{children}</>;
}

export default ApproveToken;