import { useState } from 'react';

import type { Network } from 'types/network';
import { Banner } from 'ui';

type BetaTestingProps = {
  network: Network;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BetaTesting({ network }: BetaTestingProps) {
  // TODO: Turn content customizable through env
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Banner $type="warning" $variant="subtle" onHide={() => setShow(false)}>
      O sucesso do Previsómetro foi difícil de prever devido à elevada
      alfuência. Estamos de volta para todos os previsores.
    </Banner>
  );
}
