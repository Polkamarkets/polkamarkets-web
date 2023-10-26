import { useCallback, useState } from 'react';

import { ui } from 'config';

import { PCLLogo } from 'assets/icons';

import { useFantasyTokenTicker } from 'hooks';

import { Button } from '../Button';
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
  const fantasyTokenTicker = useFantasyTokenTicker();
  const [show, setShow] = useState(true);

  const handleHide = useCallback(() => setShow(false), []);

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
          <Button
            size="sm"
            variant="normal"
            color="primary"
            fullwidth
            onClick={() => setShow(false)}
          >
            Declare bankruptcy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeclareBankruptcyModal;
