import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TwarningIcon } from 'assets/icons';

import { Button } from 'components/Button';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import Modal from 'components/Modal';
import Text from 'components/Text';

import { useCookie } from 'hooks';

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
    setBetaWarningCookie(show.toString());
  }, [setBetaWarningCookie, show]);

  function handleAgreed() {
    setAgreed(prevAgreed => !prevAgreed);
  }
  function handleProceed() {
    setShow(false);
  }

  return (
    <Modal show={show} name="beta-warning">
      <Modal.Header>
        <Modal.HeaderTitle
          className="pm-c-beta-warning__header-title"
          scale="tiny-uppercase"
          fontWeight="semibold"
        >
          <TwarningIcon
            className="pm-c-beta-warning__header-title__adornment"
            size={16}
          />
          Warning
        </Modal.HeaderTitle>
      </Modal.Header>
      <Modal.Section>
        <Modal.SectionText>
          Polkamarkets Protocol is a 100% decentralized protocol for
          informational and educational purposes only. POLKAMARKET OÜ does not
          take any custody, profits or host over any markets.
        </Modal.SectionText>
        <Modal.SectionText>
          POLKAMARKET OÜ displays existing markets live on EVMs or sidechains
          and is a graphical user interface for visualizing data and interacting
          with the Polkamarkets Protocol Smart Contracts via your Web 3 injected
          wallet.
        </Modal.SectionText>
        <Modal.SectionText>
          By entering the website I confirm I am not a citizen or resident in
          the United States or its territories, nor a US person.
        </Modal.SectionText>
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
      </Modal.Section>
      <Modal.Footer>
        <Button
          variant="normal"
          color="warning"
          fullwidth
          disabled={!agreed}
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
