import { environment } from 'config';
import CommunityCard from 'containers/CommunityCard';
import { useGetLandsQuery } from 'services/Polkamarkets';

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

  return (
    <div className={styles.root}>
      {lands?.map(land => (
        <CommunityCard land={land} key={land.id} />
      ))}
    </div>
  );
}

export default Communities;
