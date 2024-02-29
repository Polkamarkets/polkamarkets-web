import { Fragment, useEffect } from 'react';

import cn from 'classnames';
import { ui } from 'config';
import { AnimatePresence, motion } from 'framer-motion';
import { Container, Skeleton, useTheme } from 'ui';

import HelpButton from 'components/HelpButton';
import HowToPlayButton from 'components/HowToPlayButton';
import Profile from 'components/Profile';
import ThemeSelector from 'components/ThemeSelector';

import { useAppSelector, usePortal } from 'hooks';

import headerClasses from './Header.module.scss';
import headerActionsClasses from './HeaderActions.module.scss';

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
  const theme = useTheme();

  return (
    <div
      style={{
        display: 'inherit',
        alignItems: 'center',
        gap: 24,
        ...(!theme.device.isDesktop && {
          flexDirection: 'row-reverse',
          width: '100%'
        })
      }}
    >
      <Skeleton
        style={{
          height: 32,
          width: 96,
          ...(!theme.device.isDesktop && {
            marginLeft: 'auto'
          })
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
        <div>
          <Skeleton style={{ height: 16, width: 84, marginBottom: 4 }} />
          <Skeleton style={{ height: 16, width: 52 }} />
        </div>
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
  const Wrapper = theme.device.isDesktop ? 'div' : Container;

  return (
    <Root>
      <HeaderActionsAnimate show={isLoggedIn}>
        <Wrapper
          className={cn(
            headerActionsClasses.root,
            headerActionsClasses.gutterActions,
            headerActionsClasses.reverse,
            {
              [headerClasses.container]: !theme.device.isDesktop
            }
          )}
        >
          {isLoading ? (
            <SkeletonProfile />
          ) : (
            <Profile isLoggedIn={isLoggedIn} />
          )}
          <ThemeSelector />
          {ui.layout.header.helpUrl && (
            <HelpButton
              className={cn(headerActionsClasses.help)}
              href={ui.layout.header.helpUrl}
            />
          )}
          {ui.layout.onboarding.steps && (
            <HowToPlayButton className={cn(headerActionsClasses.howToPlay)} />
          )}
        </Wrapper>
      </HeaderActionsAnimate>
    </Root>
  );
}
