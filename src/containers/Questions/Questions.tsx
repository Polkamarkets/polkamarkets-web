import { useEffect } from 'react';

import { setSorter } from 'redux/ducks/markets';

import { MarketList } from 'components';

import { Dropdowns, filtersInitialState } from 'contexts/filters';

import { useAppDispatch, useFilters } from 'hooks';

function Questions() {
  const dispatch = useAppDispatch();
  const { controls } = useFilters();
  const { updateDropdown } = controls;

  useEffect(() => {
    updateDropdown({
      dropdown: Dropdowns.STATES,
      state: []
    });

    return () => {
      updateDropdown({
        dropdown: Dropdowns.STATES,
        state: filtersInitialState.dropdowns.states
      });
    };
  }, [updateDropdown]);

  useEffect(() => {
    dispatch(
      setSorter({
        value: 'createdAt',
        sortBy: 'desc'
      })
    );
  }, [dispatch]);

  return <MarketList filtersVisible={false} />;
}

export default Questions;
