import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';

import styles from './HomeDiscover.module.scss';

function HomeDiscover() {
  return (
    <div className={styles.root}>
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
        </TabList>
        <TabPanel className={styles.tabPanel} id="lands" />
        <TabPanel className={styles.tabPanel} id="contests" />
      </Tabs>
    </div>
  );
}

export default HomeDiscover;
