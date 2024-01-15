import { ObservadorLogo } from 'assets/icons';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalSection,
  ModalSectionText
} from 'components';

import styles from './Maintenance.module.scss';

export default function Maintenance() {
  return (
    <div className={styles.root}>
      <Modal
        show
        centered
        size="sm"
        className={{
          backdrop: styles.modalBackdrop
        }}
      >
        <ModalContent className={styles.content}>
          <ModalHeader>
            <ObservadorLogo className={styles.logo} />
          </ModalHeader>
          <ModalSection>
            <ModalSectionText>
              O Sucesso do Previsómetro foi difícil de prever.
            </ModalSectionText>
            <ModalSectionText>
              Avisaremos assim que puder voltar para continuar a dar VOZ às suas
              previsões.
            </ModalSectionText>
          </ModalSection>
        </ModalContent>
      </Modal>
    </div>
  );
}
