import { useCallback, useState } from 'react';

import { Adornment, List, ListItem, ListItemText, Toggle } from 'ui';

import { Button } from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';

import { useNetworks } from 'contexts/networks';

import NavbarClasses from './NavBar.module.scss';

export default function NavBarActionsNetwork() {
  const { network: currentNetwork, networks, changeToNetwork } = useNetworks();
  const [show, setShow] = useState(false);
  const handleHide = useCallback(() => setShow(false), []);
  const handleChangeNetwork = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [network] = networks.filter(
        ({ name }) => name === event.target.value
      );

      handleHide();
      changeToNetwork(network);
    },
    [changeToNetwork, handleHide, networks]
  );

  function handleNetworks() {
    setShow(true);
  }

  return (
    <>
      <Button
        variant="outline"
        color="default"
        aria-label="Switch chain"
        onClick={handleNetworks}
      >
        <Icon name={currentNetwork.currency.iconName} />
      </Button>
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
