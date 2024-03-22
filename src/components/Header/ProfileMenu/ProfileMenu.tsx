import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as Popover from '@radix-ui/react-popover';
import { changeSocialLoginInfo } from 'redux/ducks/polkamarkets';
import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';
import { Avatar } from 'ui';
import { Button } from 'ui/Button';

import { Icon } from 'components';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import styles from './ProfileMenu.module.scss';

export default function ProfileMenu() {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

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
    if (!isLoggedIn) return;
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
  }, [
    socialLoginInfo,
    address,
    dispatch,
    hasUpdatedSocialLoginInfo,
    isLoggedIn
  ]);

  return (
    <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <Popover.Trigger asChild>
        <div className={styles.wrapper}>
          {isLoggedIn ? (
            <>
              <Avatar
                $radius="lg"
                className={styles.avatar}
                src={socialLoginInfo?.profileImage}
                alt={username || 'avatar'}
              />
              <Icon name="ChevronDown" size="md" />
            </>
          ) : (
            <Button variant="outlined">
              <Icon name="MoreHoriz" size="md" />
            </Button>
          )}
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          onOpenAutoFocus={e => e.preventDefault()}
          onClick={() => setMenuOpen(false)}
        >
          <div className={styles.profileMenu}>
            {isLoggedIn && (
              <>
                <div className={styles.menuProfileAvatar}>
                  <Avatar
                    $radius="lg"
                    className={styles.menuAvatar}
                    src={socialLoginInfo?.profileImage}
                    alt={username || 'avatar'}
                  />
                  <div className={styles.menuProfileInfo}>
                    <span className={styles.menuUserName}>
                      {username || 'Unnamed'}
                    </span>
                    <span className={styles.menuUserAddress}>
                      0x25256230...ca49
                      <Icon
                        name="Copy"
                        onClick={() =>
                          navigator.clipboard.writeText('0x25256230...ca49')
                        }
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.divider} />
                <Link
                  to={`/user/${
                    slug ||
                    leaderboard.data?.slug ||
                    leaderboard.data?.username ||
                    username ||
                    address
                  }`}
                  className={styles.menuItem}
                >
                  <Icon name="Profile" />
                  Profile
                </Link>

                <Link to="/#" className={styles.menuItem}>
                  <Icon name="Settings" />
                  Account Settings
                </Link>
                <div className={styles.divider} />
              </>
            )}

            <Link to="/#" className={styles.menuItem}>
              <Icon name="Help" />
              Help Center
            </Link>
            <Link to="/#" className={styles.menuItem}>
              <Icon name="CommentAlert" color="transparent" />
              Send Feedback
            </Link>
            <div className={styles.divider} />
            <Link to="/#" className={styles.menuItem}>
              <Icon name="NewsPaper" />
              Blog
            </Link>
            <Link to="/#" className={styles.menuItem}>
              <Icon name="Planet" />
              About
            </Link>

            {isLoggedIn && (
              <>
                <div className={styles.divider} />
                <Link
                  to="/#"
                  className={styles.menuItem}
                  onClick={handleSocialLogout}
                >
                  <Icon name="Logout" />
                  Disconnect
                </Link>
              </>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
