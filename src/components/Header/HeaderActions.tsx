import { Fragment, useEffect } from 'react';

import cn from 'classnames';
import { features, ui } from 'config';
import { AnimatePresence, motion } from 'framer-motion';
import { Container, Skeleton, useTheme } from 'ui';

import HelpButton from 'components/HelpButton';
import NetworkSelector from 'components/NetworkSelector';
import Profile from 'components/Profile';
import ThemeSelector from 'components/ThemeSelector';
import Wallet from 'components/Wallet';

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
function HeaderActionsGroup(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  return <div className={headerActionsClasses.actionsGroup} {...props} />;
}
function SkeletonWallet() {
  return <Skeleton style={{ height: 46, width: 192 }} />;
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
  const ActionLoadingComponent = features.fantasy.enabled
    ? SkeletonProfile
    : SkeletonWallet;
  const HeaderActionComponent = features.fantasy.enabled ? Profile : Wallet;
  const HeaderActionsGroupComponent = features.fantasy.enabled
    ? Fragment
    : HeaderActionsGroup;

  return (
    <Root>
      <HeaderActionsAnimate show={!features.fantasy.enabled || isLoggedIn}>
        <Wrapper
          className={cn(
            headerActionsClasses.root,
            headerActionsClasses.gutterActions,
            {
              [headerClasses.container]: !theme.device.isDesktop,
              [headerActionsClasses.reverse]: features.fantasy.enabled
            }
          )}
        >
          <HeaderActionsGroupComponent>
            {ui.layout.header.networkSelector.enabled &&
              theme.device.isDesktop && (
                <NetworkSelector
                  size="sm"
                  responsive
                  className={headerActionsClasses.network}
                />
              )}
            {isLoading ? (
              <ActionLoadingComponent />
            ) : (
              <HeaderActionComponent isLoggedIn={isLoggedIn} />
            )}
          </HeaderActionsGroupComponent>
          {!features.fantasy.enabled && <ThemeSelector />}
          {ui.layout.header.helpUrl && (
            <HelpButton
              className={cn({
                [headerActionsClasses.help]: features.fantasy.enabled
              })}
              href={ui.layout.header.helpUrl}
            />
          )}
        </Wrapper>
      </HeaderActionsAnimate>
    </Root>
  );
}
