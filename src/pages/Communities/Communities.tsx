import { Communities } from 'containers';

import { Icon, Tooltip } from 'components';

import styles from './Communities.module.scss';

function CommunitiesPage() {
  return (
    <div className="max-width-screen-xl">
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>Lands</h1>
          <Tooltip text="Info">
            <Icon name="Info" className={styles.headerIcon} />
          </Tooltip>
        </div>
        <Communities />
      </div>
    </div>
  );
}

export default CommunitiesPage;
