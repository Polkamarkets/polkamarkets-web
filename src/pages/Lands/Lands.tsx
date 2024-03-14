import { Lands } from 'containers';

import { Icon, Tooltip } from 'components';

import styles from './Lands.module.scss';

function LandsPage() {
  return (
    <div className="max-width-screen-lg">
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>Lands</h1>
          <Tooltip text="Info">
            <Icon name="Info" className={styles.headerIcon} />
          </Tooltip>
        </div>
        <Lands />
      </div>
    </div>
  );
}

export default LandsPage;
