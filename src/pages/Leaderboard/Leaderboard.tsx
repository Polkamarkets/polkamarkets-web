import { useEffect, useState } from 'react';

import { closeRightSidebar } from 'redux/ducks/ui';
import { useGetLeaderboardByTimeframeQuery } from 'services/Polkamarkets';

import { Tabs } from 'components';
import { Dropdown } from 'components/new';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';

import LeaderboardTable from './LeaderboardTable';
import LeaderboardTopWallets from './LeaderboardTopWallets';
import LeaderboardYourStats from './LeaderboardYourStats';
import {
  liquidityColumnRender,
  rankColumnRender,
  volumeColumnRender,
  walletColumnRender
} from './prepare';
import { LeaderboardTableColumn } from './types';

const tabs = [
  {
    id: 'volume',
    title: 'Gross Volume',
    sortBy: 'volume'
  },
  {
    id: 'marketsCreated',
    title: 'Markets Created',
    sortBy: 'marketsCreated'
  },
  {
    id: 'wonPredictions',
    title: 'Won Predictions',
    sortBy: 'claimWinningsCount'
  },
  {
    id: 'netVolume',
    title: 'Net Volume',
    sortBy: 'tvlVolume'
  },
  {
    id: 'netLiquidity',
    title: 'Net Liquidity',
    sortBy: 'tvlLiquidity'
  }
];

const columns: LeaderboardTableColumn[] = [
  {
    title: 'Wallet',
    key: 'wallet',
    align: 'left',
    width: 200,
    render: walletColumnRender
  },
  {
    title: 'Gross Volume',
    key: 'volume',
    align: 'right',
    width: 140,
    render: volumeColumnRender
  },
  {
    title: 'Markets Created',
    key: 'marketsCreated',
    align: 'right',
    width: 140
  },
  {
    title: 'Won Predictions',
    key: 'wonPredictions',
    align: 'right',
    width: 140
  },
  {
    title: 'Net Volume',
    key: 'netVolume',
    align: 'right',
    width: 140,
    render: volumeColumnRender
  },
  {
    title: 'Net Liquidity',
    key: 'netLiquidity',
    align: 'right',
    width: 140,
    render: liquidityColumnRender
  },
  {
    title: 'Rank',
    key: 'rank',
    align: 'right',
    width: 100,
    render: rankColumnRender
  }
];

type Timeframe = '1w' | '1m' | 'at';

function Leaderboard() {
  // Redux selectors
  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );
  const ethAddress = useAppSelector(state => state.polkamarkets.ethAddress);
  const rightSidebarIsVisible = useAppSelector(
    state => state.ui.rightSidebar.visible
  );

  // Custom hooks
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const { currency } = network;

  // Local state
  const [activeTab, setActiveTab] = useState('netVolume');
  const [timeframe, setTimeframe] = useState<Timeframe>('1w');

  // Query hooks
  const { data, isLoading, isFetching } = useGetLeaderboardByTimeframeQuery({
    timeframe,
    networkId: network.id
  });

  useEffect(() => {
    if (rightSidebarIsVisible) {
      dispatch(closeRightSidebar());
    }
  }, [rightSidebarIsVisible, dispatch]);

  const userEthAddress = walletConnected ? ethAddress : undefined;

  const isLoadingQuery = isLoading || isFetching;
  const ticker = currency.symbol || currency.ticker;

  return (
    <div className="pm-p-leaderboard">
      <h1 className="heading semibold text-1">Leaderboard</h1>
      <Tabs
        direction="row"
        fullwidth
        value={activeTab}
        onChange={tab => setActiveTab(tab)}
        filters={[
          <Dropdown
            key="timeframe"
            defaultOption="1w"
            options={[
              { label: 'Weekly', value: '1w' },
              { label: 'Monthly', value: '1m' },
              { label: 'All-time', value: 'at' }
            ]}
            onSelect={value => setTimeframe(value)}
          />
        ]}
      >
        {tabs.map(tab => (
          <Tabs.TabPane key={tab.id} id={tab.id} tab={tab.title}>
            <div className="flex-row gap-6 justify-space-between align-start width-full">
              <LeaderboardTable
                loggedInUser={userEthAddress}
                columns={columns}
                rows={data}
                sortBy={tab.sortBy}
                ticker={ticker}
                isLoading={isLoadingQuery}
              />
              <div className="flex-column gap-6 justify-start align-start">
                {walletConnected ? (
                  <LeaderboardYourStats
                    loggedInUser={userEthAddress}
                    rows={data}
                    sortBy={tab.sortBy}
                    ticker={ticker}
                    isLoading={isLoadingQuery}
                  />
                ) : null}
                <LeaderboardTopWallets
                  rows={data}
                  sortBy={tab.sortBy}
                  isLoading={isLoadingQuery}
                />
              </div>
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default Leaderboard;
