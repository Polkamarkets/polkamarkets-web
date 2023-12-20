import { useMemo, useState } from 'react';

import { environment, ui } from 'config';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import {
  useGetMarketsByIdsQuery,
  useGetTournamentsQuery
} from 'services/Polkamarkets';
import type { Land } from 'types/land';

import { AlertMini, Tabs } from 'components';

import TournamentGroup from './TournamentGroup';
import styles from './TournamentsList.module.scss';
import TournamentsUpcomingMarkets from './TournamentsUpcomingMarkets';

function TournamentsList() {
  const {
    data: tournaments,
    isFetching,
    isLoading
  } = useGetTournamentsQuery({
    token: environment.FEATURE_FANTASY_TOKEN_TICKER
  });

  const isLoadingGetTournamentsQuery = isFetching || isLoading;
  const isEmptyTournaments = !tournaments || isEmpty(tournaments);

  const [currentTab, setCurrentTab] = useState('all');

  const lands = useMemo(() => {
    if (isLoadingGetTournamentsQuery || isEmptyTournaments) return [];

    return orderBy(
      uniqBy(
        tournaments
          .map(tournament => tournament.land)
          .filter(land => land !== null) as Omit<Land, 'tournaments'>[],
        'id'
      ).map(land => {
        const tournamentsInGroup = orderBy(
          tournaments
            .filter(tournament => tournament.land?.id === land.id)
            .map(tournament => omit(tournament, 'land'))
        );

        return {
          ...land,
          tournaments: tournamentsInGroup
        };
      }),
      'position'
    );
  }, [isEmptyTournaments, isLoadingGetTournamentsQuery, tournaments]);

  const marketsIds = useMemo(() => {
    if (isLoadingGetTournamentsQuery || isEmptyTournaments) return [];

    return uniqBy(
      tournaments.map(tournament => tournament.markets || []).flat(),
      'slug'
    ).map(market => market.id);
  }, [isEmptyTournaments, isLoadingGetTournamentsQuery, tournaments]);

  const {
    data: markets,
    isLoading: isLoadingMarkets,
    isFetching: isFetchingMarkets
  } = useGetMarketsByIdsQuery(
    {
      ids: marketsIds,
      networkId: `${tournaments?.[0]?.networkId}`
    },
    {
      skip: isEmpty(marketsIds)
    }
  );

  const isLoadingGetMarketsByIdsQuery = isLoadingMarkets || isFetchingMarkets;

  if (isLoadingGetTournamentsQuery || isLoadingGetMarketsByIdsQuery)
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );

  if (isEmpty(lands))
    return (
      <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-medium">
        <AlertMini
          style={{ border: 'none' }}
          styles="outline"
          variant="information"
          description="No tournaments available at the moment."
        />
      </div>
    );

  return (
    <>
      {markets && ui.tournaments.upcoming.enabled ? (
        <div className={styles.upcoming}>
          <TournamentsUpcomingMarkets markets={markets} />
        </div>
      ) : null}
      {ui.tournaments.tabs.enabled ? (
        <Tabs
          direction="row"
          fullwidth
          value={currentTab}
          onChange={tab => setCurrentTab(tab)}
          className={{
            root: styles.tabsRoot,
            header: styles.tabsHeader,
            item: styles.tabsItem
          }}
        >
          <Tabs.TabPane id="all" tab="All">
            <ul className={styles.root}>
              {lands.map(land => (
                <li key={land.id}>
                  <TournamentGroup group={land} />
                </li>
              ))}
            </ul>
          </Tabs.TabPane>
          {lands.map(land => (
            <Tabs.TabPane
              key={land.id}
              id={land.id.toString()}
              tab={land.title}
            >
              <ul className={styles.root}>
                <TournamentGroup group={land} />
              </ul>
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        <ul className={styles.root}>
          {lands.map(land => (
            <li key={land.id}>
              <TournamentGroup group={land} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default TournamentsList;
