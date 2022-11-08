import { roundNumber } from 'helpers/math';
import isUndefined from 'lodash/isUndefined';
import { Line } from 'rc-progress';

import Text from '../Text';

export type ProgressBarColor =
  | 'pink'
  | 'blue'
  | 'success'
  | 'warning'
  | 'danger';

type ProgressBarProps = {
  min?: number;
  max?: number;
  /**
   * Completion percentage
   */
  percent: number;
  /**
   * The color of progress bar
   * @default 'blue'
   */
  color?: ProgressBarColor;
};

/**
 * Display the current progress of an operation flow
 */
function ProgressBar({ min, max, percent, color = 'blue' }: ProgressBarProps) {
  const isValidParam = value => !isUndefined(value) && value >= 0;
  const hasValidParams = [min, max].every(isValidParam);

  return (
    <div className="pm-c-progress-bar__group--column">
      <Line
        percent={percent}
        trailWidth={2.4}
        strokeWidth={2.4}
        className={`pm-c-progress-bar--${color}`}
      />
      {hasValidParams && !isUndefined(min) && !isUndefined(max) ? (
        <div className="pm-c-progress-bar__group--row">
          <Text
            as="span"
            scale="tiny"
            fontWeight="semibold"
            className="pm-c-progress-bar__min"
          >
            {min}
          </Text>
          <Text
            as="span"
            scale="tiny"
            fontWeight="semibold"
            className="pm-c-progress-bar__max"
          >
            <>
              <Text
                as="strong"
                scale="tiny"
                fontWeight="semibold"
                className="pm-c-progress-bar__current"
              >
                {roundNumber(max * (percent / 100), 2)}
              </Text>
              {` / ${max}`}
            </>
          </Text>
        </div>
      ) : null}
    </div>
  );
}

export default ProgressBar;
