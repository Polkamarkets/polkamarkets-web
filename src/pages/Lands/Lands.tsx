import { Lands } from 'containers';
import * as Tooltip from 'ui/Tooltip/Tooltip';

import { Icon } from 'components';

import styles from './Lands.module.scss';

function LandsPage() {
  return (
    <div className="max-width-screen-lg">
      <div className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.title}>Lands</h1>
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <span>
                  <Icon name="Info" size="md" color="#768393" />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="right" sideOffset={4}>
                  <span className={styles.tooltipTitle}>What is a Land?</span>
                  <div className={styles.tooltipContent}>
                    Lands are Foreland Communities where anyone can join, claim
                    their unique play-money Tokens to compete on their
                    prediction contests for the winner’s rewards.
                  </div>
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <Lands />
      </div>
    </div>
  );
}

export default LandsPage;
