import { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { environment } from 'config';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {
  useGetLandsQuery,
  useGetMarketsByIdsQuery
} from 'services/Polkamarkets';
import { Container } from 'ui';

import styles from './Home.module.scss';
import HomeCommunityLands from './HomeCommunityLands';
import HomeNewQuestions from './HomeNewQuestions';
import HomeOngoingEvents from './HomeOngoingEvents';

function Home() {
  const {
    data: lands,
    isLoading: isLoadingLands,
    isFetching: isFetchingLands
  } = useGetLandsQuery({ token: environment.FEATURE_FANTASY_TOKEN_TICKER });

  const isLoadingGetLandsQuery = isLoadingLands || isFetchingLands;
  const isEmptyLands = !lands || isEmpty(lands);

  const tournaments = useMemo(() => {
    if (isLoadingGetLandsQuery || isEmptyLands) return [];

    return uniqBy(lands.map(land => land.tournaments).flat(), 'slug');
  }, [isEmptyLands, isLoadingGetLandsQuery, lands]);

  const marketsIds = useMemo(() => {
    if (isLoadingGetLandsQuery || isEmptyLands) return [];

    return uniqBy(
      tournaments.map(tournament => tournament.markets || []).flat(),
      'slug'
    ).map(market => market.id);
  }, [isEmptyLands, isLoadingGetLandsQuery, tournaments]);

  const marketsIdsByLand = useMemo(() => {
    if (isLoadingGetLandsQuery || isEmptyLands) return [];

    return lands.map(land => ({
      land,
      markets: uniqBy(
        land.tournaments.map(tournament => tournament.markets || []).flat(),
        'slug'
      ).map(market => market.id)
    }));
  }, [isEmptyLands, isLoadingGetLandsQuery, lands]);

  const getMarketLand = useCallback(
    (marketId: string) => {
      if (isLoadingGetLandsQuery || isEmptyLands) return null;

      const marketLand = marketsIdsByLand.find(({ markets }) =>
        markets.includes(marketId)
      );
      if (!marketLand) return null;

      return marketLand.land;
    },
    [isEmptyLands, isLoadingGetLandsQuery, marketsIdsByLand]
  );

  const {
    data: markets,
    isLoading: isLoadingMarkets,
    isFetching: isFetchingMarkets
  } = useGetMarketsByIdsQuery(
    {
      ids: marketsIds,
      networkId: `${lands?.[0]?.tournaments?.[0]?.networkId}`
    },
    {
      skip: isEmpty(marketsIds)
    }
  );

  const isLoadingGetMarketsByIdsQuery = isLoadingMarkets || isFetchingMarkets;

  if (isLoadingGetLandsQuery || isLoadingGetMarketsByIdsQuery) {
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );
  }

  return (
    <Container className={classNames('max-width-screen-xl', styles.root)}>
      <HomeNewQuestions
        questions={markets || []}
        getMarketLand={getMarketLand}
      />
      <HomeOngoingEvents tournaments={tournaments || []} />
      <HomeCommunityLands lands={lands || []} />
    </Container>
  );
}

export default Home;
