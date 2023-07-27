import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from 'ui/Button';

import Checkbox from 'components/Checkbox';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';
import Text from 'components/Text';

import { useCookie } from 'hooks';

import { betaWarningProps } from './BetaWarning.util';

export default function BetaWarning() {
  const location = useLocation();
  const hasParam = new URLSearchParams(location.search).get('m');
  const [betaWarningCookie, setBetaWarningCookie] = useCookie(
    'betaWarning',
    'true'
  );
  const [agreed, setAgreed] = useState(false);
  const [show, setShow] = useState(
    hasParam !== 'f' || betaWarningCookie === 'true'
  );

  useEffect(() => {
    setBetaWarningCookie(show?.toString());
  }, [setBetaWarningCookie, show]);
  function handleAgreed() {
    setAgreed(prevAgreed => !prevAgreed);
  }
  function handleProceed() {
    setShow(false);
  }

  return (
    <Modal show={show} centered size="sm" {...betaWarningProps}>
      <ModalContent>
        <ModalHeader>
          <ModalHeaderTitle
            className="pm-c-beta-warning__header-title"
            scale="tiny-uppercase"
            fontWeight="semibold"
            id={betaWarningProps['aria-labelledby']}
          >
            <Icon
              size="lg"
              name="Warning"
              className="pm-c-beta-warning__header-title__adornment"
            />
            Warning
          </ModalHeaderTitle>
        </ModalHeader>
        <ModalSection>
          <ModalSectionText>
            Polkamarkets Protocol is a 100% autonomous protocol running on
            publicly accessible blockchains. This website is a graphical user
            interface for visualizing data from, and interacting with, the
            Polkamarkets Protocol Smart Contracts on EVMs or sidechains, via
            your Web 3 injected wallet.
          </ModalSectionText>
          <ModalSectionText>
            POLKAMARKET OÜ does not host any markets, nor takes custody of
            funds, nor charges fees, nor profits from trades.
          </ModalSectionText>
          <ModalSectionText id={betaWarningProps['aria-describedby']}>
            By entering the website I confirm I am not a citizen or resident in
            the United States or its territories, nor a US person.
          </ModalSectionText>
          <Checkbox label="text" onChange={handleAgreed}>
            <Text as="span" scale="caption" fontWeight="medium">
              I Agree to the Terms & Conditions and I understand the Risk
              Disclosure.
            </Text>
          </Checkbox>
        </ModalSection>
        <ModalFooter className="pm-c-beta-warning__footer">
          <Button
            $size="md"
            $variant="fill"
            $color="warn"
            $fill
            disabled={!agreed}
            onClick={handleProceed}
          >
            Proceed
          </Button>
          <Text as="p" color="gray">
            <Link
              title="Terms & Conditions"
              scale="caption"
              fontWeight="medium"
              href="https://www.polkamarkets.com/legal/terms-conditions"
              target="_blank"
            />
            {' • '}
            <Link
              title="Risk Disclosure"
              scale="caption"
              fontWeight="medium"
              href="https://docs.google.com/document/d/1TR8HYTBOhZeZOb0E5uAo8lbK4v0Oxv3JnQD_AdYENBY/edit"
              target="_blank"
            />
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
