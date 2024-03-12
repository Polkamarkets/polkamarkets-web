import { Link } from 'react-router-dom';

import { environment } from 'config';
import CommunityCard from 'containers/CommunityCard';
import { useGetLandsQuery } from 'services/Polkamarkets';
import { Button } from 'ui';

import styles from './Communities.module.scss';

function Communities() {
  const {
    data: lands,
    isLoading: isLoadingLands,
    isFetching: isFetchingLands
  } = useGetLandsQuery({ token: environment.FEATURE_FANTASY_TOKEN_TICKER });

  const isLoadingGetLandsQuery = isLoadingLands || isFetchingLands;

  if (isLoadingGetLandsQuery) {
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );
  }

  const visibleLands = lands?.slice(0, 12);

  return (
    <>
      <div className={styles.root}>
        {visibleLands?.map(land => (
          <CommunityCard land={land} key={land.id} />
        ))}
      </div>
      <div className={styles.footer}>
        <Link to="/communities">
          <Button size="lg" color="primary gray" variant="outlined">
            View all Communities
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Communities;
