import { useState } from 'react';

import type { Network } from 'types/network';
import { Banner } from 'ui';

import { Link } from 'components';

import betaTesting from './BetaTesting.module.scss';

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
      Aviso: devido ao elevado tráfego de jogadores, a compra e venda de
      previsões pode estar mais lenta.
    </Banner>
  );
}
