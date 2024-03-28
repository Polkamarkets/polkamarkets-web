import { useEffect, useMemo } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { useParams } from 'react-router-dom';

import classNames from 'classnames';
import { ContestCard } from 'containers';
import dayjs from 'dayjs';
import isError404 from 'helpers/isError404';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { setSorter } from 'redux/ducks/markets';
import {
  useGetLandBySlugQuery,
  useGetLeaderboardByTimeframeQuery
} from 'services/Polkamarkets';
import { Tournament } from 'types/tournament';
import { Container, Spinner } from 'ui';

import Error404 from 'pages/Error404';

import { MarketList, SEO } from 'components';

import { Dropdowns, filtersInitialState } from 'contexts/filters';

import { useAppDispatch, useFilters } from 'hooks';

import { ReactComponent as EmptyImage } from '../../assets/images/landEmpty.svg';
import { About } from './About/About';
import { Card } from './Card/Card';
import styles from './Land.module.scss';
import LandHero from './LandHero/LandHero';
import { LandRankings } from './LandRankings/LandRankings';

const IfNotEmpty = ({
  children,
  show = true
}: {
  children: React.ReactNode;
  show?: boolean;
}) => {
  if (show) return <>{children}</>;

  return (
    <div className={styles.emptyRoot}>
      <EmptyImage className={styles.emptyImage} />
      <span>No Live Content for Now</span>
      <p>
        Join our Land so you don&apos;t miss our upcoming Prediction Contests!
      </p>
    </div>
  );
};

const Land = () => {
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

  const filters = {
    ids: marketsIds,
    networkId: land?.tournaments?.[0]?.networkId || 0
  };

  const dispatch = useAppDispatch();
  const { controls } = useFilters();
  const { updateDropdown } = controls;

  useEffect(() => {
    updateDropdown({
      dropdown: Dropdowns.STATES,
      state: []
    });

    return () => {
      updateDropdown({
        dropdown: Dropdowns.STATES,
        state: filtersInitialState.dropdowns.states
      });
    };
  }, [updateDropdown]);

  useEffect(() => {
    dispatch(
      setSorter({
        value: 'createdAt',
        sortBy: 'desc'
      })
    );
  }, [dispatch]);

  const { data: leaderboard } = useGetLeaderboardByTimeframeQuery(
    {
      timeframe: 'at',
      networkId: `${land?.tournaments?.[0]?.networkId || 0}`,
      landId: `${land?.id}`
    },
    {
      skip: !land
    }
  );

  if (isError404(landBySlug.error)) return <Error404 />;

  if (isLoadingGetLandBySlugQuery)
    return (
      <div className={styles.loadingRoot}>
        <Spinner /> Loading ...
      </div>
    );

  if (isEmptyLand) return <Error404 />;

  const { tournaments } = land;

  const sortedTournaments = [...tournaments].sort((a, b) => {
    if (new Date(a.expiresAt) < new Date(b.expiresAt)) return 1;
    if (new Date(a.expiresAt) > new Date(b.expiresAt)) return -1;
    return 0;
  });

  const liveContests = sortedTournaments
    .reduce<Tournament[]>((acc, tournament) => {
      const contestEnded = dayjs()
        .utc()
        .isAfter(dayjs(tournament.expiresAt).utc());
      if (!contestEnded && acc.length < 3) {
        acc.push({ ...tournament, land });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      if (new Date(a.expiresAt) < new Date(b.expiresAt)) return -1;
      if (new Date(a.expiresAt) > new Date(b.expiresAt)) return 1;
      return 0;
    });
  return (
    <>
      {land && (
        <SEO
          title={`${land.title} | Foreland Alpha`}
          description={`${land.description}\nStart now with $ALPHA`}
        />
      )}

      <LandHero land={land} />
      <Container className={classNames('max-width-screen-lg', styles.root)}>
        <Tabs className={styles.tabs}>
          <TabList className={styles.tabList} aria-label="Discover">
            <Tab className={styles.tab} id="home">
              Live Now
            </Tab>
            <Tab className={styles.tab} id="contests">
              Contests
            </Tab>
            <Tab className={styles.tab} id="questions">
              Questions
            </Tab>
            <Tab className={styles.tab} id="ranking">
              Ranking
            </Tab>
            <Tab className={styles.tab} id="about">
              About
            </Tab>
          </TabList>

          <TabPanel className={styles.tabPanel} id="home">
            <IfNotEmpty
              show={
                !!(
                  tournaments.length &&
                  tournaments.some(tournament =>
                    dayjs().utc().isBefore(dayjs(tournament.expiresAt).utc())
                  )
                )
              }
            >
              <Card
                title="Live Contests"
                tooltip="Ongoing Contests open for predictions"
              >
                <div className={styles.cardGrid}>
                  {liveContests.map(tournament => (
                    <ContestCard
                      key={tournament.slug}
                      tournament={{ ...tournament, land }}
                    />
                  ))}
                </div>
              </Card>
              <Card
                title="Featured"
                tooltip="Live Questions with significant level of engagement."
                className={styles.featuredQuestions}
              >
                <MarketList
                  filtersVisible={false}
                  maxVisibleItems={10}
                  fetchByIds={filters}
                />
              </Card>
            </IfNotEmpty>
          </TabPanel>
          <TabPanel className={styles.tabPanel} id="contests">
            <IfNotEmpty show={!!tournaments.length}>
              <Card title="Contests" tooltip="Leal is going to win">
                <div className={styles.cardGrid}>
                  {sortedTournaments.map(tournament => (
                    <ContestCard
                      key={tournament.slug}
                      tournament={{ ...tournament, land }}
                    />
                  ))}
                </div>
              </Card>
            </IfNotEmpty>
          </TabPanel>
          <TabPanel className={styles.tabPanel} id="questions">
            <IfNotEmpty show={!!tournaments.length}>
              <Card title="Questions" tooltip="Leal is going to win">
                <MarketList
                  filtersVisible={false}
                  maxVisibleItems={10}
                  fetchByIds={filters}
                />
              </Card>
            </IfNotEmpty>
          </TabPanel>
          <TabPanel className={styles.tabPanel} id="ranking">
            <IfNotEmpty show={!!tournaments.length}>
              <Card
                title="Land Ranking"
                tooltip="The Land Ranking classifies all its members, based on their prediction accuracy and token earnings accumulated throughout all their activity."
              >
                <LandRankings data={leaderboard || []} />
              </Card>
            </IfNotEmpty>
          </TabPanel>
          <TabPanel className={styles.tabPanel} id="about">
            <About land={land} />
          </TabPanel>
        </Tabs>
      </Container>
    </>
  );
};

export default Land;
