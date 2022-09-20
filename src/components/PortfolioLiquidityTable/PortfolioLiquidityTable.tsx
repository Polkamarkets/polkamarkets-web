/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';
import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';

import { CaretDownIcon, CaretUpIcon } from 'assets/icons';

import {
  useAppDispatch,
  useAppSelector,
  useNetwork,
  useSortableData
} from 'hooks';

import { AlertMini } from '../Alert';
import { Button } from '../Button';
import Pill from '../Pill';
import Text from '../Text';

type MarketTableProps = {
  rows: any[];
  headers: any[];
  isLoadingData: boolean;
};

const PortfolioLiquidityTable = ({
  rows,
  headers,
  isLoadingData
}: MarketTableProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const {
    network: { currency },
    networkConfig
  } = useNetwork();
  const { ticker, symbol } = currency;
  const filter = useAppSelector(state => state.portfolio.filter);

  const [isLoadingClaimLiquidity, setIsLoadingClaimLiquidity] = useState({});

  function handleChangeIsLoading(id: string | number, isLoading: boolean) {
    setIsLoadingClaimLiquidity({ ...isLoadingClaimLiquidity, [id]: isLoading });
  }

  async function handleClaimLiquidity(marketId) {
    const polkamarketsService = new PolkamarketsService(networkConfig);

    handleChangeIsLoading(marketId, true);

    try {
      await polkamarketsService.claimLiquidity(marketId);

      // updating wallet
      await dispatch(login(networkConfig));
      await dispatch(fetchAditionalData(networkConfig));

      handleChangeIsLoading(marketId, false);
    } catch (error) {
      handleChangeIsLoading(marketId, false);
    }
  }

  function redirectTo(marketSlug) {
    return history.push(`/markets/${marketSlug}`);
  }

  const resolvedMarket = row => row.market.state === 'resolved';

  const filteredRows = rows.filter(row =>
    filter === 'resolved' ? resolvedMarket(row) : !resolvedMarket(row)
  );

  const { sortedItems, requestSort, key, sortDirection } =
    useSortableData(filteredRows);

  const sortDirectionArrow = headerKey => {
    if (!key || !sortDirection || (key && key !== headerKey)) return null;
    if (sortDirection === 'ascending') return <CaretUpIcon />;
    return <CaretDownIcon />;
  };

  return (
    <>
      <table className="pm-c-table">
        <tbody>
          <tr className="pm-c-table__header">
            {headers?.map(header => (
              <th
                id={header.key}
                key={header.key}
                className={classnames({
                  'pm-c-table__header-item': true,
                  [`pm-c-table__item--${header.align}`]: true,
                  'pm-c-table__item--button': true,
                  'pm-c-table__item--with-arrow': key && key === header.sortBy
                })}
                scope="col"
                onClick={() => requestSort(header.sortBy)}
              >
                {sortDirectionArrow(header.sortBy)}
                {header.title}
              </th>
            ))}
          </tr>
          {sortedItems?.map(
            ({ market, value, shares, poolShare, feesEarned, result }) => (
              <tr className="pm-c-table__row" key={market.id}>
                <td
                  id="market"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--left': true
                  })}
                  onClick={() => redirectTo(market.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1.6rem',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={market.imageUrl}
                      alt={market.id}
                      height={32}
                      width={32}
                      style={{ borderRadius: '50%' }}
                    />
                    {market.title}
                  </div>
                </td>
                <td
                  id="shares"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--center': true
                  })}
                >
                  {roundNumber(shares, 3)}
                </td>
                <td
                  id="value"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--right': true
                  })}
                >
                  <div className="market-table__row-item__group">
                    <Text
                      as="span"
                      scale="caption"
                      fontWeight="semibold"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {`${roundNumber(value.value, 3)} `}
                      <Text as="strong" scale="caption" fontWeight="semibold">
                        {` ${symbol || ticker}`}
                      </Text>
                    </Text>
                    {/* <Text
                      className={`market-table__row-item__change--${value.change.type}`}
                      as="span"
                      scale="caption"
                      fontWeight="bold"
                    >
                      {value.change.type === 'up' ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      )}
                      {`${roundNumber(value.change.value * 100, 2)}%`}
                    </Text> */}
                  </div>
                </td>
                <td
                  id="poolShare"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--right': true
                  })}
                >
                  {`${roundNumber(poolShare * 100, 3)}%`}
                </td>
                <td
                  id="feesEarned"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--right': true
                  })}
                >
                  <div className="market-table__row-item__group">
                    <Text
                      as="span"
                      scale="caption"
                      fontWeight="semibold"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {`${roundNumber(feesEarned, 3)} `}
                      <Text as="strong" scale="caption" fontWeight="semibold">
                        {` ${symbol || ticker}`}
                      </Text>
                    </Text>
                  </div>
                </td>
                <td
                  id="trade"
                  className={classnames({
                    'pm-c-table__row-item': true,
                    'pm-c-table__item--right': true
                  })}
                >
                  {result.type === 'pending' ? (
                    <Pill variant="subtle" color="default">
                      Ongoing
                    </Pill>
                  ) : null}
                  {result.type === 'awaiting_claim' ? (
                    <Button
                      size="sm"
                      variant="normal"
                      color="primary"
                      onClick={() => handleClaimLiquidity(market.id)}
                      loading={isLoadingClaimLiquidity[market.id] || false}
                      style={{ marginLeft: 'auto' }}
                    >
                      Withdraw
                    </Button>
                  ) : null}
                  {result.type === 'awaiting_resolution' ? (
                    <Pill variant="subtle" color="warning">
                      Awaiting Resolution
                    </Pill>
                  ) : null}
                  {result.type === 'claimed' ? (
                    <Pill variant="subtle" color="primary">
                      Withdrawn
                    </Pill>
                  ) : null}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {isEmpty(filteredRows) && isLoadingData ? (
        <div className="pm-c-table__loading">
          <div className="spinner--primary" />
        </div>
      ) : null}

      {isEmpty(filteredRows) && !isLoadingData ? (
        <div className="pm-c-table__empty">
          <AlertMini
            styles="outline"
            variant="information"
            description="You have no liquidity positions."
          />
        </div>
      ) : null}
    </>
  );
};

PortfolioLiquidityTable.displayName = 'Portfolio liquidity table';

export default PortfolioLiquidityTable;
