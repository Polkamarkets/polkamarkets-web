import { Link } from 'react-router-dom';

import { environment } from 'config';
import LandCard from 'containers/LandCard';
import isEmpty from 'lodash/isEmpty';
import { useGetLandsQuery } from 'services/Polkamarkets';
import { Button } from 'ui';

import { AlertMini, Icon } from 'components';

import styles from './Lands.module.scss';

type LandsProps = {
  viewMode?: 'default' | 'compact';
};

function Lands({ viewMode = 'default' }: LandsProps) {
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
          description="No lands available at the moment."
        />
      </div>
    );
  }

  const visibleLands = viewMode === 'compact' ? lands?.slice(0, 12) : lands;

  return (
    <>
      <div className={styles.root}>
        {visibleLands?.map(land => (
          <LandCard land={land} key={land.id} />
        ))}
      </div>
      {viewMode === 'compact' && (
        <div className={styles.footer}>
          <Link to="/lands">
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
              View all Lands
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Lands;
