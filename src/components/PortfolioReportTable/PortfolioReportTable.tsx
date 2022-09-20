/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';
import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { Market } from 'models/market';
import { changeMarketQuestion } from 'redux/ducks/markets';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';
import { PolkamarketsService, PolkamarketsApiService } from 'services';

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

const PortfolioReportTable = ({
  rows,
  headers,
  isLoadingData
}: MarketTableProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { networkConfig } = useNetwork();
  const filter = useAppSelector(state => state.portfolio.filter);

  const [isLoadingClaimReport, setIsLoadingClaimReport] = useState({});

  function handleChangeIsLoading(id: string | number, isLoading: boolean) {
    setIsLoadingClaimReport({ ...isLoadingClaimReport, [id]: isLoading });
  }

  async function handleClaimReport(market: Market) {
    const polkamarketsService = new PolkamarketsService(networkConfig);

    handleChangeIsLoading(market.id, true);

    try {
      await polkamarketsService.claimWinningsAndWithdraw(market.questionId);

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(market.slug);

      const question = await polkamarketsService.getQuestion(market.questionId);
      dispatch(changeMarketQuestion({ marketId: market.id, question }));

      // updating wallet
      dispatch(login(networkConfig));
      await dispatch(fetchAditionalData(networkConfig));

      handleChangeIsLoading(market.id, false);
    } catch (error) {
      handleChangeIsLoading(market.id, false);
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
          {sortedItems?.map(({ market, value, payout, result }) => (
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
                {roundNumber(value, 3)}
                <Text as="strong" scale="caption" fontWeight="semibold">
                  {` POLK`}
                </Text>
              </td>
              <td
                id="value"
                className={classnames({
                  'pm-c-table__row-item': true,
                  'pm-c-table__item--right': true
                })}
              >
                <div className="market-table__row-item__group">
                  {market.question.isClaimed ? (
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
                      {`${roundNumber(payout, 3)} `}
                      <Text as="strong" scale="caption" fontWeight="semibold">
                        {` POLK`}
                      </Text>
                    </Text>
                  ) : (
                    <Pill variant="subtle" color="default">
                      Pending
                    </Pill>
                  )}
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
                    onClick={() => handleClaimReport(market)}
                    loading={isLoadingClaimReport[market.id] || false}
                    style={{ marginLeft: 'auto' }}
                  >
                    Claim
                  </Button>
                ) : null}
                {result.type === 'awaiting_resolution' ? (
                  <Pill variant="subtle" color="warning">
                    Awaiting Resolution
                  </Pill>
                ) : null}
                {result.type === 'claimed' ? (
                  <Pill variant="subtle" color="primary">
                    Claimed
                  </Pill>
                ) : null}
              </td>
            </tr>
          ))}
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
            description="You have no report positions."
          />
        </div>
      ) : null}
    </>
  );
};

PortfolioReportTable.displayName = 'Portfolio reports table';

export default PortfolioReportTable;
