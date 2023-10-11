import { useCallback, useState } from 'react';

import { features } from 'config';
import { setSorter, setSearchQuery } from 'redux/ducks/markets';
import { useTheme } from 'ui';

import { Button, Filter, Icon, SearchBar } from 'components';
import { FilterProps } from 'components/Filter/Filter';

import { useAppDispatch, useAppSelector } from 'hooks';
import useMarkets from 'hooks/useMarkets';

import { filters } from '../Home/utils';
import styles from './TournamentNav.module.scss';

type TournamentNavProps = {
  onFilterClick(): void;
};

export default function TournamentNav({ onFilterClick }: TournamentNavProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const markets = useMarkets();
  const searchQuery = useAppSelector(state => state.markets.searchQuery);
  const handleSelectedFilter: FilterProps['onChange'] = useCallback(
    filter =>
      dispatch(
        setSorter({
          value: filter.value,
          sortBy: filter.optionalTrigger
        })
      ),
    [dispatch]
  );
  const [searchValue, setSearchValue] = useState(() => searchQuery);
  const handleSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(setSearchQuery(searchValue));
    },
    [dispatch, searchValue]
  );
  const handleDispatchSearch = useCallback(
    (value: string) => dispatch(setSearchQuery(value)),
    [dispatch]
  );
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setSearchValue(value);

      if (!value) handleDispatchSearch(value);
    },
    [handleDispatchSearch]
  );

  const filterDisabled = ['loading', 'error', 'canceled'].includes(
    markets.state
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onFilterClick}
        disabled={filterDisabled}
        className={styles.navAction}
      >
        <Icon
          name="Filter"
          {...(!theme.device.isDesktop && {
            title: 'Filter'
          })}
        />
        {theme.device.isDesktop && 'Filter'}
      </Button>
      <SearchBar
        size="sm"
        name="Search Markets"
        placeholder="Search markets"
        onSearch={handleSearch}
        onChange={handleSearchChange}
        value={searchValue}
      />
      <Filter
        description="Sort by"
        defaultOption={features.fantasy.enabled ? 'expiresAt' : 'liquidityEur'}
        options={filters}
        onChange={handleSelectedFilter}
      />
    </>
  );
}
