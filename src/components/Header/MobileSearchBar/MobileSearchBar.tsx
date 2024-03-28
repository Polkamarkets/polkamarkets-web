/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import cn from 'classnames';
import { environment } from 'config';
import { Market } from 'models/market';
import {
  useGetLandsQuery,
  useGetTournamentsQuery
} from 'services/Polkamarkets';
import * as marketService from 'services/Polkamarkets/market';

import { Icon } from 'components';

import { SearchResults } from '../SearchBar/SearchResults/SearchResults';
import styles from './MobileSearchBar.module.scss';

export type MobileSearchBarProps = { className?: string };
export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  className
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const handleClear = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);
  const [questions, setQuestions] = useState<Market[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const {
    data: lands,
    isLoading: isLoadingLands,
    isFetching: isFetchingLands
  } = useGetLandsQuery({ token: environment.FEATURE_FANTASY_TOKEN_TICKER });

  const {
    data: contests,
    isFetching: isFetchingContests,
    isLoading: isLoadingContests
  } = useGetTournamentsQuery({
    token: environment.FEATURE_FANTASY_TOKEN_TICKER
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestionsLoading(true);
      const questionsResult = await Promise.all([
        marketService.getMarkets({
          state: 'open'
        }),
        marketService.getMarkets({
          state: 'closed'
        }),
        marketService.getMarkets({
          state: 'resolved'
        })
      ]);
      setQuestions([
        ...questionsResult[0].data,
        ...questionsResult[1].data,
        ...questionsResult[2].data
      ]);
      setQuestionsLoading(false);
    };
    fetchQuestions();
  }, []);

  const isLoading =
    isLoadingLands ||
    isFetchingLands ||
    isLoadingContests ||
    isFetchingContests ||
    questionsLoading;
  return (
    <>
      <Icon name="Search" size="lg" onClick={() => setOpen(true)} />
      {createPortal(
        <div
          className={cn(
            styles.root,
            {
              [styles.open]: open,
              [styles.closed]: !open
            },
            className
          )}
        >
          <div className={styles.topBar}>
            <div className={styles.input}>
              <Icon name="Search" size="md" title="Search" color="#9AA4B2" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                ref={inputRef}
              />
              {search && (
                <Icon
                  name="TimesFull"
                  className={styles.clearIcon}
                  onClick={handleClear}
                />
              )}
            </div>
            <span onClick={() => setOpen(false)} className={styles.cancel}>
              Cancel
            </span>
          </div>

          <SearchResults
            searchValue={search}
            className={styles.searchResults}
            loading={isLoading}
            lands={lands}
            contests={contests}
            questions={questions}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default MobileSearchBar;
