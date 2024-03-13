import { Questions } from 'containers';

import { Icon, Tooltip } from 'components';

import styles from './Questions.module.scss';

function QuestionsPage() {
  return (
    <div className="max-width-screen-lg">
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>Questions</h1>
          <Tooltip text="Info">
            <Icon name="Info" className={styles.headerIcon} />
          </Tooltip>
        </div>
        <Questions />
      </div>
    </div>
  );
}

export default QuestionsPage;
