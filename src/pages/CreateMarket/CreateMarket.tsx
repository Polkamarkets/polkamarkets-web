import { useEffect, useState } from 'react';

import { PolkamarketsService } from 'services';

import { Text, CreateMarketForm } from 'components';

import { useAppSelector, useNetwork } from 'hooks';

import CreateMarketBuyPolk from './CreateMarketBuyPolk';

function CreateMarket() {
  const { networkConfig } = useNetwork();
  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);
  const [requiredBalance, setRequiredBalance] = useState(0);

  const needsBuyPolk = polkBalance < requiredBalance;

  useEffect(() => {
    (async function getMinimumRequiredBalance() {
      const polkamarketsService = new PolkamarketsService(networkConfig);

      const response = await polkamarketsService.getMinimumRequiredBalance();
      setRequiredBalance(response);
    })();
  }, [polkBalance, networkConfig]);

  return (
    <div className="pm-p-create-market">
      <div className="pm-p-create-market__header">
        <Text
          as="h4"
          scale="heading"
          fontWeight="semibold"
          className="pm-p-create-market__header-title"
        >
          Create New Market
        </Text>
      </div>
      <div className="pm-p-create-market__notification-wrapper">
        {needsBuyPolk ? (
          <div className="pm-p-create-market__notification-overlay">
            <CreateMarketBuyPolk requiredPolkBalance={requiredBalance} />
          </div>
        ) : null}
        <CreateMarketForm />
      </div>
    </div>
  );
}

export default CreateMarket;
