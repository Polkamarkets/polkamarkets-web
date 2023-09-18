import { useCallback, useState } from 'react';

import { WarningOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import type { ButtonProps } from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderHide from 'components/ModalHeaderHide';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';
import Pill from 'components/Pill';

import { useAppDispatch, usePolkamarketsService } from 'hooks';

const connectMetamaskProps = {
  'aria-labelledby': 'connect-metamask-modal-name',
  'aria-describedby': 'connect-metamask-modal-description'
};

export default function ConnectMetamask({
  children = (
    <>
      <Icon name="MetaMask" size="lg" />
      Connect MetaMask
    </>
  ),
  ...props
}: ButtonProps) {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const [show, setShow] = useState(false);
  const handleMetamaskLogin = useCallback(async () => {
    const { login } = await import('redux/ducks/polkamarkets');

    await polkamarketsService.login();
    dispatch(login(polkamarketsService));
  }, [dispatch, polkamarketsService]);
  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  function handleTryAgain() {
    window.location.reload();
  }
  function handleMetamaskModal() {
    setShow(true);
  }

  return (
    <>
      <Modal
        show={show}
        centered
        size="sm"
        onHide={handleHide}
        {...connectMetamaskProps}
      >
        <ModalContent>
          <ModalHeader>
            <ModalHeaderHide onClick={handleHide} />
            <div className="pm-l-navbar__actions-metamask__status">
              <Icon name="MetaMask" size="lg" />
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
        {...props}
      >
        {children}
      </Button>
    </>
  );
}
