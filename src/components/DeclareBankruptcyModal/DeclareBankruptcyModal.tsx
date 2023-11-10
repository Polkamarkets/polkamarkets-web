import { useCallback, useState } from 'react';

import { ui } from 'config';
import { fetchAditionalData, login } from 'redux/ducks/polkamarkets';

import { PCLLogo } from 'assets/icons';

import {
  useAppDispatch,
  useAppSelector,
  useFantasyTokenTicker,
  usePolkamarketsService
} from 'hooks';

import { ButtonLoading } from '../Button';
import Link from '../Link';
import Modal from '../Modal';
import ModalContent from '../ModalContent';
import ModalFooter from '../ModalFooter';
import ModalHeader from '../ModalHeader';
import ModalHeaderHide from '../ModalHeaderHide';
import ModalSection from '../ModalSection';
import ModalSectionText from '../ModalSectionText';
import Text from '../Text';
import styles from './DeclareBankruptcyModal.module.scss';

const BANKRUPTCY = 200;

function DeclareBankruptcyModal() {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const fantasyTokenTicker = useFantasyTokenTicker();

  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingLogin = useAppSelector(
    state => state.polkamarkets.isLoading.login
  );

  const handleHide = useCallback(() => setShow(false), []);

  const updateWallet = useCallback(async () => {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }, [dispatch, polkamarketsService]);

  const handleDeclare = useCallback(async () => {
    setIsLoading(true);

    try {
      // await polkamarketsService.declareBankruptcy();
      await updateWallet();
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      handleHide();
    }
  }, [handleHide, updateWallet]);

  if (!fantasyTokenTicker) return null;

  return (
    <Modal show={show} centered size="sm">
      <ModalContent className={styles.content}>
        <ModalHeader>
          <ModalHeaderHide onClick={handleHide} />
          <PCLLogo />
          <Text
            as="h5"
            scale="heading"
            fontWeight="bold"
            className={styles.contentTitle}
          >
            Declare bankruptcy
          </Text>
        </ModalHeader>
        <ModalSection>
          <ModalSectionText>
            {`You ran out of ${fantasyTokenTicker}. Declare bankruptcy and
            receive an extra ${BANKRUPTCY} ${fantasyTokenTicker} to restart your
            game.`}
            {ui.layout.bankruptcy.helpUrl ? (
              <>
                {' '}
                <Link
                  variant="information"
                  title="Know more"
                  scale="caption"
                  fontWeight="medium"
                  href={ui.layout.bankruptcy.helpUrl}
                  target="_blank"
                />
              </>
            ) : null}
          </ModalSectionText>
        </ModalSection>
        <ModalFooter>
          <ButtonLoading
            size="sm"
            variant="normal"
            color="primary"
            fullwidth
            loading={isLoading || isLoadingLogin}
            onClick={handleDeclare}
          >
            Declare bankruptcy
          </ButtonLoading>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeclareBankruptcyModal;
