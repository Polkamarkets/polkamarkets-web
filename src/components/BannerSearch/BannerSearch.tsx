import { FormEvent, useState } from 'react';

import { Button, Filter, Icon, SearchBar } from 'components';

import styles from './BannerSearch.module.scss';

const filters = [
  {
    value: 'newest',
    name: 'Newest'
  },
  {
    value: 'joined',
    name: 'Joined'
  }
];

export type BannerSearchProps = {};

function BannerSearch() {
  const handleSearch = (value: FormEvent<HTMLFormElement>) => {};
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {};
  const [searchValue, setSearchValue] = useState('');
  const handleSelectedFilter = (filter: { value: string; name: string }) => {};
  return (
    <div className={styles.bannerSearch}>
      <div className={styles.banner}>
        <h3>communities</h3>
        <h1>
          Predict, Play <br />& Collect Rewards.
        </h1>

        <Button color="primary" size="sm">
          <Icon name="Plus" />
          Create a Community
        </Button>
      </div>

      <div className={styles.search}>
        <SearchBar
          size="sm"
          name="Search communities"
          placeholder="Search communities"
          onSearch={handleSearch}
          onChange={handleSearchChange}
          value={searchValue}
        />
        <Filter
          description="Sort by"
          defaultOption="newest"
          options={filters}
          onChange={handleSelectedFilter}
        />
      </div>
    </div>
  );
}

export default BannerSearch;
