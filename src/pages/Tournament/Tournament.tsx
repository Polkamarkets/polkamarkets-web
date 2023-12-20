import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import cn from 'classnames';
import { ui } from 'config';
import { defaultMetadata, metadataByPage } from 'config/pages';
import dayjs from 'dayjs';
import {
  useGetLeaderboardByTimeframeQuery,
  useGetTournamentBySlugQuery
} from 'services/Polkamarkets';
import { Container, useRect, useTheme } from 'ui';

import { MarketList, SEO } from 'components';

import { useNetwork } from 'hooks';

import HomeFilter from '../Home/HomeFilter';
import TournamentHero from './TournamentHero';
import TournamentNav from './TournamentNav';
import styles from './TournamentNav.module.scss';
import TournamentTopUsers from './TournamentTopUsers';

export default function Tournament() {
  const theme = useTheme();
  const { network } = useNetwork();
  const { slug } = useParams<{ slug: string }>();

  const [ref, rect] = useRect();
  const [show, setShow] = useState(false);

  const { data, isLoading, isFetching } = useGetTournamentBySlugQuery({ slug });
  const isLoadingTournamentBySlugQuery = isLoading || isFetching;

  const {
    data: leaderboardByTimeframe,
    isLoading: isLoadingLeaderboardByTimeframe,
    isFetching: isFetchingLeaderboardByTimeframe
  } = useGetLeaderboardByTimeframeQuery(
    {
      timeframe: 'at',
      networkId: network.id,
      tournamentId: data?.id.toString()
    },
    {
      skip: isLoadingTournamentBySlugQuery
    }
  );

  const isLoadingLeaderboardByTimeframeQuery =
    isLoadingLeaderboardByTimeframe || isFetchingLeaderboardByTimeframe;

  const marketsIds = useMemo(
    () => (data && data.markets ? data.markets.map(market => market.id) : []),
    [data]
  );
  const networkId = data ? data.networkId : network.id;

  const handleShow = useCallback(() => setShow(true), []);
  const handleHide = useCallback(() => setShow(false), []);
  const handleToggle = useCallback(() => setShow(prevShow => !prevShow), []);

  const fetchByIds = useMemo(
    () => ({ ids: marketsIds, networkId: parseInt(`${networkId}`, 10) }),
    [marketsIds, networkId]
  );

  const isTournamentEnded = dayjs().utc().isAfter(dayjs(data?.expiresAt).utc());

  const tournamentCriteria = useMemo(() => {
    if (data) {
      if (data.rankBy === 'claim_winnings_count,earnings_eur') {
        return 'Won predictions';
      }
      return 'Earnings';
    }

    return undefined;
  }, [data]);

  if (isLoadingTournamentBySlugQuery || isLoadingLeaderboardByTimeframeQuery)
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );

  return (
    <div className="max-width-screen-xl">
      {data && (
        <SEO
          title={`${data.title} - ${defaultMetadata.title}`}
          description={
            metadataByPage.tournaments.description ||
            defaultMetadata.description
          }
        />
      )}
      {ui.hero.enabled && (
        <TournamentHero
          landName={data?.land?.title}
          landSlug={data?.land?.slug}
          landImageUrl={data?.land?.imageUrl}
          landBannerUrl={data?.land?.bannerUrl}
          tournamentName={data?.title}
          tournamentDescription={data?.description}
          tournamentSlug={data?.slug}
          tournamentImageUrl={data?.imageUrl}
          topUsers={
            <TournamentTopUsers
              rows={leaderboardByTimeframe?.filter(row => row.username)}
              isLoading={isLoadingLeaderboardByTimeframeQuery}
            />
          }
          questions={marketsIds.length}
          users={data?.users}
          rewards={data?.rewards}
          criteria={tournamentCriteria}
          rules={data?.rules}
        />
      )}
      <Container ref={ref} className={styles.nav}>
        <TournamentNav
          onFilterClick={theme.device.isDesktop ? handleToggle : handleShow}
        />
      </Container>
      <div className={styles.root}>
        <HomeFilter
          onFilterHide={handleHide}
          rect={rect}
          show={show}
          resetStatesDropdown={
            !isLoadingTournamentBySlugQuery && isTournamentEnded
          }
        />
        {isLoadingTournamentBySlugQuery ? (
          <div
            className={cn('pm-c-market-list', {
              'pm-c-market-list--filters-visible': show
            })}
          >
            <div className="pm-c-market-list__empty-state">
              <div className="pm-c-market-list__empty-state__body">
                <span className="spinner--primary" />
              </div>
            </div>
          </div>
        ) : (
          <MarketList filtersVisible={show} fetchByIds={fetchByIds} />
        )}
      </div>
    </div>
  );
}
