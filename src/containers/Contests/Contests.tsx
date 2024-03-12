import { Link } from 'react-router-dom';

import { environment } from 'config';
import ContestCard from 'containers/ContestCard';
import isEmpty from 'lodash/isEmpty';
import { useGetTournamentsQuery } from 'services/Polkamarkets';
import { Button } from 'ui';

import { AlertMini, Icon } from 'components';

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

  if (!isLoadingGetTournamentsQuery && isEmpty(tournaments)) {
    return (
      <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-small">
        <AlertMini
          style={{ border: 'none' }}
          styles="outline"
          variant="information"
          description="No contests available at the moment."
        />
      </div>
    );
  }

  const visibleTournaments = tournaments?.slice(0, 12);

  return (
    <>
      <div className={styles.root}>
        {visibleTournaments?.map(tournament => (
          <ContestCard tournament={tournament} key={tournament.id} />
        ))}
      </div>
      <div className={styles.footer}>
        <Link to="/contests">
          <Button
            size="lg"
            color="primary gray"
            variant="outlined"
            itemEnd={
              <Icon
                name="Arrow"
                dir="right"
                className={styles.footerButtonIcon}
              />
            }
          >
            View all Contests
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Contests;
