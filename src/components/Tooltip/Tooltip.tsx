import React from 'react';
import { Config, usePopperTooltip } from 'react-popper-tooltip';

import classNames from 'classnames';

type TooltipPosition =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

type TooltipProps = {
  interactive?: Config['interactive'];
  delayHide?: Config['delayHide'];
  /**
   * The position of the tooltip relative to the target
   */
  position?: TooltipPosition;
  text: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /**
   * The tooltip is disabled or not
   */
  disabled?: boolean;
};

/**
 * A Tooltip is a small piece of contextual information about an element on the screen
 */
function Tooltip({
  interactive,
  delayHide,
  position = 'top',
  text,
  children,
  className,
  disabled = false
}: TooltipProps) {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible
  } = usePopperTooltip({
    placement: position,
    delayHide,
    interactive
  });
  return (
    <>
      <div ref={setTriggerRef} className="pm-c-tooltip__wrapper">
        {children}
      </div>
      {!disabled && visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: classNames('pm-c-tooltip', className)
          })}
        >
          <div
            {...getArrowProps({
              className: 'pm-c-tooltip__arrow'
            })}
          />
          {text}
        </div>
      )}
    </>
  );
}

Tooltip.displayName = 'Tooltip';

export default Tooltip;
