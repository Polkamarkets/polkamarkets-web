import ConnectMetamask from 'components/ConnectMetamask';
import WalletInfo from 'components/WalletInfo';

import { useAppSelector } from 'hooks';

export default function NavBarActionsInfo() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  return isLoggedIn ? <WalletInfo /> : <ConnectMetamask />;
}
