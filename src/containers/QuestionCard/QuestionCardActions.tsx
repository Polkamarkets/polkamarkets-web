import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';

import { Button, Icon } from 'components';

import { useFantasyTokenTicker } from 'hooks';

import styles from './QuestionCardActions.module.scss';

type QuestionCardActionsProps = {
  market: Market;
};

function QuestionCardActions({ market }: QuestionCardActionsProps) {
  const fantasyTokenTicker = useFantasyTokenTicker();
  return (
    <div className={styles.actions}>
      <Button size="sm" color="noborder" className={styles.actionsButton}>
        <Icon name="Comment" />
        421
      </Button>
      <Button size="sm" color="noborder" className={styles.actionsButton}>
        <Icon name="BarChart" />
        <strong>{roundNumber(market.volume, 3)}</strong>
        {fantasyTokenTicker || market.token.ticker}
      </Button>
      <Button size="sm" color="noborder" className={styles.actionsButton}>
        <Icon name="Heart" />
        563
      </Button>
      <Button size="sm" color="noborder" className={styles.actionsButton}>
        <Icon name="MoreHorizontal" />
      </Button>
    </div>
  );
}

export default QuestionCardActions;
