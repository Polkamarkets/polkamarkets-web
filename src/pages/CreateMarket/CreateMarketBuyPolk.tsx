import { useState } from 'react';

import { TwarningIcon } from 'assets/icons';

import { Text, ProgressBar, Button } from 'components';

import { useAppSelector, useNetwork } from 'hooks';

type CreateMarketBuyPolkProps = {
  requiredGovernanceBalance: number;
};

function CreateMarketBuyPolk({
  requiredGovernanceBalance
}: CreateMarketBuyPolkProps) {
  const [isLoadingBuyPolk, setIsLoadingBuyPolk] = useState(false);

  const governanceBalance = useAppSelector(
    state => state.bepro.governanceBalance
  );

  const { buyEc20Url } = useNetwork();

  async function handleBuyPolk() {
    setIsLoadingBuyPolk(true);

    window.open(buyEc20Url, '_blank');

    setIsLoadingBuyPolk(false);
  }

  return (
    <div className="pm-p-create-market-buy-polk">
      <div className="pm-p-create-market-buy-polk__group--column">
        <TwarningIcon className="pm-p-create-market-buy-polk__icon" />
        <Text
          as="p"
          scale="body"
          fontWeight="semibold"
          className="pm-p-create-market-buy-polk__title"
        >
          <>
            {`You need an additional `}
            <Text
              as="strong"
              scale="body"
              fontWeight="semibold"
              className="pm-p-create-market-buy-polk__amount"
            >
              {`${requiredGovernanceBalance - governanceBalance} POLK`}
            </Text>
            {` to create markets.`}
          </>
        </Text>
      </div>
      <ProgressBar
        min={0}
        max={requiredGovernanceBalance}
        percent={(governanceBalance / requiredGovernanceBalance) * 100}
        color="warning"
      />
      <Button
        size="sm"
        color="warning"
        fullwidth
        onClick={handleBuyPolk}
        loading={isLoadingBuyPolk}
      >
        Buy $POLK
      </Button>
    </div>
  );
}

export default CreateMarketBuyPolk;
