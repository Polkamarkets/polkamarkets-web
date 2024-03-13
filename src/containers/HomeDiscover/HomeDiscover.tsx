import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';

import classNames from 'classnames';
import Communities from 'containers/Communities';
import Contests from 'containers/Contests';
import Questions from 'containers/Questions';

import styles from './HomeDiscover.module.scss';

function HomeDiscover() {
  return (
    <div className={classNames('max-width-screen-lg', styles.root)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Discover</h2>
      </div>
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
          <Communities />
        </TabPanel>
        <TabPanel className={styles.tabPanel} id="contests">
          <Contests viewMode="compact" />
        </TabPanel>
        <TabPanel className={styles.tabPanel} id="questions">
          <Questions />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default HomeDiscover;
