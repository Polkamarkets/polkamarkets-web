import { Link } from 'react-router-dom';

import cn from 'classnames';
import { community } from 'config';
import { Skeleton, useTheme } from 'ui';

import { Button, Icon } from 'components';
import Profile from 'components/Header/Profile';
import TransactionsButton from 'components/Header/TransactionsButton';

import { useAppSelector } from 'hooks';

import * as Drawer from '../Drawer/Drawer';
import { MobileSearchBar } from '../MobileSearchBar/MobileSearchBar';
import styles from './HeaderActions.module.scss';

function SkeletonProfile() {
  return (
    <div
      style={{
        display: 'inherit',
        alignItems: 'center',
        gap: 24
      }}
    >
      <Skeleton
        style={{
          height: 32,
          width: 46
        }}
      />
      <Skeleton
        style={{
          height: 32,
          width: 46
        }}
      />
      <div
        style={{
          display: 'inherit',
          alignItems: 'center',
          gap: 12
        }}
      >
        <Skeleton
          radius="full"
          style={{
            height: 48,
            width: 48
          }}
        />
      </div>
    </div>
  );
}
export default function HeaderActions() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const isLoading = useAppSelector(state => state.polkamarkets.isLoading.login);
  const theme = useTheme();

  return (
    <div className={cn(styles.root)}>
      {theme.device.isMobileDevice && <MobileSearchBar />}
      {isLoading ? (
        <SkeletonProfile />
      ) : (
        <>
          {isLoggedIn && theme.device.isDesktop && (
            <>
              <Link to="/markets/create" aria-label="Create Market">
                <Button variant="ghost" className={styles.createButton}>
                  <Icon name="Plus" size="lg" />
                </Button>
              </Link>
              <TransactionsButton />
            </>
          )}
          <Profile isLoggedIn={isLoggedIn} />
          {theme.device.isMobileDevice && (
            <Drawer.Root>
              <Drawer.Trigger>
                <Icon name="Menu" size="lg" title="Open Menu" />
              </Drawer.Trigger>
              <Drawer.Header>Menu</Drawer.Header>
              <Drawer.Content>
                <Link to="/lands">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="UserCommunities" />
                    Lands
                  </Drawer.Item>
                </Link>
                <Link to="/contests">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="Cup" />
                    Contests
                  </Drawer.Item>
                </Link>
                <Link to="/questions">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="Layers" />
                    Questions
                  </Drawer.Item>
                </Link>
                <Drawer.Separator />
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="Help" />
                    Help Center
                  </Drawer.Item>
                </Link>
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="CommentAlert" color="transparent" />
                    Send Feedback
                  </Drawer.Item>
                </Link>
                <Drawer.Separator />
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="NewsPaper" />
                    Blog
                  </Drawer.Item>
                </Link>
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="Planet" />
                    About
                  </Drawer.Item>
                </Link>
                <Drawer.Separator />
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="Book" />
                    Terms
                  </Drawer.Item>
                </Link>
                <Link to="/#">
                  <Drawer.Item className={styles.menuItem}>
                    <Icon name="BookOpen" />
                    Privacy
                  </Drawer.Item>
                </Link>
              </Drawer.Content>
              <Drawer.Footer>
                <div className={styles.social}>
                  {community.map(({ name, href }) => (
                    <a key={name} href={href} target="_blank" rel="noreferrer">
                      <Icon name={name} />
                    </a>
                  ))}
                </div>
              </Drawer.Footer>
            </Drawer.Root>
          )}
        </>
      )}
    </div>
  );
}
