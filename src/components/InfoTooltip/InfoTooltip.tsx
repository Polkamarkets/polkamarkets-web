import { InfoIcon } from 'assets/icons';

import Tooltip from 'components/Tooltip';
import type { TooltipProps } from 'components/Tooltip/Tooltip';

import classes from './InfoTooltip.module.scss';

export default function InfoTooltip(
  props: Omit<TooltipProps, 'children' | 'className'>
) {
  return (
    <span className={classes.wrapper}>
      <Tooltip className={classes.root} {...props}>
        <InfoIcon className={classes.icon} />
      </Tooltip>
    </span>
  );
}
