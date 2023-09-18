import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ui } from 'config';
import { useField, useFormikContext } from 'formik';
import { roundNumber } from 'helpers/math';
import has from 'lodash/has';
import { changeData, changeQuestion } from 'redux/ducks/market';
import { fetchAditionalData, login } from 'redux/ducks/polkamarkets';
import { selectOutcome } from 'redux/ducks/trade';
import { closeReportForm, openTradeForm } from 'redux/ducks/ui';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

import ApproveToken from 'components/ApproveToken';
import NetworkSwitch from 'components/Networks/NetworkSwitch';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  usePolkamarketsService
} from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Alert, AlertMinimal } from '../Alert';
import { Button, ButtonLoading } from '../Button';
import Feature from '../Feature';
import Link from '../Link';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';

type ReportFormActionsProps = {
  marketQuestionFinalized: boolean;
};

function ReportFormActions({
  marketQuestionFinalized
}: ReportFormActionsProps) {
  // Helpers
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { show, close } = useToastNotification();
  const { errors } = useFormikContext();
  const { network, networkConfig } = useNetwork();
  const polkamarketsService = usePolkamarketsService();

  // Form state
  const [outcome] = useField('outcome');
  const [bond] = useField('bond');

  // Loading state
  const [isBonding, setIsBonding] = useState(false);
  const [bondTransactionSuccess, setBondTransactionSuccess] = useState(false);
  const [bondTransactionSuccessHash, setBondTransactionSuccessHash] =
    useState(undefined);

  const [isResolvingMarket, setIsResolvingMarket] = useState(false);
  const [marketResolveTransactionSuccess, setMarketResolveTransactionSuccess] =
    useState(false);
  const [
    marketResolveTransactionSuccessHash,
    setMarketResolveTransactionSuccessHash
  ] = useState(undefined);

  // Selectors
  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

  const marketSlug = useAppSelector(state => state.market.market.slug);

  const { id, questionId, networkId } = useAppSelector(
    state => state.market.market
  );
  const { bestAnswer } = useAppSelector(state => state.market.market.question);
  const questionBond = useAppSelector(
    state => state.market.market.question.bond
  );

  // Derivated state
  const isMarketPage = location.pathname === `/markets/${marketSlug}`;
  const isWrongNetwork =
    !ui.socialLogin.enabled && network.id !== `${networkId}`;
  const resolvedOutcomeId = PolkamarketsService.bytes32ToInt(bestAnswer);

  const isWinningOutcome = outcomeId =>
    `${resolvedOutcomeId}` === `${outcomeId}`;

  const showCurrentOutcomeBondWarning =
    !marketQuestionFinalized &&
    isWinningOutcome(outcome.value) &&
    bond.value > 0 &&
    questionBond > 0;

  function handleCancel() {
    dispatch(selectOutcome('', '', ''));
    dispatch(closeReportForm());
  }

  async function handleBond() {
    const polkamarketApiService = new PolkamarketsApiService();

    setIsBonding(true);

    try {
      // performing buy action on smart contract
      const response = await polkamarketsService.placeBond(
        questionId,
        outcome.value,
        bond.value
      );

      setIsBonding(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setBondTransactionSuccess(status);
        setBondTransactionSuccessHash(transactionHash);
        show('bond');
      }

      // triggering cache reload action on api
      polkamarketApiService.reloadMarket(marketSlug);

      // updating wallet
      dispatch(login(polkamarketsService));
      dispatch(fetchAditionalData(polkamarketsService));

      // updating question
      const question = await polkamarketsService.getQuestion(questionId);
      dispatch(changeQuestion(question));
    } catch (error) {
      setIsBonding(false);
    }
  }

  async function handleResolve() {
    setIsResolvingMarket(true);
    try {
      const response = await polkamarketsService.resolveMarket(id);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setMarketResolveTransactionSuccess(status);
        setMarketResolveTransactionSuccessHash(transactionHash);
        show('marketResolve');
        dispatch(
          changeData({
            data: {
              state: 'resolved'
            }
          })
        );
        dispatch(openTradeForm());

        // triggering cache reload action on api
        new PolkamarketsApiService().reloadMarket(marketSlug);
      }

      setIsResolvingMarket(false);
    } catch (error) {
      setIsResolvingMarket(false);
    }
  }

  return (
    <div className="pm-c-report-form-details__actions">
      {isWrongNetwork ? (
        <div className="pm-c-report-form-details__actions-group--column">
          <NetworkSwitch />
        </div>
      ) : (
        <div className="pm-c-report-form-details__actions-group--column">
          {showCurrentOutcomeBondWarning ? (
            <AlertMinimal
              variant="warning"
              description={
                <>
                  {`Placing a bond on the winning outcome will restart the timer.
                You'll also pay the previous answerer ${roundNumber(
                  questionBond,
                  3
                )} POLK. `}
                  <Link
                    target="_blank"
                    href="https://help.polkamarkets.com/en/articles/5610525-how-market-resolution-works"
                    rel="noreferrer"
                    variant="warning"
                    scale="caption"
                    fontWeight="semibold"
                    title="Learn more"
                  />
                </>
              }
            />
          ) : null}
          {marketQuestionFinalized ? (
            <Alert
              variant="success"
              title="Resolve market"
              description={
                <>
                  {`You're one step away from claiming your winnings! The smart contract needs to fetch the
                 outcome reported by the reporters and calculate the market payouts. `}
                </>
              }
            />
          ) : null}
          {marketResolveTransactionSuccess &&
          marketResolveTransactionSuccessHash ? (
            <ToastNotification id="marketResolve" duration={10000}>
              <Toast
                variant="success"
                title="Success"
                description="Your transaction is completed!"
              >
                <Toast.Actions>
                  <Feature name="regular">
                    <a
                      target="_blank"
                      href={`${network.explorerURL}/tx/${marketResolveTransactionSuccessHash}`}
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
                    onClick={() => close('marketResolve')}
                  >
                    Dismiss
                  </Button>
                </Toast.Actions>
              </Toast>
            </ToastNotification>
          ) : null}
          <div className="pm-c-report-form-details__actions-group--row">
            {!isMarketPage ? (
              <Button variant="subtle" color="default" onClick={handleCancel}>
                Cancel
              </Button>
            ) : null}
            {marketQuestionFinalized ? (
              <ButtonLoading
                type="button"
                color="success"
                fullwidth
                onClick={handleResolve}
                disabled={!walletConnected || isResolvingMarket}
                loading={isResolvingMarket}
              >
                Resolve
              </ButtonLoading>
            ) : (
              <ApproveToken
                fullwidth
                address={networkConfig.ERC20_CONTRACT_ADDRESS}
                spenderAddress={networkConfig.REALITIO_ERC20_CONTRACT_ADDRESS}
                ticker="POLK"
              >
                <ButtonLoading
                  type="submit"
                  color={showCurrentOutcomeBondWarning ? 'warning' : 'primary'}
                  fullwidth
                  onClick={handleBond}
                  disabled={
                    !walletConnected ||
                    bond.value === 0 ||
                    isBonding ||
                    has(errors, 'bond')
                  }
                  loading={isBonding}
                >
                  Bond
                </ButtonLoading>
              </ApproveToken>
            )}
            {/* TODO: Create notifications by type (ex: Transaction completed) */}
            {bondTransactionSuccess && bondTransactionSuccessHash ? (
              <ToastNotification id="bond" duration={10000}>
                <Toast
                  variant="success"
                  title="Success"
                  description="Your transaction is completed!"
                >
                  <Toast.Actions>
                    <Feature name="regular">
                      <a
                        target="_blank"
                        href={`${network.explorerURL}/tx/${bondTransactionSuccessHash}`}
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
                      onClick={() => close('bond')}
                    >
                      Dismiss
                    </Button>
                  </Toast.Actions>
                </Toast>
              </ToastNotification>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportFormActions;
