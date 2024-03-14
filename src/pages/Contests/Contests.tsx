import { Contests } from 'containers';

import { Icon, Tooltip } from 'components';

import styles from './Contests.module.scss';

function ContestsPage() {
  return (
    <div className="max-width-screen-lg">
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contests</h1>
          <Tooltip text="Info">
            <Icon name="Info" className={styles.headerIcon} />
          </Tooltip>
        </div>
        <Contests />
      </div>
    </div>
  );
}

export default ContestsPage;
