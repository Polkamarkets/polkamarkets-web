import { useCallback, useState } from 'react';

import { login } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';

import { MetaMaskIcon, WarningOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderHide from 'components/ModalHeaderHide';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';
import Pill from 'components/Pill';

import { useAppDispatch, useNetwork } from 'hooks';

import { connectMetamaskProps } from './ConnectMetamask.util';

export default function ConnectMetamask() {
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
      <Modal
        show={show}
        backdrop
        centered
        size="sm"
        onHide={handleHide}
        {...connectMetamaskProps}
      >
        <ModalContent>
          <ModalHeader>
            <ModalHeaderHide onClick={handleHide} />
            <div className="pm-l-navbar__actions-metamask__status">
              <MetaMaskIcon size={40} />
              <Pill variant="normal" color="danger">
                <WarningOutlinedIcon />
              </Pill>
            </div>
            <ModalHeaderTitle id={connectMetamaskProps['aria-labelledby']}>
              Looks like your browser do not have Metamask installed.
            </ModalHeaderTitle>
          </ModalHeader>
          <ModalSection>
            <ModalSectionText id={connectMetamaskProps['aria-describedby']}>
              Please follow up the instructions to install it, make sure your
              wallet is unlocked with at least one account on it and try again.
            </ModalSectionText>
          </ModalSection>
          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
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
