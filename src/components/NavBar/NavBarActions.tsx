import cn from 'classnames';

import ConnectMetamask from 'components/ConnectMetamask';
import WalletInfo from 'components/WalletInfo';

import { useAppSelector } from 'hooks';

import NavBarClasses from './NavBar.module.scss';

export default function NavBarActions({
  children,
  isDesktop
}: React.PropsWithChildren<{ isDesktop: boolean }>) {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  return (
    <div className={cn('pm-l-layout__header__actions', NavBarClasses.actions)}>
      {isDesktop && (isLoggedIn ? <WalletInfo /> : <ConnectMetamask />)}
      {children}
    </div>
  );
}
