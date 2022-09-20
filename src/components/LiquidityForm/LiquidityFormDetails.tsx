import { roundNumber } from 'helpers/math';

import { InfoIcon } from 'assets/icons';

import { useAppSelector } from 'hooks';

import Text from '../Text';
import Tooltip from '../Tooltip';

function LiquidityFormDetails() {
  const currency = useAppSelector(state => state.market.market.currency);
  const liquidityDetails = useAppSelector(
    state => state.liquidity.liquidityDetails
  );
  const transactionType = useAppSelector(
    state => state.liquidity.transactionType
  );
  const market = useAppSelector(state => state.market.market);
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const feesEarned = portfolio[market.id]?.claimStatus.liquidityFees || 0;

  return (
    <div className="pm-c-liquidity-form__details">
      <div className="pm-c-liquidity-form__details-group">
        <div className="pm-c-liquidity-form__details-liquidity-value">
          <Text as="span" scale="caption" fontWeight="semibold">
            Liquidity Value
            <Tooltip
              text={
                transactionType === 'add'
                  ? 'Amount added to liquidity pool'
                  : "Amount you'll receive"
              }
              position="top"
            >
              <InfoIcon />
            </Tooltip>
          </Text>

          <Text as="span" scale="caption" fontWeight="semibold">
            {
              // eslint-disable-next-line prettier/prettier
              `${roundNumber(liquidityDetails.liquidityStake, 3)} ${
                currency.symbol
              }`
            }
          </Text>
        </div>
        <div className="pm-c-liquidity-form__details-shares-added">
          <Text as="span" scale="tiny" fontWeight="semibold">
            Est. Liquidity Shares
          </Text>

          <Text as="span" scale="tiny" fontWeight="semibold">
            {roundNumber(liquidityDetails.liquidityShares, 3)}
          </Text>
        </div>
      </div>

      {transactionType === 'remove' ? (
        <div className="pm-c-liquidity-form__details-group">
          <div className="pm-c-liquidity-form__details-liquidity-value">
            <Text as="span" scale="caption" fontWeight="semibold">
              Fees Earned
            </Text>

            <Text as="span" scale="caption" fontWeight="semibold">
              {
                // eslint-disable-next-line prettier/prettier
                `${roundNumber(feesEarned, 3)} ${currency.symbol}`
              }
            </Text>
          </div>
        </div>
      ) : null}

      {liquidityDetails.outcomeDetails.map(outcomeDetails => {
        const outcomeColorCondition =
          market?.outcomes[0] === outcomeDetails.outcome;

        return [
          <hr
            key={`outcome-hr-${outcomeDetails.outcome.id}`}
            className="pm-c-liquidity-form__details-separator"
          />,

          <div
            key={`outcome-title-${outcomeDetails.outcome.id}`}
            className="pm-c-liquidity-form__details-outcome"
          >
            <Text as="span" scale="caption" fontWeight="semibold">
              Outcome
            </Text>

            <Text as="span" scale="caption" fontWeight="semibold">
              <div
                className={`pm-c-liquidity-form__details-outcome-marker--${
                  outcomeColorCondition ? 'primary' : 'secondary'
                }`}
              />
              {outcomeDetails.outcome.title}
            </Text>
          </div>,

          <div
            key={`outcome-details-${outcomeDetails.outcome.id}`}
            className="pm-c-liquidity-form__details-group"
          >
            <div className="pm-c-liquidity-form__details-outcome-shares-value">
              <Text as="span" scale="caption" fontWeight="semibold">
                Outcome Shares Value
                <Tooltip
                  text="You are given outcome shares on uneven market prices"
                  position="top"
                >
                  <InfoIcon />
                </Tooltip>
              </Text>

              <Text as="span" scale="caption" fontWeight="semibold">
                {`${roundNumber(outcomeDetails.stake, 3)} ${currency.symbol}`}
              </Text>
            </div>

            <div className="pm-c-liquidity-form__details-shares-received">
              <Text as="span" scale="tiny" fontWeight="semibold">
                Est. Outcome Shares Received
              </Text>

              <Text as="span" scale="tiny" fontWeight="semibold">
                {roundNumber(outcomeDetails.shares, 3)}
              </Text>
            </div>
          </div>
        ];
      })}

      <hr className="pm-c-liquidity-form__details-separator" />

      <div className="pm-c-liquidity-form__details-total-stake">
        <Text as="span" scale="body" fontWeight="semibold">
          Total Stake
        </Text>

        <Text as="span" scale="body" fontWeight="semibold">
          {`${roundNumber(
            liquidityDetails.totalStake +
              (transactionType === 'remove' ? feesEarned : 0),
            3
          )} ${currency.symbol}`}
        </Text>
      </div>
    </div>
  );
}

LiquidityFormDetails.displayName = 'LiquidityFormDetails';

export default LiquidityFormDetails;
