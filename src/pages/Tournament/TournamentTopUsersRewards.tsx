import { useCallback, useState } from 'react';

import Divider from 'ui/Divider';

import {
  ModalHeader,
  ModalHeaderHide,
  ModalHeaderTitle,
  ModalSection
} from 'components';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';

import tournamentTopUsersClasses from './TournamentTopUsers.module.scss';
import tournamentTopUsersRewardsClasses from './TournamentTopUsersRewards.module.scss';

export default function TournamentTopUsersRewards({
  children
}: React.PropsWithChildren<{}>) {
  const [show, setShow] = useState(false);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);
  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <>
      <button
        type="button"
        className={tournamentTopUsersClasses.action}
        onClick={handleShow}
      >
        View Rewards
        <Icon
          name="Arrow"
          size="md"
          dir="right"
          className={tournamentTopUsersClasses.actionIcon}
        />
      </button>
      <Modal size="sm" centered show={show} onHide={handleHide}>
        <ModalContent className={tournamentTopUsersRewardsClasses.content}>
          <ModalHeader className={tournamentTopUsersRewardsClasses.header}>
            <ModalHeaderTitle>Rewards</ModalHeaderTitle>
            <ModalHeaderHide $disableInset onClick={handleHide} />
          </ModalHeader>
          <Divider />
          <ModalSection className={tournamentTopUsersRewardsClasses.section}>
            {children}
          </ModalSection>
        </ModalContent>
      </Modal>
    </>
  );
}
