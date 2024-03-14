import { Link } from 'react-router-dom';

import { environment } from 'config';
import CommunityCard from 'containers/CommunityCard';
import isEmpty from 'lodash/isEmpty';
import { useGetLandsQuery } from 'services/Polkamarkets';
import { Button } from 'ui';

import { AlertMini } from 'components';

import styles from './Communities.module.scss';

type CommunitiesProps = {
  viewMode?: 'default' | 'compact';
};

function Communities({ viewMode = 'default' }: CommunitiesProps) {
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

  if (!isLoadingGetLandsQuery && isEmpty(lands)) {
    return (
      <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-small">
        <AlertMini
          style={{ border: 'none' }}
          styles="outline"
          variant="information"
          description="No communities available at the moment."
        />
      </div>
    );
  }

  const visibleLands = viewMode === 'compact' ? lands?.slice(0, 12) : lands;

  return (
    <>
      <div className={styles.root}>
        {visibleLands?.map(land => (
          <CommunityCard land={land} key={land.id} />
        ))}
      </div>
      {viewMode === 'compact' && (
        <div className={styles.footer}>
          <Link to="/communities">
            <Button size="lg" color="primary gray" variant="outlined">
              View all Communities
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Communities;
