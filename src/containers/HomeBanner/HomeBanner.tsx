import { Button } from 'ui';

import styles from './HomeBanner.module.scss';

function HomeBanner() {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h1 className={styles.title}>Predict, Play, and Collect Rewards.</h1>
        <p className={styles.description}>
          Unleash the Power of your Predictions.
        </p>
        <p className={styles.description}>Turn insights into real prizes.</p>
      </div>
      <Button size="lg">Sign up to Play</Button>
    </div>
  );
}

export default HomeBanner;
