import { useState } from 'react';

import type { Network } from 'types/network';
import { Banner } from 'ui';

import Link from 'components/Link';

type BetaTestingProps = {
  network: Network;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BetaTesting({ network }: BetaTestingProps) {
  // TODO: Turn content customizable through env
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Banner $type="info" $variant="subtle" onHide={() => setShow(false)}>
      <Link
        variant="information"
        title="Votómetro Legislativas 2024"
        scale="caption"
        fontWeight="medium"
        href="https://observador.pt/interativo/votometro-legislativas-2024/"
        target="_blank"
      />
      : Responda e veja também os partidos mais próximos de si.
    </Banner>
  );
}
