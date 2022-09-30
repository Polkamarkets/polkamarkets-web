import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TwarningIcon } from 'assets/icons';

import { Button } from 'components/Button';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import Modal from 'components/Modal';
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
    <Modal show={show} {...betaWarningProps}>
      <ModalHeader>
        <ModalHeaderTitle
          className="pm-c-beta-warning__header-title"
          scale="tiny-uppercase"
          fontWeight="semibold"
          id={betaWarningProps['aria-labelledby']}
        >
          <TwarningIcon
            className="pm-c-beta-warning__header-title__adornment"
            size={16}
          />
          Warning
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalSection>
        <ModalSectionText>
          Polkamarkets Protocol is a 100% decentralized protocol for
          informational and educational purposes only. POLKAMARKET OÜ does not
          take any custody, profits or host over any markets.
        </ModalSectionText>
        <ModalSectionText>
          POLKAMARKET OÜ displays existing markets live on EVMs or sidechains
          and is a graphical user interface for visualizing data and interacting
          with the Polkamarkets Protocol Smart Contracts via your Web 3 injected
          wallet.
        </ModalSectionText>
        <ModalSectionText id={betaWarningProps['aria-describedby']}>
          By entering the website I confirm I am not a citizen or resident in
          the United States or its territories, nor a US person.
        </ModalSectionText>
        <Checkbox label="text" onChange={handleAgreed}>
          <Text as="p" scale="caption" fontWeight="medium">
            <>
              {`I Agree to the `}
              <Link
                title="Terms & Service"
                scale="caption"
                fontWeight="medium"
                href="https://www.polkamarkets.com/legal/terms-conditions"
                target="_blank"
              />
              {` & I am aware of the `}
              <Link
                title="Risks & Disclosure"
                scale="caption"
                fontWeight="medium"
                href="https://docs.google.com/document/d/1TR8HYTBOhZeZOb0E5uAo8lbK4v0Oxv3JnQD_AdYENBY/edit"
                target="_blank"
              />
            </>
            .
          </Text>
        </Checkbox>
      </ModalSection>
      <ModalFooter>
        <Button
          variant="normal"
          color="warning"
          fullwidth
          disabled={!agreed}
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </ModalFooter>
    </Modal>
  );
}
