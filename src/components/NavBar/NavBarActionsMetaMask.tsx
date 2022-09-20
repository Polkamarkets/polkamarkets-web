import { useCallback, useState } from 'react';

import { login } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';

import { MetaMaskIcon } from 'assets/icons';

import { Button } from 'components/Button';
import Modal from 'components/Modal';

import { useAppDispatch, useNetwork } from 'hooks';

import NavBarActionsMetamaskStatus from './NavBarActionsMetaMaskStatus';

export default function NavBarActionsMetamask() {
  const dispatch = useAppDispatch();
  const { networkConfig } = useNetwork();
  const polkamarketsService = new PolkamarketsService(networkConfig);
  const [show, setShow] = useState(false);
  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  function handleTryAgain() {
    window.location.reload();
  }
  function handleMetamaskModal() {
    setShow(true);
  }
  async function handleMetamaskLogin() {
    await polkamarketsService.login();
    dispatch(login(networkConfig));
  }

  return (
    <>
      <Modal show={show} onHide={handleHide} name="metamask-warning">
        <Modal.Header>
          <NavBarActionsMetamaskStatus />
          <Modal.HeaderTitle>
            Looks like your browser do not have Metamask installed.
          </Modal.HeaderTitle>
        </Modal.Header>
        <Modal.Section>
          <Modal.SectionText>
            Please follow up the instructions to install it, make sure your
            wallet is unlocked with at least one account on it and try again.
          </Modal.SectionText>
        </Modal.Section>
        <Modal.Footer>
          <Button
            fullwidth
            color="primary"
            variant="outline"
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
          <a
            href="https://metamask.io/download.html"
            rel="noopener noreferrer"
            target="_blank"
            className="pm-c-button-normal--primary pm-c-button--normal pm-c-button--fullwidth"
          >
            Install
          </a>
        </Modal.Footer>
      </Modal>
      <Button
        variant="outline"
        color="default"
        size="sm"
        onClick={!window.ethereum ? handleMetamaskModal : handleMetamaskLogin}
      >
        <MetaMaskIcon />
        Connect MetaMask
      </Button>
    </>
  );
}
