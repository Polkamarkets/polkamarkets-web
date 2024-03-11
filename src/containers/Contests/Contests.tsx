import { environment } from 'config';
import ContestCard from 'containers/ContestCard';
import { useGetTournamentsQuery } from 'services/Polkamarkets';

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

  return (
    <div className={styles.root}>
      {tournaments?.slice(0, 12)?.map(tournament => (
        <ContestCard tournament={tournament} key={tournament.id} />
      ))}
    </div>
  );
}

export default Contests;
