import { CSSProperties, FormEvent } from 'react';

import { ui } from 'config';

import { Button, Filter, Icon, SearchBar } from 'components';

import styles from './BannerSearch.module.scss';

type BannerSearchProps = {
  onSearchChange?(value: string): void;
  onSelectedFilter?(filter: { value: string; name: string }): void;
  searchValue: string;
  filters: { value: string; name: string }[];
  defaultFilter?: string;
};

function BannerSearch({
  onSearchChange,
  onSelectedFilter,
  searchValue,
  filters,
  defaultFilter
}: BannerSearchProps) {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };
  const handleSelectedFilter = (filter: { value: string; name: string }) => {
    onSelectedFilter?.(filter);
  };
  return (
    <div className={styles.bannerSearch}>
      <div
        className={styles.banner}
        style={
          {
            '--background-image': `url(${
              ui.hero.image || '/images/home-banner.png'
            })`
          } as CSSProperties
        }
      >
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
          defaultOption={defaultFilter || filters[0].value}
          options={filters}
          onChange={handleSelectedFilter}
        />
      </div>
    </div>
  );
}

export default BannerSearch;
