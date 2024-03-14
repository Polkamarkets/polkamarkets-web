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
    <Banner $type="info" $variant="subtle" onHide={() => setShow(false)}>
      Os vencedores do Previsómetro serão anunciados e contactados quando todas
      as 20 perguntas estiverem resolvidas.
    </Banner>
  );
}
