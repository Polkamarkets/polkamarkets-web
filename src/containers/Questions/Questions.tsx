import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { setSorter } from 'redux/ducks/markets';
import { Button } from 'ui';

import { Icon, MarketList } from 'components';

import { Dropdowns, filtersInitialState } from 'contexts/filters';

import { useAppDispatch, useFilters } from 'hooks';

import styles from './Questions.module.scss';

type QuestionsProps = {
  viewMode?: 'default' | 'compact';
};

function Questions({ viewMode = 'default' }: QuestionsProps) {
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

  const maxVisibleItems = viewMode === 'compact' ? 6 : undefined;

  return (
    <>
      <MarketList filtersVisible={false} maxVisibleItems={maxVisibleItems} />
      {viewMode === 'compact' && (
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
      )}
    </>
  );
}

export default Questions;
