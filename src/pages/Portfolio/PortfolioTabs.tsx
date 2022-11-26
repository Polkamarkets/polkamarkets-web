import { useState, useMemo, memo } from 'react';

import { isEmpty } from 'lodash';
import { setFilter } from 'redux/ducks/portfolio';
import { useGetMarketsByIdsQuery } from 'services/Polkamarkets';
import { useMedia } from 'ui';

import {
  ButtonGroup,
  PortfolioLiquidityTable,
  PortfolioMarketTable,
  PortfolioReportTable,
  Filter
} from 'components';

import { useAppSelector, useAppDispatch, useNetwork } from 'hooks';

import {
  formatLiquidityPositions,
  formatMarketPositions,
  formatReportPositions
} from './utils';

function TabsFilter() {
  const dispatch = useAppDispatch();

  function handleChangeFilter(newFilter: { value: string; name: string }) {
    dispatch(setFilter(newFilter.value));
  }

  return (
    <Filter
      description="Filter:"
      defaultOption="open"
      options={[
        { value: 'open', name: 'Open' },
        { value: 'resolved', name: 'Resolved' }
      ]}
      onChange={handleChangeFilter}
    />
  );
}

const PortfolioTabsFilter = memo(TabsFilter);

function PortfolioTabs() {
  const { network } = useNetwork();
  const [currentTab, setCurrentTab] = useState('marketPositions');
  const isDesktop = useMedia('(min-width: 1024px)');
  const {
    bonds,
    portfolio,
    actions,
    marketsWithActions,
    marketsWithBonds,
    isLoading
  } = useAppSelector(state => state.polkamarkets);

  const {
    portfolio: isLoadingPortfolio,
    bonds: isLoadingBonds,
    actions: isLoadingActions
  } = isLoading;

  const marketsIds = [...marketsWithActions, ...marketsWithBonds];

  const { data: markets, isLoading: isLoadingMarkets } =
    useGetMarketsByIdsQuery(
      {
        ids: marketsIds,
        networkId: network.id
      },
      {
        skip: isLoadingBonds || isLoadingActions || isEmpty(marketsIds)
      }
    );

  const marketPositions = useMemo(
    () => formatMarketPositions(portfolio, actions, markets),
    [actions, markets, portfolio]
  );

  const liquidityPositions = useMemo(
    () => formatLiquidityPositions(portfolio, markets),
    [markets, portfolio]
  );

  const reportPositions = useMemo(
    () => formatReportPositions(bonds, markets),
    [bonds, markets]
  );

  return (
    <div className="portfolio-tabs">
      <div className="portfolio-tabs__header">
        <ButtonGroup
          defaultActiveId="marketPositions"
          buttons={[
            {
              id: 'marketPositions',
              name: 'Market Positions',
              color: 'default'
            },
            {
              id: 'liquidityPositions',
              name: 'Liquidity Positions',
              color: 'default'
            },
            {
              id: 'reportPositions',
              name: 'Reports',
              color: 'default'
            }
          ]}
          onChange={setCurrentTab}
          style={{ width: 'fit-content' }}
        />
        <PortfolioTabsFilter />
      </div>
      <div className="portfolio-tabs__content">
        {currentTab === 'marketPositions' ? (
          <PortfolioMarketTable
            rows={marketPositions.rows}
            headers={
              isDesktop
                ? marketPositions.headers
                : marketPositions.headers.filter(
                    header =>
                      header.key === 'market' ||
                      header.key === 'outcome' ||
                      header.key === 'profit'
                  )
            }
            isLoadingData={
              isLoadingMarkets || isLoadingPortfolio || isLoadingActions
            }
          />
        ) : null}
        {currentTab === 'liquidityPositions' ? (
          <PortfolioLiquidityTable
            rows={liquidityPositions.rows}
            headers={
              isDesktop
                ? liquidityPositions.headers
                : liquidityPositions.headers.filter(
                    header =>
                      header.key === 'market' ||
                      header.key === 'value' ||
                      header.key === 'status'
                  )
            }
            isLoadingData={isLoadingMarkets || isLoadingPortfolio}
          />
        ) : null}
        {currentTab === 'reportPositions' ? (
          <PortfolioReportTable
            rows={reportPositions.rows}
            headers={reportPositions.headers}
            isLoadingData={
              isLoadingMarkets || isLoadingPortfolio || isLoadingBonds
            }
          />
        ) : null}
      </div>
    </div>
  );
}

export default PortfolioTabs;
