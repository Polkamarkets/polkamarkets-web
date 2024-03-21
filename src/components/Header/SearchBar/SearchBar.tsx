import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import { environment } from 'config';
import { Market } from 'models/market';
import {
  useGetLandsQuery,
  useGetTournamentsQuery
} from 'services/Polkamarkets';
import * as marketService from 'services/Polkamarkets/market';

import Icon from 'components/Icon';

import styles from './SearchBar.module.scss';
import { SearchResults } from './SearchResults/SearchResults';

export type SearchBarProps = { className?: string };
export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
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
  const handleClear = () => {
    setSearch('');
    inputRef.current?.focus();
  };
  return (
    <div className={cn(styles.root, className)}>
      <Icon name="Search" size="md" title="Search" />
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
      {search && (
        <SearchResults
          searchValue={search}
          lands={lands}
          contests={contests}
          questions={questions}
          loading={isLoading}
          onClose={() => setSearch('')}
        />
      )}
    </div>
  );
};

export default SearchBar;
