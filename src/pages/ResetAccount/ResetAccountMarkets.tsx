import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useGetMarketsByIdsQuery } from 'services/Polkamarkets';

import { formatMarketPositions } from 'pages/Portfolio/utils';

import { AlertMini } from 'components';

import { useAppSelector, useNetwork } from 'hooks';

import styles from './ResetAccount.module.scss';

type ResetAccountMarketsProps = {
  emptyDataDescription?: string;
  onChangeCanReset: (canReset: boolean) => void;
};

function ResetAccountMarkets({
  emptyDataDescription = 'No data to show.',
  onChangeCanReset
}: ResetAccountMarketsProps) {
  const { network } = useNetwork();

  // fetching all marketIds from portfolio positions with outcome shares
  const { portfolio, actions, marketsWithActions, isLoading } = useAppSelector(
    state => state.polkamarkets
  );

  const { actions: isLoadingActions } = isLoading;
  const { portfolio: isLoadingPortfolio } = isLoading;

  const { data, isLoading: isLoadingMarkets } = useGetMarketsByIdsQuery(
    {
      ids: marketsWithActions,
      networkId: network.id
    },
    {
      skip: isLoadingActions || isEmpty(marketsWithActions)
    }
  );

  const isEmptyData = isEmpty(data);
  const isLoadingData =
    isLoadingActions || isLoadingMarkets || isLoadingPortfolio;

  const marketPositions = useMemo(
    () => formatMarketPositions(portfolio, actions, data),
    [actions, data, portfolio]
  );

  // filtering positions that have already had an action
  const positions = marketPositions.rows.filter(position => {
    return !['lost', 'claimed', 'claimed_voided'].includes(
      position.result.type
    );
  });

  const markets = positions
    .map(position => position.market)
    .filter((v, i, a) => a.indexOf(v) === i);

  useEffect(() => {
    function checkIfCanReset() {
      const canReset = markets.length === 0;

      onChangeCanReset(canReset);
    }

    if (!isLoadingData) {
      checkIfCanReset();
    }
  }, [data, isLoadingData, markets, onChangeCanReset]);

  return (
    <div className="pm-c-leaderboard-stats bg-3 border-radius-medium border-solid border-1 width-full">
      <h2 className="body semibold text-1">Open Positions</h2>
      {isLoadingData ? (
        <div className="flex-row justify-center align-center width-full padding-y-6 padding-x-5 margin-bottom-6">
          <span className="spinner--primary" />
        </div>
      ) : null}
      {!isLoadingData && isEmptyData ? (
        <AlertMini
          style={{
            padding: '25px 16px 25px 16px',
            marginBottom: 24,
            border: 'none'
          }}
          styles="outline"
          variant="information"
          description={emptyDataDescription}
        />
      ) : null}
      {!isLoadingData && !isEmptyData ? (
        <ul className={styles.markets}>
          {markets?.map(market => (
            <li key={market.slug}>
              <Link className={styles.market} to={`/markets/${market.slug}`}>
                <img
                  className={styles.marketImage}
                  src={market.imageUrl}
                  alt={market.title}
                />
                <p
                  className={cn(
                    styles.marketTitle,
                    'caption semibold text-2 text-1-on-hover'
                  )}
                >
                  {market.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default ResetAccountMarkets;
