import { useState } from 'react';

import cn from 'classnames';
import { reset } from 'redux/ducks/liquidity';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { closeLiquidityForm } from 'redux/ducks/ui';
import { PolkamarketsApiService } from 'services';

import {
  useAppDispatch,
  useAppSelector,
  useERC20Balance,
  useNetwork,
  usePolkamarketsService
} from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import ApproveToken from '../ApproveToken';
import { Button, ButtonLoading } from '../Button';
import Feature from '../Feature';
import NetworkSwitch from '../Networks/NetworkSwitch';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';

function LiquidityFormActions() {
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const polkamarketsService = usePolkamarketsService();
  const transactionType = useAppSelector(
    state => state.liquidity.transactionType
  );
  const marketId = useAppSelector(state => state.market.market.id);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const token = useAppSelector(state => state.market.market.token);
  const { wrapped: tokenWrapped, address } = token;
  const wrapped = useAppSelector(state => state.liquidity.wrapped);
  const amount = useAppSelector(state => state.liquidity.amount);
  const maxAmount = useAppSelector(state => state.liquidity.maxAmount);
  const [isApproved, setApproved] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionSuccessHash, setTransactionSuccessHash] =
    useState(undefined);

  // terms currently disabled
  const acceptedTerms = true;
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const [isLoading, setIsLoading] = useState(false);
  const { show, close } = useToastNotification();
  const { refreshBalance } = useERC20Balance(address);

  const isWrongNetwork = network.id !== `${marketNetworkId}`;

  function handleCancel() {
    dispatch(closeLiquidityForm());
    dispatch(reset());
  }

  async function updateWallet() {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }

  async function handleAddliquidity() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

    setIsLoading(true);

    try {
      // performing buy action on smart contract
      const response = await polkamarketsService.addLiquidity(
        marketId,
        amount,
        tokenWrapped && !wrapped
      );

      setIsLoading(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setTransactionSuccess(status);
        setTransactionSuccessHash(transactionHash);
        show(transactionType);
      }

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function handleRemoveLiquidity() {
    setTransactionSuccess(false);
    setTransactionSuccessHash(undefined);

    setIsLoading(true);

    try {
      // performing buy action on smart contract
      const response = await polkamarketsService.removeLiquidity(
        marketId,
        amount,
        tokenWrapped && !wrapped
      );

      setIsLoading(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setTransactionSuccess(status);
        setTransactionSuccessHash(transactionHash);
        show(transactionType);
      }

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);
      new PolkamarketsApiService().reloadPortfolio(ethAddress, network.id);

      // updating wallet
      await updateWallet();
      await refreshBalance();
    } catch (error) {
      setIsLoading(false);
    }
  }

  const isValidAmount = amount > 0 && amount <= maxAmount;

  return (
    <div
      className={cn('pm-c-liquidity-form__actions', {
        'pm-c-liquidity-form__actions--column': !isApproved
      })}
    >
      {isWrongNetwork ? <NetworkSwitch /> : null}
      {transactionType === 'add' && !isWrongNetwork ? (
        <ApproveToken
          fullwidth
          address={token.address}
          ticker={token.ticker}
          wrapped={token.wrapped && !wrapped}
          onApprove={setApproved}
        >
          <ButtonLoading
            color="primary"
            fullwidth
            onClick={handleAddliquidity}
            disabled={!isValidAmount || !acceptedTerms || isLoading}
            loading={isLoading}
          >
            Add Liquidity
          </ButtonLoading>
        </ApproveToken>
      ) : null}
      {transactionType === 'remove' && !isWrongNetwork ? (
        <ButtonLoading
          color="primary"
          fullwidth
          onClick={handleRemoveLiquidity}
          disabled={!isValidAmount || !acceptedTerms || isLoading}
          loading={isLoading}
        >
          Remove Liquidity
        </ButtonLoading>
      ) : null}
      <Button variant="subtle" color="default" onClick={handleCancel}>
        Cancel
      </Button>
      {transactionSuccess && transactionSuccessHash ? (
        <ToastNotification id={transactionType} duration={10000}>
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <Feature name="regular">
                <a
                  target="_blank"
                  href={`${network.explorerURL}/tx/${transactionSuccessHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
              </Feature>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => close(transactionType)}
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
    </div>
  );
}

LiquidityFormActions.displayName = 'LiquidityFormActions';

export default LiquidityFormActions;
