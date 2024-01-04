import { useCallback, useState } from 'react';

import { features, ui } from 'config';
import { setSorter, setSearchQuery } from 'redux/ducks/markets';
import { useTheme } from 'ui';

import {
  Button,
  CreateMarket,
  Feature,
  Filter,
  Icon,
  SearchBar
} from 'components';
import { FilterProps } from 'components/Filter/Filter';

import { useAppDispatch, useAppSelector } from 'hooks';
import useMarkets from 'hooks/useMarkets';

import styles from './Markets.module.scss';
import { filters } from './utils';

type MarketsNavProps = {
  onFilterClick(): void;
};

export default function MarketsNav({ onFilterClick }: MarketsNavProps) {
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
      {ui.filters.enabled ? (
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
      ) : null}
      <SearchBar
        size="sm"
        name={`Search ${features.fantasy.enabled ? 'Questions' : 'Markets'}`}
        placeholder={`Search ${
          features.fantasy.enabled ? 'questions' : 'markets'
        }`}
        onSearch={handleSearch}
        onChange={handleSearchChange}
        value={searchValue}
      />
      <Filter
        description="Sort by"
        defaultOption={features.fantasy.enabled ? 'createdAt' : 'liquidityEur'}
        options={filters}
        onChange={handleSelectedFilter}
      />
      {theme.device.isDesktop && (
        <Feature name="regular">
          <CreateMarket />
        </Feature>
      )}
    </>
  );
}
