/* eslint-disable import/prefer-default-export */
import { roundNumber } from 'helpers/math';

import { InfoIcon } from 'assets/icons';

import Tooltip from 'components/Tooltip';

import Icon from '../Icon';
import Text from '../Text';
import styles from './Trade.module.scss';

type ProbabilityRowRenderArgs = {
  from: number;
  to: number;
};

function probabilityRowRender({ from, to }: ProbabilityRowRenderArgs) {
  return (
    <div className="flex-row align-center gap-2">
      <Text as="span" scale="caption" fontWeight="bold">
        {roundNumber(from * 100, 2)}%
      </Text>
      <Icon
        name="Arrow"
        size="sm"
        dir="right"
        className={styles.detailsProbabilityArrow}
      />
      <Text as="strong" scale="caption" fontWeight="bold">
        {roundNumber(to * 100, 2)}%
      </Text>
    </div>
  );
}

function formatTradeDetails({
  type,
  priceFrom,
  priceTo,
  maxStake,
  maxROI,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shares,
  ticker,
  totalStake
}) {
  return [
    {
      key: 'probability',
      title: (
        <>
          Probability{' '}
          <Tooltip
            className={styles.tooltip}
            text="How does the outcome's likelihood of occurring vary with your prediction."
          >
            <InfoIcon className={styles.tooltipIcon} />
          </Tooltip>
        </>
      ),
      value: { from: priceFrom, to: priceTo },
      render: probabilityRowRender
    },
    type === 'buy'
      ? {
          key: 'payout',
          title: (
            <>
              Max Payout{' '}
              <Tooltip
                className={styles.tooltip}
                text="Maximum payout if your prediction is correct."
              >
                <InfoIcon className={styles.tooltipIcon} />
              </Tooltip>
            </>
          ),
          value: `${roundNumber(maxStake, 3)} ${ticker} (+${roundNumber(
            maxROI,
            2
          )}%)`
        }
      : {
          key: 'shares',
          title: 'Total Stake',
          value: `${roundNumber(totalStake, 3)} ${ticker}`
        }
  ];
}

export { formatTradeDetails };
