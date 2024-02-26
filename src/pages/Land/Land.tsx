import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import classNames from 'classnames';
import isError404 from 'helpers/isError404';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {
  useGetLandBySlugQuery,
  useGetMarketsByIdsQuery
} from 'services/Polkamarkets';
import { Container } from 'ui';

import Error404 from 'pages/Error404';

import { AlertMini, SEO } from 'components';

import TournamentsUpcomingMarkets from '../Tournaments/TournamentsUpcomingMarkets';
import styles from './Land.module.scss';
import LandHero from './LandHero';
import LandTournamentList from './LandTournamentList';

function Land() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: land,
    isLoading: isLoadingLand,
    isFetching: isFetchingLand,
    ...landBySlug
  } = useGetLandBySlugQuery({ slug }, { skip: !slug });

  const isLoadingGetLandBySlugQuery = isLoadingLand || isFetchingLand;
  const isEmptyLand = !land || isEmpty(land);

  const marketsIds = useMemo(() => {
    if (isLoadingGetLandBySlugQuery || isEmptyLand) return [];

    return uniqBy(
      land.tournaments.map(tournament => tournament.markets || []).flat(),
      'slug'
    ).map(market => market.id);
  }, [isEmptyLand, isLoadingGetLandBySlugQuery, land]);

  const {
    data: markets,
    isLoading: isLoadingMarkets,
    isFetching: isFetchingMarkets
  } = useGetMarketsByIdsQuery(
    {
      ids: marketsIds,
      networkId: `${land?.tournaments?.[0]?.networkId}`
    },
    {
      skip: isEmpty(marketsIds)
    }
  );

  const isLoadingGetMarketsByIdsQuery = isLoadingMarkets || isFetchingMarkets;

  if (isLoadingGetLandBySlugQuery || isLoadingGetMarketsByIdsQuery)
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );

  if (isError404(landBySlug.error)) return <Error404 />;

  if (isEmptyLand)
    return (
      <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-small">
        <AlertMini
          style={{ border: 'none' }}
          styles="outline"
          variant="information"
          description="No data available at the moment."
        />
      </div>
    );

  const {
    slug: landSlug,
    title,
    description,
    bannerUrl,
    imageUrl,
    tournaments,
    users
  } = land;

  return (
    <>
      {land && (
        <SEO
          title={`${land.title} | Foreland Alpha`}
          description={`${land.description}\nStart now with $ALPHA`}
        />
      )}
      <LandHero
        meta={{ slug: landSlug, title, description, bannerUrl, imageUrl }}
        stats={{
          tournaments: tournaments.length,
          members: users
          // totalRewards: 11
        }}
      />
      <Container className={classNames('max-width-screen-xl', styles.root)}>
        <div className={styles.upcoming}>
          <TournamentsUpcomingMarkets markets={markets || []} />
        </div>
        <LandTournamentList tournaments={tournaments} />
      </Container>
    </>
  );
}

export default Land;
