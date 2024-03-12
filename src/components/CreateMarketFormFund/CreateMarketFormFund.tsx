/* eslint-disable jsx-a11y/label-has-associated-control */

import CreateMarketFormFundClasses from './CreateMarketFormFund.module.scss';
import MarketPreview from './MarketPreview';

function CreateMarketFormFund() {
  return (
    <>
      <div className={CreateMarketFormFundClasses.root}>
        {/* <div className="pm-c-create-market-form__card-liquidity-details">
          <div
            className={cn(
              'pm-c-create-market-form__card-liquidity-details__earn-trading-fee',
              CreateMarketFormFundClasses.fee
            )}
          >
            <Text
              as="span"
              scale="caption"
              fontWeight="semibold"
              className="pm-c-create-market-form__card-liquidity-details__earn-trading-fee__title"
            >
              Trading Fee Earnings
              <Tooltip
                text="Fee given to liquidity providers on every buy/sell transaction"
                position="top"
              >
                <InfoIcon />
              </Tooltip>
            </Text>
            <NumberInput name="fee" min={0} max={5} />
          </div>
          <hr className="pm-c-create-market-form__card-liquidity-details__separator" />
          <div
            className={cn(
              'pm-c-create-market-form__card-liquidity-details__earn-trading-fee',
              CreateMarketFormFundClasses.fee
            )}
          >
            <Text
              as="span"
              scale="caption"
              fontWeight="semibold"
              className="pm-c-create-market-form__card-liquidity-details__earn-trading-fee__title"
            >
              Creator Fee Earnings
              <Tooltip
                text="Fee given to market creators on every buy/sell transaction"
                position="top"
              >
                <InfoIcon />
              </Tooltip>
            </Text>
            <NumberInput name="treasuryFee" min={0} max={5} />
          </div>
        </div> */}
      </div>
      <div className={CreateMarketFormFundClasses.append}>
        <h4 className={CreateMarketFormFundClasses.appendTitle}>
          Great! Your market is almost ready. Please review the details of your
          forecasting market below and confirm its accuracy before submitting.
        </h4>
        <MarketPreview />
      </div>
    </>
  );
}

export default CreateMarketFormFund;
