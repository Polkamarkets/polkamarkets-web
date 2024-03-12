import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { setSorter } from 'redux/ducks/markets';
import { Button } from 'ui';

import { Icon, MarketList } from 'components';

import { Dropdowns, filtersInitialState } from 'contexts/filters';

import { useAppDispatch, useFilters } from 'hooks';

import styles from './Questions.module.scss';

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

  return (
    <>
      <MarketList filtersVisible={false} maxVisibleItems={6} />
      <div className={styles.footer}>
        <Link to="/questions">
          <Button
            size="lg"
            color="primary gray"
            variant="outlined"
            itemEnd={
              <Icon
                name="Arrow"
                dir="right"
                className={styles.footerButtonIcon}
              />
            }
          >
            View all Questions
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Questions;
