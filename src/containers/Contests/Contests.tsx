import { Link } from 'react-router-dom';

import { environment } from 'config';
import ContestCard from 'containers/ContestCard';
import { useGetTournamentsQuery } from 'services/Polkamarkets';
import { Button } from 'ui';

import styles from './Contests.module.scss';

function Contests() {
  const {
    data: tournaments,
    isFetching,
    isLoading
  } = useGetTournamentsQuery({
    token: environment.FEATURE_FANTASY_TOKEN_TICKER
  });

  const isLoadingGetTournamentsQuery = isFetching || isLoading;

  if (isLoadingGetTournamentsQuery)
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );

  const visibleTournaments = tournaments?.slice(0, 12);
  const hiddenTournaments = tournaments?.slice(12);

  return (
    <>
      <div className={styles.root}>
        {visibleTournaments?.map(tournament => (
          <ContestCard tournament={tournament} key={tournament.id} />
        ))}
      </div>
      {hiddenTournaments && hiddenTournaments.length > 0 && (
        <div className={styles.footer}>
          <Link to="/contests">
            <Button size="lg" color="primary gray" variant="outlined">
              View all Contests
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Contests;
