import ConnectMetamask from 'components/ConnectMetamask';
import WalletInfo from 'components/WalletInfo';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Wallet({ isLoggedIn }: ProfileProps) {
  if (isLoggedIn) return <WalletInfo />;
  return <ConnectMetamask />;
}
