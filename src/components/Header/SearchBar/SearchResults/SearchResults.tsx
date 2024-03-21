import { useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';

import { Market } from 'models/market';
import { GetLandsData, GetTournamentsData } from 'services/Polkamarkets/types';
import { Spinner } from 'ui';

import { ContestItem } from './ContestItem/ContestItem';
import { LandItem } from './LandItem/LandItem';
import { QuestionItem } from './QuestionItem/QuestionItem';
import styles from './SearchResults.module.scss';

export type SearchResultsProps = {
  searchValue: string;
  lands?: GetLandsData;
  contests?: GetTournamentsData;
  questions?: Market[];
  loading?: boolean;
  onClose?: () => void;
};
export const SearchResults: React.FC<SearchResultsProps> = ({
  searchValue,
  loading,
  lands,
  contests,
  questions,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.loadingRoot}>
          <Spinner $size="md" />
          Loading...
        </div>
      </div>
    );
  }

  const filteredLands =
    lands?.filter(land =>
      searchValue
        .split(' ')
        .some(word => land.title.toLowerCase().includes(word.toLowerCase()))
    ) || [];
  const filteredContests =
    contests?.filter(contest =>
      searchValue
        .split(' ')
        .some(word => contest.title.toLowerCase().includes(word.toLowerCase()))
    ) || [];
  const filteredQuestions =
    questions?.filter(question =>
      searchValue
        .split(' ')
        .some(word => question.title.toLowerCase().includes(word.toLowerCase()))
    ) || [];
  return (
    <div className={styles.root}>
      <Tabs className={styles.tabs}>
        <TabList className={styles.tabList} aria-label="Discover">
          <Tab className={styles.tab} id="lands">
            Lands
          </Tab>
          <Tab className={styles.tab} id="contests">
            Contests
          </Tab>
          <Tab className={styles.tab} id="questions">
            Questions
          </Tab>
        </TabList>
        <TabPanel className={styles.tabPanel} id="lands">
          {filteredLands.length === 0 ? (
            <div className={styles.noResults}>No lands found</div>
          ) : null}
          {filteredLands.map(land => (
            <LandItem key={land.id} land={land} />
          ))}
        </TabPanel>
        <TabPanel className={styles.tabPanel} id="contests">
          {filteredContests.length === 0 ? (
            <div className={styles.noResults}>No contests found</div>
          ) : null}
          {filteredContests.map(contest => (
            <ContestItem key={contest.id} contest={contest} />
          ))}
        </TabPanel>
        <TabPanel className={styles.tabPanel} id="questions">
          {filteredQuestions.length === 0 ? (
            <div className={styles.noResults}>No questions found</div>
          ) : null}
          {filteredQuestions.map(question => (
            <QuestionItem key={question.id} question={question} />
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SearchResults;
