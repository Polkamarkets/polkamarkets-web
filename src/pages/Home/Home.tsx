import classNames from 'classnames';
import { HomeBanner, HomeDiscover } from 'containers';
import { Container } from 'ui';

import styles from './Home.module.scss';

function Home() {
  return (
    <Container className={classNames(styles.root)}>
      <div className={styles.heroSection}>
        <div
          className={styles.heroImage}
          style={
            {
              '--background-image': 'url(/images/home-banner.png)'
            } as React.CSSProperties
          }
        />
        <div className={styles.heroGradientOverlay} />
        <div className={styles.heroTopGradientOverlay} />
      </div>
      <div className={classNames('max-width-screen-xl', styles.content)}>
        <HomeBanner />
        <HomeDiscover />
      </div>
    </Container>
  );
}

export default Home;
