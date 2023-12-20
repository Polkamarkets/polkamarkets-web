import { createContext, useCallback, useMemo, useReducer } from 'react';

import { environment, ui } from 'config';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';
import { useGetTournamentsQuery } from 'services/Polkamarkets';

import { useNetworks } from '../networks';
import filtersReducer from './filters.reducer';
import {
  FiltersActions,
  FiltersContextState,
  UpdateTogglePayload,
  UpdateDropdownPayload
} from './filters.type';
import {
  addExtraFilters,
  addNetworks,
  addTournaments,
  filtersInitialState
} from './filters.util';

const FiltersContext = createContext<FiltersContextState>(
  {} as FiltersContextState
);

function FiltersProvider({ children }) {
  const { networks } = useNetworks();

  const { data: tournaments } = useGetTournamentsQuery(
    { token: environment.FEATURE_FANTASY_TOKEN_TICKER },
    {
      skip: !ui.filters.tournaments.enabled
    }
  );

  const filtersWithNetworks = useMemo(() => addNetworks(networks), [networks]);
  const filtersWithTournaments = useMemo(
    () => addTournaments(tournaments),
    [tournaments]
  );
  const filtersWithExtraFilters = useMemo(() => addExtraFilters(), []);

  const filters = useMemo(
    () =>
      merge(
        filtersWithNetworks,
        filtersWithTournaments,
        filtersWithExtraFilters
      ),
    [filtersWithExtraFilters, filtersWithNetworks, filtersWithTournaments]
  );

  const [filtersState, dispatch] = useReducer(
    filtersReducer,
    filtersInitialState
  );

  const updateToggle = useCallback(({ toggle, state }: UpdateTogglePayload) => {
    dispatch({
      type: FiltersActions.UPDATE_TOGGLE,
      payload: { toggle, state }
    });
  }, []);

  const updateDropdown = useCallback(
    ({ dropdown, state }: UpdateDropdownPayload) => {
      dispatch({
        type: FiltersActions.UPDATE_DROPDOWN,
        payload: { dropdown, state }
      });
    },
    []
  );

  const toggles = pickBy(filters.toggles, value => value.enabled);
  const dropdowns = pickBy(filters.dropdowns, value => value.enabled);

  return (
    <FiltersContext.Provider
      value={{
        filters: {
          toggles,
          dropdowns
        },
        state: {
          toggles: pickBy(filtersState.toggles, (_value, key) =>
            Object.keys(toggles).includes(key)
          ),
          dropdowns: pickBy(filtersState.dropdowns, (_value, key) =>
            Object.keys(dropdowns).includes(key)
          )
        },
        controls: {
          updateToggle,
          updateDropdown
        }
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export { FiltersContext, FiltersProvider };
