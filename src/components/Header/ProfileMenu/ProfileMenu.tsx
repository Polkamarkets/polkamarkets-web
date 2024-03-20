import { useCallback, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { changeSocialLoginInfo } from 'redux/ducks/polkamarkets';
import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';
import { Avatar, useTheme } from 'ui';
import { ButtonIcon } from 'ui/Button/ButtonIcon';
import * as Menu from 'ui/Menu/Menu';

import { Icon } from 'components';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import * as Drawer from '../Drawer/Drawer';
import styles from './ProfileMenu.module.scss';

export const ProfileMenu = () => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const themes = useTheme();
  const history = useHistory();

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

  const profileLink = `/user/
    ${
      slug ||
      leaderboard.data?.slug ||
      leaderboard.data?.username ||
      username ||
      address
    }
  `;

  if (themes.device.isMobileDevice && isLoggedIn) {
    return (
      <Drawer.Root>
        <Drawer.Trigger>
          <Avatar
            $radius="lg"
            className={styles.avatar}
            src={socialLoginInfo?.profileImage}
            alt={username || 'avatar'}
          />
        </Drawer.Trigger>
        <Drawer.Header>Menu</Drawer.Header>
        <Drawer.Content>
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
          <Drawer.Separator />

          <Link to={profileLink}>
            <Drawer.Item className={styles.mobileMenuItem}>
              <Icon name="Profile" />
              Profile
            </Drawer.Item>
          </Link>

          <Link to="/#">
            <Drawer.Item className={styles.mobileMenuItem}>
              <Icon name="Settings" />
              Account Settings
            </Drawer.Item>
          </Link>
          <Link to="/lands">
            <Drawer.Item className={styles.mobileMenuItem}>
              <Icon name="BookMarks" />
              Watchlist
            </Drawer.Item>
          </Link>
          <Drawer.Separator />
          <Drawer.Item
            className={styles.mobileMenuItem}
            onClick={handleSocialLogout}
          >
            <Icon name="Logout" />
            Disconnect
          </Drawer.Item>
          <Drawer.Separator />
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  if (themes.device.isMobileDevice) return null;

  return (
    <Menu.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <Menu.Trigger asChild>
        {isLoggedIn ? (
          <div className={styles.avatarContainer}>
            <Avatar
              $radius="lg"
              className={styles.avatar}
              src={socialLoginInfo?.profileImage}
              alt={username || 'avatar'}
            />
            <Icon name="ChevronDown" size="md" />
          </div>
        ) : (
          <ButtonIcon variant="outlined">
            <Icon name="MoreHoriz" size="md" />
          </ButtonIcon>
        )}
      </Menu.Trigger>
      <Menu.Content align="end" sideOffset={12}>
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
            <Menu.Separator />
            <Menu.Item onClick={() => history.push(profileLink)}>
              <Icon name="Profile" />
              Profile
            </Menu.Item>
            <Menu.Item>
              <Icon name="Settings" />
              Account Settings
            </Menu.Item>
            <Menu.Separator />
          </>
        )}
        <Menu.Item>
          <Icon name="Help" />
          Help Center
        </Menu.Item>
        <Menu.Item>
          <Icon name="CommentAlert" color="transparent" />
          Send Feedback
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <Icon name="NewsPaper" />
          Blog
        </Menu.Item>
        <Menu.Item>
          <Icon name="Planet" />
          About
        </Menu.Item>
        {isLoggedIn && (
          <>
            <Menu.Separator />
            <Menu.Item onClick={handleSocialLogout}>
              <Icon name="Logout" />
              Disconnect
            </Menu.Item>
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
};

export default ProfileMenu;
