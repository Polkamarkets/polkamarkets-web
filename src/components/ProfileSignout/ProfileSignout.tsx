import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { features } from 'config';
import { formatNumberToString } from 'helpers/math';
import shortenAddress from 'helpers/shortenAddress';
import { changeSocialLoginInfo } from 'redux/ducks/polkamarkets';
import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';
import { Avatar, Skeleton } from 'ui';

import BankruptBadge from 'components/BankruptBadge';
import { Button } from 'components/Button';
import Icon from 'components/Icon';
import InfoTooltip from 'components/InfoTooltip';
import Text from 'components/Text';

import {
  useAppDispatch,
  useAppSelector,
  useFantasyTokenTicker,
  useLanguage,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import profileSignoutClasses from './ProfileSignout.module.scss';

export default function ProfileSignout() {
  const dispatch = useAppDispatch();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const polkamarketsService = usePolkamarketsService();
  const language = useLanguage();
  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);
  const address = useAppSelector(state => state.polkamarkets.ethAddress);
  const isPolkLoading = useAppSelector(
    state => state.polkamarkets.isLoading.polk
  );
  const bankrupt = useAppSelector(state => state.polkamarkets.bankrupt);
  const polkClaimed = useAppSelector(state => state.polkamarkets.polkClaimed);
  const network = useNetwork();
  const leaderboard = useGetLeaderboardByAddressQuery({
    address,
    networkId: network.network.id,
    timeframe: 'at'
  });
  const socialLoginInfo = useAppSelector(
    state => state.polkamarkets.socialLoginInfo
  );
  const handleSocialLogout = useCallback(async () => {
    const { logout } = await import('redux/ducks/polkamarkets');

    polkamarketsService.logoutSocialLogin();
    dispatch(logout());
  }, [dispatch, polkamarketsService]);
  const handleClaim = useCallback(async () => {
    const { claim } = await import('redux/ducks/polkamarkets');

    dispatch(claim(polkamarketsService));
  }, [dispatch, polkamarketsService]);

  const [username, setUserName] = useState(
    socialLoginInfo?.name?.includes('#')
      ? socialLoginInfo?.name?.split('#')[0]
      : socialLoginInfo?.name?.split('@')[0]
  );
  const [slug, setSlug] = useState(null);
  const [hasUpdatedSocialLoginInfo, setHasUpdatedSocialLoginInfo] =
    useState(false);
  const ticker = fantasyTokenTicker || 'POLK';
  const tooltipText =
    language === 'pt'
      ? `${ticker} é a “moeda” usada para fazer previsões e para ordenar a classificação de cada jogador.`
      : `${ticker} is the token used to place predictions and rank on the leaderboard.`;

  useEffect(() => {
    async function handleSocialLogin() {
      const { updateSocialLoginInfo } = await import(
        'services/Polkamarkets/user'
      );

      if (hasUpdatedSocialLoginInfo) return;

      // send data to backend
      const res = await updateSocialLoginInfo(
        socialLoginInfo.idToken,
        socialLoginInfo.typeOfLogin,
        address,
        socialLoginInfo.profileImage,
        socialLoginInfo.oAuthAccessToken
      );

      if (res.data?.user?.username) {
        setUserName(res.data?.user?.username);
      }

      if (res.data?.user?.slug) {
        setSlug(res.data?.user?.slug);
      }

      if (res.data?.user?.avatar) {
        dispatch(
          changeSocialLoginInfo({
            ...socialLoginInfo,
            profileImage: res.data?.user?.avatar
          })
        );
      }

      setHasUpdatedSocialLoginInfo(true);
    }

    handleSocialLogin();
  }, [socialLoginInfo, address, dispatch, hasUpdatedSocialLoginInfo]);

  return (
    <div className={profileSignoutClasses.root}>
      <Button
        variant="ghost"
        color="default"
        size="sm"
        onClick={handleSocialLogout}
        className={profileSignoutClasses.signout}
      >
        <Icon
          name="LogOut"
          size="lg"
          className={profileSignoutClasses.signoutIcon}
        />
        Sign Out
      </Button>
      <div className="pm-c-wallet-info__profile notranslate">
        <Link
          to={`/user/${
            (features.fantasy.enabled &&
              (slug ||
                leaderboard.data?.slug ||
                leaderboard.data?.username ||
                username)) ||
            address
          }`}
        >
          <Avatar
            $size="sm"
            $radius="lg"
            src={socialLoginInfo?.profileImage}
            alt={username || 'avatar'}
          />
        </Link>
        <div>
          <Text
            scale="caption"
            fontWeight="semibold"
            className={profileSignoutClasses.username}
          >
            {username || shortenAddress(address)}
          </Text>
          {(() => {
            if (isPolkLoading)
              return <Skeleton style={{ height: 16, width: 52 }} />;
            if (!polkClaimed)
              return (
                <button
                  type="button"
                  className={profileSignoutClasses.claim}
                  onClick={handleClaim}
                >
                  Claim {ticker}
                </button>
              );

            return (
              <div className="flex-row gap-3 align-center">
                <Text
                  scale="tiny-uppercase"
                  fontWeight="semibold"
                  className="pm-c-wallet-info__profile__ticker"
                >
                  {formatNumberToString(polkBalance)} {ticker}
                  <InfoTooltip text={tooltipText} />
                </Text>
                <BankruptBadge bankrupt={bankrupt} />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
