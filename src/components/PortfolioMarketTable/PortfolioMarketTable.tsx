/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import classnames from 'classnames';
import { colorByOutcomeId } from 'helpers/color';
import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { login, fetchAditionalData } from 'redux/ducks/polkamarkets';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CaretUpIcon
} from 'assets/icons';

import {
  useAppDispatch,
  useAppSelector,
  useFantasyTokenTicker,
  usePolkamarketsService,
  useSortableData
} from 'hooks';

import { AlertMini } from '../Alert';
import Badge from '../Badge';
import { ButtonLoading } from '../Button';
import Pill from '../Pill';
import Text from '../Text';

type MarketTableProps = {
  rows: any[];
  headers: any[];
  isLoadingData: boolean;
};

const PortfolioMarketTable = ({
  rows,
  headers,
  isLoadingData
}: MarketTableProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const polkamarketsService = usePolkamarketsService();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const filter = useAppSelector(state => state.portfolio.filter);

  const [isLoadingClaimWinnings, setIsLoadingClaimWinnings] = useState({});
  const [isLoadingClaimVoided, setIsLoadingClaimVoided] = useState({});

  function handleChangeIsLoading(id: string | number, isLoading: boolean) {
    setIsLoadingClaimWinnings({ ...isLoadingClaimWinnings, [id]: isLoading });
  }

  function handleChangeIsLoadingVoided(
    marketId: string | number,
    outcomeId: string | number,
    isLoading: boolean
  ) {
    setIsLoadingClaimVoided({
      ...isLoadingClaimVoided,
      [`${marketId}-${outcomeId}`]: isLoading
    });
  }

  async function updateWallet() {
    await dispatch(login(polkamarketsService));
    await dispatch(fetchAditionalData(polkamarketsService));
  }

  async function handleClaimWinnings(marketId) {
    handleChangeIsLoading(marketId, true);

    try {
      await polkamarketsService.claimWinnings(marketId);

      // updating wallet
      await updateWallet();

      handleChangeIsLoading(marketId, false);
    } catch (error) {
      handleChangeIsLoading(marketId, false);
    }
  }

  async function handleClaimVoided(marketId, outcomeId) {
    handleChangeIsLoadingVoided(marketId, outcomeId, true);

    try {
      await polkamarketsService.claimVoidedOutcomeShares(marketId, outcomeId);

      // updating wallet
      await updateWallet();

      handleChangeIsLoadingVoided(marketId, outcomeId, false);
    } catch (error) {
      handleChangeIsLoadingVoided(marketId, outcomeId, false);
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
            ({
              market,
              outcome,
              price,
              profit,
              value,
              shares,
              maxPayout,
              result
            }) => (
              <tr
                className="pm-c-table__row"
                key={`${market.id}-${outcome.id}`}
              >
                {market && (
                  <td
                    id="market"
                    className="pm-c-table__row-item pm-c-table__item--left"
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
                )}
                {outcome && (
                  <td
                    id="outcome"
                    className="pm-c-table__row-item pm-c-table__item--left"
                  >
                    <Badge
                      color={colorByOutcomeId(outcome.id)}
                      label={`${outcome.title}`}
                      style={{ display: 'inline-flex' }}
                    />
                  </td>
                )}
                {price && (
                  <td
                    id="price"
                    className="pm-c-table__row-item pm-c-table__item--right notranslate"
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
                        {`${roundNumber(price.value, 3)} `}
                        <Text as="strong" scale="caption" fontWeight="semibold">
                          {` ${fantasyTokenTicker || market.token.symbol}`}
                        </Text>
                      </Text>
                      <Text
                        className={`market-table__row-item__change--${price.change.type}`}
                        as="span"
                        scale="caption"
                        fontWeight="bold"
                      >
                        {price.change.type === 'up' ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                        {`${price.change.value}%`}
                      </Text>
                    </div>
                  </td>
                )}
                {profit && (
                  <td
                    id="profit"
                    className="pm-c-table__row-item pm-c-table__item--right notranslate"
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
                        {`${roundNumber(profit.value, 3)} `}
                        <Text as="strong" scale="caption" fontWeight="semibold">
                          {` ${fantasyTokenTicker || market.token.symbol}`}
                        </Text>
                      </Text>
                      <Text
                        className={`market-table__row-item__change--${profit.change.type}`}
                        as="span"
                        scale="caption"
                        fontWeight="bold"
                      >
                        {profit.change.type === 'up' ? (
                          <ArrowUpIcon />
                        ) : (
                          <ArrowDownIcon />
                        )}
                        {`${profit.change.value}%`}
                      </Text>
                    </div>
                  </td>
                )}
                {shares && (
                  <td
                    id="shares"
                    className="pm-c-table__row-item pm-c-table__item--center"
                  >
                    {roundNumber(shares, 3)}
                  </td>
                )}
                {value && (
                  <td
                    id="value"
                    className="pm-c-table__row-item pm-c-table__item--right notranslate"
                  >
                    <Text
                      as="span"
                      scale="caption"
                      fontWeight="semibold"
                      style={{
                        display: 'inline-flex',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {`${roundNumber(value, 3)} `}
                      <Text as="strong" scale="caption" fontWeight="semibold">
                        {` ${fantasyTokenTicker || market.token.symbol}`}
                      </Text>
                    </Text>
                  </td>
                )}
                {maxPayout && (
                  <td
                    id="maxPayout"
                    className="pm-c-table__row-item pm-c-table__item--right notranslate"
                  >
                    <Text
                      as="span"
                      scale="caption"
                      fontWeight="semibold"
                      style={{
                        display: 'inline-flex',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {`${roundNumber(maxPayout, 3)} `}
                      <Text as="strong" scale="caption" fontWeight="semibold">
                        {` ${fantasyTokenTicker || market.token.symbol}`}
                      </Text>
                    </Text>
                  </td>
                )}
                {result && (
                  <td
                    id="trade"
                    className="pm-c-table__row-item pm-c-table__item--right"
                  >
                    {result.type === 'pending' ? (
                      <Pill variant="subtle" color="default">
                        Ongoing
                      </Pill>
                    ) : null}
                    {result.type === 'awaiting_claim' ? (
                      <ButtonLoading
                        size="sm"
                        variant="normal"
                        color="success"
                        onClick={() => handleClaimWinnings(market.id)}
                        loading={isLoadingClaimWinnings[market.id] || false}
                        style={{ marginLeft: 'auto' }}
                      >
                        Claim Winnings
                      </ButtonLoading>
                    ) : null}
                    {result.type === 'awaiting_claim_voided' ? (
                      <ButtonLoading
                        size="sm"
                        variant="normal"
                        color="warning"
                        onClick={() => handleClaimVoided(market.id, outcome.id)}
                        loading={
                          isLoadingClaimVoided[`${market.id}-${outcome.id}`] ||
                          false
                        }
                        style={{ marginLeft: 'auto' }}
                      >
                        Claim Shares
                      </ButtonLoading>
                    ) : null}
                    {result.type === 'awaiting_resolution' ? (
                      <Pill variant="subtle" color="warning">
                        Awaiting Resolution
                      </Pill>
                    ) : null}
                    {result.type === 'claimed' ? (
                      <Pill variant="subtle" color="success">
                        Winnings Claimed
                      </Pill>
                    ) : null}
                    {result.type === 'claimed_voided' ? (
                      <Pill variant="subtle" color="warning">
                        Shares Claimed
                      </Pill>
                    ) : null}
                    {result.type === 'lost' ? (
                      <Pill variant="subtle" color="danger">
                        Lost
                      </Pill>
                    ) : null}
                  </td>
                )}
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
            description="You have no market positions."
          />
        </div>
      ) : null}
    </>
  );
};

PortfolioMarketTable.displayName = 'Portfolio Market table';

export default PortfolioMarketTable;
