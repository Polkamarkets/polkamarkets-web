import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import { features, ui } from 'config';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton, useTheme } from 'ui';

import { Button, Icon } from 'components';
import Profile from 'components/Header/Profile';
import TransactionsButton from 'components/Header/TransactionsButton';
import NetworkSelector from 'components/NetworkSelector';

import { useAppSelector, usePortal } from 'hooks';

import styles from './HeaderActions.module.scss';

function HeaderActionsWrapper(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  const Portal = usePortal({
    root: document.body
  });

  useEffect(() => {
    Portal.mount(true);
  }, [Portal]);

  return <Portal {...props} />;
}

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
function HeaderActionsAnimate({
  children,
  show
}: React.PropsWithChildren<{ show: boolean }>) {
  const theme = useTheme();

  if (!theme.device.isDesktop)
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{
              y: 60
            }}
            animate={{
              y: 0
            }}
            exit={{
              y: 60
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );

  return <>{children}</>;
}
export default function HeaderActions() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const isLoading = useAppSelector(state => state.polkamarkets.isLoading.login);
  const theme = useTheme();
  const Root = theme.device.isDesktop ? Fragment : HeaderActionsWrapper;

  return (
    <Root>
      <HeaderActionsAnimate show={!features.fantasy.enabled || isLoggedIn}>
        <div className={cn(styles.root)}>
          {isLoading ? (
            <SkeletonProfile />
          ) : (
            <>
              {isLoggedIn && (
                <>
                  <Link to="/markets/create" aria-label="Create Market">
                    <Button variant="ghost" className={styles.createButton}>
                      <Icon name="PlusRectangular" size="lg" />
                    </Button>
                  </Link>
                  {ui.layout.transactionsQueue && <TransactionsButton />}
                  {ui.layout.header.networkSelector.enabled &&
                    theme.device.isDesktop && (
                      <NetworkSelector
                        size="sm"
                        responsive
                        className={styles.network}
                      />
                    )}
                </>
              )}
              <Profile isLoggedIn={isLoggedIn} />
            </>
          )}
        </div>
      </HeaderActionsAnimate>
    </Root>
  );
}
