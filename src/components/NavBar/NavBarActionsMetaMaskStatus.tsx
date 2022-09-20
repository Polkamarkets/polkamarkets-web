import { MetaMaskIcon, WarningOutlinedIcon } from 'assets/icons';

import Pill from 'components/Pill';

export default function NavBarActionsMetamaskStatus() {
  return (
    <div className="pm-l-navbar__actions-metamask__status">
      <MetaMaskIcon size={40} />
      <Pill variant="normal" color="danger">
        <WarningOutlinedIcon />
      </Pill>
    </div>
  );
}
