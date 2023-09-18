import { useMemo } from 'react';

import { roundNumber } from 'helpers/math';
import isUndefined from 'lodash/isUndefined';
import reject from 'lodash/reject';

import { InfoIcon, TrophyIcon } from 'assets/icons';

import Badge, { BadgeColor } from '../Badge';
import MiniTable, { MiniTableRow } from '../MiniTable';
import ProgressBar, { ProgressBarColor } from '../ProgressBar';
import Ribbon, { RibbonColor } from '../Ribbon';
import Tooltip from '../Tooltip';

export type OutcomeState =
  | 'default'
  | 'selected'
  | 'success'
  | 'warning'
  | 'error'
  | 'won';

type OutcomeProps = {
  /**
   * Unique id of the outcome
   */
  id: string;
  /**
   * Title of the outcome
   */
  title: string;
  /**
   * Color of the title indicator and progress bar
   * @default 'POLK'
   */
  color: BadgeColor;
  /**
   * Help text applied to title
   */
  helpText?: string;
  /**
   * Shares value
   */
  shares?: number;
  /**
   * Bond value
   */
  bond?: number;
  /**
   * Currency ticker
   */
  ticker?: string;
  /**
   * Percentage of the progress bar
   */
  progress?: number;
  /**
   * Current outcome state
   * @default 'default'
   */
  state?: OutcomeState;
  resolvedOutcomeId: number;
  marketQuestionFinalized: boolean;
  isStarted: boolean;
  onSelect: (_id: string) => void;
};

function Outcome({
  id,
  title,
  color,
  helpText,
  shares,
  ticker = 'POLK',
  progress,
  state = 'default',
  resolvedOutcomeId,
  marketQuestionFinalized,
  bond = 0,
  onSelect,
  isStarted
}: OutcomeProps) {
  const isWinningOutcome = isStarted && resolvedOutcomeId.toString() === id;

  const miniTableRows = useMemo(() => {
    const rows = [
      !isUndefined(shares)
        ? {
            key: 'myShares',
            title: 'Your  Shares',
            value: roundNumber(shares, 3)
          }
        : shares,
      !isUndefined(bond)
        ? {
            key: 'myBond',
            title: 'Your Bond',
            value: `${roundNumber(bond, 3)} ${ticker}`
          }
        : bond
    ];

    return reject(rows, isUndefined) as MiniTableRow[];
  }, [shares, bond, ticker]);

  function handleSelectOutcome() {
    onSelect(id);
  }

  return (
    <div
      className={`pm-c-outcome--${state}`}
      role="button"
      tabIndex={0}
      onClick={handleSelectOutcome}
      onKeyPress={handleSelectOutcome}
      style={{ pointerEvents: marketQuestionFinalized ? 'none' : 'all' }}
    >
      <div className="pm-c-outcome__header">
        <div className="pm-c-outcome__row-group">
          <Badge variant="normal" label={title} color={color} />
          {helpText ? (
            <Tooltip position="top" text={helpText}>
              <InfoIcon />
            </Tooltip>
          ) : null}
        </div>
        {isWinningOutcome ? (
          <Ribbon
            icon={<TrophyIcon />}
            // text={marketQuestionFinalized ? 'WON' : 'WINNING'} // text disabled
            color={
              marketQuestionFinalized
                ? ('success' as RibbonColor)
                : (color as RibbonColor)
            }
          />
        ) : null}
      </div>
      <MiniTable rows={miniTableRows} />
      {progress ? (
        <div className="pm-c-outcome__progress">
          <ProgressBar percent={progress} color={color as ProgressBarColor} />
        </div>
      ) : null}
    </div>
  );
}

export default Outcome;
