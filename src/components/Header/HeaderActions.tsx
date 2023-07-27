import { Fragment, useEffect } from 'react';

import cn from 'classnames';
import { ui } from 'config';
import { Container, useTheme } from 'ui';

import ConnectMetamask from 'components/ConnectMetamask';
import NetworkSelector from 'components/NetworkSelector';
import ThemeSelector from 'components/ThemeSelector';
import WalletInfo from 'components/WalletInfo';

import { useAppSelector, usePortal } from 'hooks';

import headerClasses from './Header.module.scss';
import headerActionsClasses from './HeaderActions.module.scss';

function HeaderActionsWrapper(props: React.PropsWithChildren<{}>) {
  const Portal = usePortal({
    root: document.body
  });

  useEffect(() => {
    Portal.mount(true);
  }, [Portal]);

  return <Portal {...props} />;
}
export default function HeaderActions() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const theme = useTheme();
  const { Root, Wrapper } = theme.device.isDesktop
    ? { Root: Fragment, Wrapper: 'div' }
    : { Root: HeaderActionsWrapper, Wrapper: Container };

  return (
    <Root>
      <Wrapper
        className={cn(headerActionsClasses.root, {
          [headerClasses.container]: !theme.device.isDesktop
        })}
      >
        {ui.layout.header.networkSelector.enabled && theme.device.isDesktop && (
          <NetworkSelector
            responsive
            className={headerActionsClasses.network}
          />
        )}
        {isLoggedIn ? <WalletInfo /> : <ConnectMetamask />}
        <ThemeSelector />
      </Wrapper>
    </Root>
  );
}
