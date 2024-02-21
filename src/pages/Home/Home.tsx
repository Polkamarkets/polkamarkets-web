import classNames from 'classnames';
import { environment } from 'config';
import { useGetLandsQuery } from 'services/Polkamarkets';
import { Container } from 'ui';

import BannerSearch from 'components/BannerSearch';

import styles from './Home.module.scss';
import HomeCommunityLands from './HomeCommunityLands';

function Home() {
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
    <Container className={classNames('max-width-screen-xl', styles.root)}>
      <BannerSearch />
      <HomeCommunityLands lands={lands || []} />
    </Container>
  );
}

export default Home;
