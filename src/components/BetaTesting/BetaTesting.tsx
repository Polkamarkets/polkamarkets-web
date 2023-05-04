import { useState } from 'react';

import type { Network } from 'types/network';
import { Banner } from 'ui';

import { Link } from 'components';

import betaTesting from './BetaTesting.module.scss';

type BetaTestingProps = {
  network: Network;
};

export default function BetaTesting({ network }: BetaTestingProps) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Banner $type="info" $variant="subtle" onHide={() => setShow(false)}>
      Welcome to Polkamarkets! You&apos;re on <strong>{network.name}</strong>{' '}
      and placing predictions with <strong>{network.currency.ticker}</strong>.
      Your{' '}
      <Link
        className={betaTesting.link}
        title="feedback"
        target="_blank"
        rel="noreferrer noopener"
        href="//discord.gg/Szjn2EEf7w"
      />{' '}
      is highly appreciated! 🎉
    </Banner>
  );
}
