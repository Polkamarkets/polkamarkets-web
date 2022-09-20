import { useCallback, useState } from 'react';

import {
  getFavoriteMarkets,
  getMarkets,
  setFilterByVerified,
  setSorterByEndingSoon,
  setSorter
} from 'redux/ducks/markets';

import { Tabs, MarketListAsync, FilterInline, Filter } from 'components';

import { useAppDispatch, useAppSelector, useFavoriteMarkets } from 'hooks';

import { filters } from './utils';

function HomeTabs({
  openMarkets,
  closedMarkets,
  resolvedMarkets,
  favoritesMarkets
}) {
  const dispatch = useAppDispatch();
  const { favoriteMarkets } = useFavoriteMarkets();
  const filterByVerified = useAppSelector(
    state => state.markets.filterByVerified
  );

  const [activeTab, setActiveTab] = useState('open');

  function handleChangeFilterInline(filterByVerifiedMarkets: boolean) {
    dispatch(setFilterByVerified(filterByVerifiedMarkets));
  }

  const handleTouchedFilter = useCallback(
    (touched: boolean) => {
      dispatch(setSorterByEndingSoon(!touched));
    },
    [dispatch]
  );

  function handleSelectedFilter(filter: {
    value: string | number;
    optionalTrigger?: string;
  }) {
    dispatch(
      setSorter({ value: filter.value, sortBy: filter.optionalTrigger })
    );
  }

  return (
    <Tabs
      value={activeTab}
      onChange={tab => setActiveTab(tab)}
      filters={[
        <FilterInline
          key="filterByVerifiedMarkets"
          label="Verified markets"
          isChecked={filterByVerified}
          helpText="Curated list from trusted sources"
          onChange={handleChangeFilterInline}
        />,
        <Filter
          key="sortBy"
          description="Sort by"
          defaultOption="volumeEur"
          options={filters}
          onChange={handleSelectedFilter}
          onTouch={handleTouchedFilter}
        />
      ]}
    >
      <Tabs.TabPane tab="Open" id="open">
        <MarketListAsync
          id="open"
          asyncAction={getMarkets}
          filterBy="open"
          markets={openMarkets}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="In-Reporting" id="in-reporting">
        <MarketListAsync
          id="closed"
          asyncAction={getMarkets}
          filterBy="closed"
          markets={closedMarkets}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Resolved" id="resolved">
        <MarketListAsync
          id="resolved"
          asyncAction={getMarkets}
          filterBy="resolved"
          markets={resolvedMarkets}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Favorites" id="favorites">
        <MarketListAsync
          id="favorites"
          asyncAction={getFavoriteMarkets}
          filterBy={favoriteMarkets}
          markets={favoritesMarkets}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}

HomeTabs.displayName = 'HomeTabs';

export default HomeTabs;
