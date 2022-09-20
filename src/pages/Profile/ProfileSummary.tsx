import { fromTimestampToCustomFormatDate } from 'helpers/date';
import { roundNumber } from 'helpers/math';
import { useGetPortfolioByAddressQuery } from 'services/Polkamarkets';

import { ShareIcon } from 'assets/icons';

import { Tooltip } from 'components';
import { Text } from 'components/new';

import { useNetwork } from 'hooks';

import ProfileSummaryStat from './ProfileSummaryStat';

type ProfileSummaryProps = {
  address: string;
};

function ProfileSummary({ address }: ProfileSummaryProps) {
  const { network } = useNetwork();
  const { currency } = network;

  const { data: portfolio, isLoading } = useGetPortfolioByAddressQuery({
    address,
    networkId: network.id
  });

  const ticker = currency.symbol || currency.ticker;

  if (isLoading || !portfolio) return null;

  const addressStart = address.substring(0, address.length - 6);
  const addressEnd = address.substring(address.length - 6, address.length);

  const firstPredictionAt = portfolio.firstPositionAt
    ? fromTimestampToCustomFormatDate(
        portfolio.firstPositionAt * 1000,
        'MMMM DD, YYYY'
      )
    : null;

  const totalPredictions = portfolio.totalPositions;

  const totalEarnings = `${roundNumber(
    portfolio.closedMarketsProfit,
    3
  )} ${ticker}`;

  const liquidityProvided = `${roundNumber(
    portfolio.liquidityProvided,
    3
  )} ${ticker}`;

  const wonPredictions = `${portfolio.wonPositions}`;

  return (
    <div className="pm-p-profile-summary">
      <div className="pm-p-profile-summary__details">
        <div className="pm-p-profile-summary__address-group">
          <Text
            className="pm-p-profile-summary__address--start"
            as="span"
            fontSize="heading-2"
            fontWeight="bold"
            color="1"
          >
            {addressStart}
          </Text>
          <Text
            className="pm-p-profile-summary__address--end"
            as="span"
            fontSize="heading-2"
            fontWeight="bold"
            color="1"
          >
            {addressEnd}
          </Text>
          <Tooltip position="bottom-start" text="View on Explorer">
            <a
              target="_blank"
              href={`${network.explorerURL}/address/${address}`}
              rel="noreferrer"
            >
              <ShareIcon className="pm-p-profile-summary__explorer-icon" />
            </a>
          </Tooltip>
        </div>
        <div className="pm-p-profile-summary__history">
          {firstPredictionAt ? (
            <>
              <Text
                as="span"
                fontSize="body-4"
                fontWeight="semibold"
                color="3"
                transform="uppercase"
              >
                {`First prediction: `}
                <Text
                  as="strong"
                  fontSize="body-4"
                  fontWeight="semibold"
                  color="2"
                  transform="uppercase"
                >
                  {firstPredictionAt}
                </Text>
              </Text>
              <span className="pm-c-divider--circle" />
            </>
          ) : null}
          <Text
            as="span"
            fontSize="body-4"
            fontWeight="semibold"
            color="3"
            transform="uppercase"
          >
            {`Total predictions: `}
            <Text
              as="strong"
              fontSize="body-4"
              fontWeight="semibold"
              color="2"
              transform="uppercase"
            >
              {totalPredictions}
            </Text>
          </Text>
        </div>
      </div>
      <div className="pm-p-profile-summary__stats">
        <ProfileSummaryStat
          title="Total earnings"
          value={totalEarnings}
          backgroundColor="yellow"
        />
        <ProfileSummaryStat
          title="Liquidity provided"
          value={liquidityProvided}
          backgroundColor="pink"
        />
        <ProfileSummaryStat
          title="Won predictions"
          value={wonPredictions}
          backgroundColor="orange"
        />
      </div>
    </div>
  );
}

export default ProfileSummary;
