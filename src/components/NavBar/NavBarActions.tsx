import { useCallback, useState } from 'react';

import { Adornment, List, ListItem, ListItemText, Toggle } from 'ui';

import { Button } from 'components/Button';
import ConnectMetamask from 'components/ConnectMetamask';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import WalletInfo from 'components/WalletInfo';

import { useNetworks } from 'contexts/networks';

import { useAppSelector, useTheme } from 'hooks';

import NavbarClasses from './NavBar.module.scss';

export default function NavBarActions() {
  const theme = useTheme();
  const { network: currentNetwork, networks, changeToNetwork } = useNetworks();

  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  const [show, setShow] = useState(false);

  const handleHide = useCallback(() => setShow(false), []);

  const handleChangeNetwork = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleHide();
      changeToNetwork(event.target.value);
    },
    [changeToNetwork, handleHide]
  );

  const isThemeDark = theme.theme === 'dark';
  const themeAnti = isThemeDark ? 'light' : 'dark';

  function handleTheme() {
    theme.setTheme(themeAnti);
  }

  function handleNetworks() {
    setShow(true);
  }

  return (
    <>
      <div className="pm-l-layout__header__actions">
        {isLoggedIn ? <WalletInfo /> : <ConnectMetamask />}
        <Button
          variant="outline"
          color="default"
          aria-label="Switch theme"
          onClick={handleTheme}
        >
          <Icon name={isThemeDark ? 'Sun' : 'Moon'} />
        </Button>
        <Button
          variant="outline"
          color="default"
          aria-label="Switch chain"
          onClick={handleNetworks}
        >
          <Icon name={currentNetwork.currency.iconName} />
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleHide}
        className={{
          dialog: NavbarClasses.widget
        }}
      >
        <List $rounded>
          {networks.map(network => (
            <ListItem key={network.name}>
              <Adornment edge="start">
                <Icon name={network.currency.iconName} />
              </Adornment>
              <ListItemText>{network.name}</ListItemText>
              <Adornment edge="end">
                <Toggle
                  type="radio"
                  value={network.name}
                  checked={network.name === currentNetwork.name}
                  onChange={handleChangeNetwork}
                />
              </Adornment>
            </ListItem>
          ))}
        </List>
      </Modal>
    </>
  );
}
