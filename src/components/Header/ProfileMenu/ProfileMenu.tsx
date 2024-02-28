import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Popover from '@radix-ui/react-popover';
import { features } from 'config';
import { changeSocialLoginInfo } from 'redux/ducks/polkamarkets';
import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';
import { Avatar } from 'ui';

import { Button, Icon } from 'components';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import styles from './ProfileMenu.module.scss';

export default function ProfileMenu() {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const address = useAppSelector(state => state.polkamarkets.ethAddress);
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

  const [username, setUserName] = useState(
    socialLoginInfo?.name?.includes('#')
      ? socialLoginInfo?.name?.split('#')[0]
      : socialLoginInfo?.name?.split('@')[0]
  );
  const [slug, setSlug] = useState(null);
  const [hasUpdatedSocialLoginInfo, setHasUpdatedSocialLoginInfo] =
    useState(false);
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
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className={styles.wrapper}>
          <Avatar
            $radius="lg"
            className={styles.avatar}
            src={socialLoginInfo?.profileImage}
            alt={username || 'avatar'}
          />
          <Icon name="ChevronDown" size="md" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={5}>
          <div className={styles.profileMenu}>
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
              Go To profile
            </Link>
            <Button onClick={handleSocialLogout}>Logout</Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
