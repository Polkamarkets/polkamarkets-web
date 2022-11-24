import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
  setSearchQuery,
  setSorter,
  setSorterByEndingSoon
} from 'redux/ducks/markets';
import { closeRightSidebar } from 'redux/ducks/ui';
import { useMedia } from 'ui';

import { Button, Filter, SearchBar } from 'components';

import { useAppDispatch } from 'hooks';

import HomeNavFilter from './HomeNavFilter';
import { filters } from './utils';

function CreateMarket() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const handleNavigateToCreateMarket = useCallback(() => {
    dispatch(closeRightSidebar());
    history.push('/market/create');
  }, [dispatch, history]);

  return (
    <Button
      className="pm-p-home__navigation__actions"
      color="primary"
      size="sm"
      onClick={handleNavigateToCreateMarket}
    >
      Create Market
    </Button>
  );
}
export default function HomeNav() {
  const isDesktop = useMedia('(min-width: 1024px)');
  const dispatch = useAppDispatch();
  const handleTouchedFilter = useCallback(
    (touched: boolean) => {
      dispatch(setSorterByEndingSoon(!touched));
    },
    [dispatch]
  );
  const handleSearch = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
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
      {isDesktop && <CreateMarket />}
      <SearchBar
        name="Search Markets"
        placeholder="Search markets"
        onSearch={handleSearch}
        className={{ form: 'pm-p-home__navigation__actions' }}
      />
      <Filter
        className="pm-p-home__navigation__actions"
        description="Sort by"
        defaultOption="volumeEur"
        options={filters}
        onChange={handleSelectedFilter}
        onTouch={handleTouchedFilter}
      />
      <HomeNavFilter isDesktop={isDesktop} />
    </div>
  );
}
