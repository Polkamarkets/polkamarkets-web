import { useState } from 'react';

import { getFavoriteMarkets, getMarkets } from 'redux/ducks/markets';

import { Tabs, MarketListAsync } from 'components';

import { useFavoriteMarkets } from 'hooks';

function HomeTabs({
  openMarkets,
  closedMarkets,
  resolvedMarkets,
  favoritesMarkets
}) {
  const { favoriteMarkets } = useFavoriteMarkets();
  const [activeTab, setActiveTab] = useState('open');

  return (
    <Tabs value={activeTab} onChange={tab => setActiveTab(tab)} filters={[]}>
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
