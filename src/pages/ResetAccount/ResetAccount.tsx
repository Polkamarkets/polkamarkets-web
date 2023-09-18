import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import dayjs from 'dayjs';
import { changePolkBalance } from 'redux/ducks/polkamarkets';
import { getPortfolio } from 'redux/ducks/portfolio';
import { useGetLeaderboardByTimeframeQuery } from 'services/Polkamarkets';
import { Container } from 'ui';

import { ButtonLoading } from 'components/Button';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import styles from './ResetAccount.module.scss';
import ResetAccountMarkets from './ResetAccountMarkets';

function ResetAccount() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { network } = useNetwork();
  const polkamarketsService = usePolkamarketsService();

  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const isLoadingLogin = useAppSelector(
    state => state.polkamarkets.isLoading.login
  );
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const [canReset, setCanReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const redirectToHome = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleChangeCanReset = useCallback(
    value => {
      if (value !== canReset) setCanReset(value);
    },
    [canReset]
  );

  const handleResetAccount = useCallback(async () => {
    if (!canReset) return;
    setIsResetting(true);

    try {
      await polkamarketsService.resetBalance();

      setCanReset(false);
      setHasReset(true);
      setIsResetting(false);

      await polkamarketsService
        .getPolkBalance()
        .then(polkBalance => {
          dispatch(changePolkBalance(polkBalance));
        })
        .catch(() => {});

      redirectToHome();
    } catch (err) {
      setIsResetting(false);
    }
  }, [canReset, dispatch, polkamarketsService, redirectToHome]);

  const [hasReset, setHasReset] = useState(false);

  const {
    data: leaderboardByTimeframe,
    isLoading: isLoadingLeaderboardByTimeframe,
    isFetching: isFetchingLeaderboardByTimeframe
  } = useGetLeaderboardByTimeframeQuery(
    {
      timeframe: 'at',
      networkId: network.id
    },
    {
      skip: !isLoggedIn
    }
  );

  const isLoadingLeaderboard =
    isLoadingLeaderboardByTimeframe ||
    isFetchingLeaderboardByTimeframe ||
    isLoadingLogin;

  const isMaliciousUser = useMemo(() => {
    if (!leaderboardByTimeframe) return false;

    const userInLeaderboard = leaderboardByTimeframe.find(
      row => row.user.toLowerCase() === ethAddress.toLowerCase()
    );

    if (!userInLeaderboard) return false;

    return userInLeaderboard.malicious === true;
  }, [ethAddress, leaderboardByTimeframe]);

  useEffect(() => {
    async function fetchHasUserResetBalance() {
      // chek if user has reset balance over the last hour
      const response = await polkamarketsService.hasUserResetBalance(
        dayjs().subtract(1, 'hour').unix()
      );

      setHasReset(response);
    }

    if (!isLoadingLogin && isLoggedIn) {
      fetchHasUserResetBalance();
    }
  }, [
    ethAddress,
    dispatch,
    isLoadingLogin,
    isLoggedIn,
    network.id,
    polkamarketsService
  ]);

  useEffect(() => {
    if (
      !(isLoadingLogin || isLoggedIn) ||
      !(isLoadingLeaderboard || isMaliciousUser) ||
      hasReset
    ) {
      redirectToHome();
    }
  }, [
    hasReset,
    isLoadingLeaderboard,
    isLoadingLogin,
    isLoggedIn,
    isMaliciousUser,
    redirectToHome
  ]);

  useEffect(() => {
    async function fetchPortfolio() {
      dispatch(getPortfolio(ethAddress, network.id));
    }

    if (!isLoadingLogin && isLoggedIn) {
      fetchPortfolio();
    }
  }, [dispatch, ethAddress, isLoadingLogin, isLoggedIn, network.id]);

  if (isLoadingLogin || isLoadingLeaderboard) {
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );
  }

  return (
    <Container className="flex-column justify-start align-start gap-5 width-full max-width-screen-xl">
      <div className="flex-row justify-space-between align-center gap-6 width-full margin-bottom-4">
        <div className="flex-column gap-6">
          <h1 className="heading semibold text-1">Reset Account</h1>
          <p className="caption medium text-2">
            Your account has been flagged for suspicious activity. <br /> In
            order to reset your status, you&apos;ll need to reset your balance
            back to the initial amount.
          </p>
          <ButtonLoading
            size="sm"
            color="primary"
            className={styles.actionButton}
            disabled={!canReset}
            loading={isResetting}
            onClick={handleResetAccount}
          >
            Reset Account
          </ButtonLoading>
          {!canReset && (
            <p className="caption medium text-2">
              You need to sell all your positions before you can reset your
              account.
            </p>
          )}
        </div>
      </div>
      {!canReset && (
        <ResetAccountMarkets onChangeCanReset={handleChangeCanReset} />
      )}
    </Container>
  );
}

export default ResetAccount;
