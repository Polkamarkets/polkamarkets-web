/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { useField } from 'formik';
import { roundDown, roundNumber } from 'helpers/math';
import { Token } from 'types/token';

import { InfoIcon } from 'assets/icons';

import { useAppSelector, useNetwork, useERC20Balance } from 'hooks';

import Icon from '../Icon';
import NetworkSelector from '../NetworkSelector';
import NumberInput from '../NumberInput';
import SelectTokenModal from '../SelectTokenModal';
import Text from '../Text';
import Tooltip from '../Tooltip';
import AmountInput from './AmountInput';
import CreateMarketFormFundClasses from './CreateMarketFormFund.module.scss';
import MarketPreview from './MarketPreview';

function CreateMarketFormFund() {
  const network = useNetwork();
  const { ethBalance, createMarketToken } = useAppSelector(
    state => state.polkamarkets
  );
  const [field] = useField('liquidity');

  let erc20Address = '';

  if (createMarketToken && (createMarketToken as Token).addresses) {
    erc20Address = (createMarketToken as Token).addresses[network.network.key];
  }

  const { balance: erc20Balance } = useERC20Balance(erc20Address);

  const balance = erc20Address ? erc20Balance : ethBalance;
  const currency = createMarketToken || network.network.currency;

  return (
    <>
      <div className={CreateMarketFormFundClasses.root}>
        <div className={CreateMarketFormFundClasses.networkSelector}>
          <div className="pm-c-input__group width-full">
            <label
              htmlFor="network"
              className={cn(
                'pm-c-input__label--default',
                'pm-c-input__label--required'
              )}
            >
              Network (Chain)
            </label>
            <NetworkSelector $size="sm" />
          </div>
          <div className="pm-c-input__group width-full">
            <label
              htmlFor="token"
              className={cn(
                'pm-c-input__label--default',
                'pm-c-input__label--required'
              )}
            >
              Token
            </label>
            <SelectTokenModal network={network.network} />
          </div>
        </div>
        <div className="pm-c-input__group">
          <label
            htmlFor="liquidity"
            className={cn(
              'pm-c-input__label--default',
              'pm-c-input__label--required'
            )}
          >
            Add Liquidity
          </label>
          <div role="alert" className={CreateMarketFormFundClasses.alert}>
            <Icon
              name="Warning"
              size="md"
              className={CreateMarketFormFundClasses.alertIcon}
            />
            <div className={CreateMarketFormFundClasses.alertBody}>
              <h3 className={CreateMarketFormFundClasses.alertTitle}>
                Attention needed
              </h3>
              <p className={CreateMarketFormFundClasses.alertDescription}>
                Providing liquidity is risky and could result in near total
                loss. It is important to withdraw liquidity before the event
                occurs and to be aware the market could move abruptly at any
                time.
              </p>
              <a
                href="//help.polkamarkets.com/en/articles/6153227-strategies-and-risks-for-liquidity-providers"
                aria-label="More Info"
                target="_blank"
                rel="noreferrer"
                className={CreateMarketFormFundClasses.alertAction}
              >
                More info
                <Icon
                  name="Arrow"
                  dir="right"
                  style={{ marginLeft: 'var(--size-4)' }}
                />
              </a>
            </div>
          </div>
        </div>
        <AmountInput
          label="Wallet"
          max={roundDown(balance)}
          currency={currency}
        />
        <div className="pm-c-create-market-form__card-liquidity-details">
          <div className="pm-c-create-market-form__card-liquidity-details__group">
            <div className="pm-c-create-market-form__card-liquidity-details__liquidity-value">
              <Text
                as="span"
                scale="caption"
                fontWeight="semibold"
                className="pm-c-create-market-form__card-liquidity-details__liquidity-value__title"
              >
                Liquidity Value
                <Tooltip text="Amount added to liquidity pool" position="top">
                  <InfoIcon />
                </Tooltip>
              </Text>
              <Text
                as="span"
                scale="caption"
                fontWeight="semibold"
                className="pm-c-create-market-form__card-liquidity-details__liquidity-value__amount"
              >
                {`${roundNumber(field.value, 3)} ${currency.symbol}`}
              </Text>
            </div>
            <div className="pm-c-create-market-form__card-liquidity-details__shares-added">
              <Text
                as="span"
                scale="tiny"
                fontWeight="semibold"
                className="pm-c-create-market-form__card-liquidity-details__shares-added__title"
              >
                Est. Liquidity Shares Added
              </Text>

              <Text
                as="span"
                scale="tiny"
                fontWeight="semibold"
                className="pm-c-create-market-form__card-liquidity-details__shares-added__amount"
              >
                {roundNumber(field.value, 3)}
              </Text>
            </div>
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
        </div>
      </div>
      <div className={CreateMarketFormFundClasses.append}>
        <h4 className={CreateMarketFormFundClasses.appendTitle}>
          Great! Your market is almost ready. Please review the details of your
          forecasting market below and confirm its accuracy before submitting.
        </h4>
        <MarketPreview token={currency} />
      </div>
    </>
  );
}

export default CreateMarketFormFund;
