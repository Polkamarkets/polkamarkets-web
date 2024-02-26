import { useState } from 'react';

import classNames from 'classnames';
import { environment } from 'config';
import { useGetLandsQuery } from 'services/Polkamarkets';
import { Container } from 'ui';

import BannerSearch from 'components/BannerSearch';

import styles from './Home.module.scss';
import HomeCommunityLands from './HomeCommunityLands';

const filters = [
  {
    value: 'newest',
    name: 'Newest'
  },
  {
    value: 'trending',
    name: 'Trending'
  },
  {
    value: 'most-followed',
    name: 'Most Followed'
  }
];

function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
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

  const filteredLands = searchValue
    ? lands?.filter(land =>
        land.title.toLowerCase().includes(searchValue.toLowerCase())
      ) || []
    : lands || [];

  let sortedLands = filteredLands;

  if (selectedFilter.value === 'most-followed') {
    sortedLands = [...filteredLands].sort((a, b) => b.users - a.users);
  }
  if (selectedFilter.value === 'trending') {
    sortedLands = [...filteredLands].sort((a, b) => {
      return (
        (b.tournaments?.filter(t => Date.parse(t.expiresAt) >= Date.now())
          .length || 0) -
        (a.tournaments?.filter(t => Date.parse(t.expiresAt) >= Date.now())
          .length || 0)
      );
    });
  }

  return (
    <Container className={classNames('max-width-screen-xl', styles.root)}>
      <BannerSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        defaultFilter={selectedFilter.value}
        onSelectedFilter={setSelectedFilter}
      />
      <HomeCommunityLands lands={sortedLands} />
    </Container>
  );
}

export default Home;
