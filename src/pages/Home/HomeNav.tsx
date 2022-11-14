import { useCallback } from 'react';

import { setSorter, setSorterByEndingSoon } from 'redux/ducks/markets';

import { Button, Filter, SearchBar } from 'components';

import { useAppDispatch } from 'hooks';

import HomeNavFilter from './HomeNavFilter';
import { filters } from './utils';

export default function HomeNav() {
  const dispatch = useAppDispatch();
  const handleTouchedFilter = useCallback(
    (touched: boolean) => {
      dispatch(setSorterByEndingSoon(!touched));
    },
    [dispatch]
  );

  function handleSelectedFilter(filter: {
    value: string | number;
    optionalTrigger?: string;
  }) {
    dispatch(
      setSorter({ value: filter.value, sortBy: filter.optionalTrigger })
    );
  }

  return (
    <div className="pm-p-home__navigation">
      <HomeNavFilter />
      <SearchBar
        name="Search Markets"
        placeholder="Search markets"
        onSearch={() => {}}
        className="pm-p-home__navigation__actions"
      />
      <Filter
        description="Sort by"
        defaultOption="volumeEur"
        options={filters}
        onChange={handleSelectedFilter}
        onTouch={handleTouchedFilter}
        className="pm-p-home__navigation__actions"
      />
      <Button color="primary" size="sm">
        Create Market
      </Button>
    </div>
  );
}
