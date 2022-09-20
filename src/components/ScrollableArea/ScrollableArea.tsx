import { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

type ScrollbarSize = 'normal' | 'sm';

type ScrollableAreaProps = {
  /**
   * Size of the scrollbar
   * @default 'normal'
   */
  scrollbarSize?: ScrollbarSize;
  /**
   * Optional CSS inline styles
   */
  style?: CSSProperties;
  className?: string;
  fullwidth?: boolean;
  children: ReactNode;
};

/**
 * Scrollable area
 */
function ScrollableArea({
  scrollbarSize = 'normal',
  style,
  className,
  fullwidth,
  children
}: ScrollableAreaProps) {
  return (
    <div
      className={classNames(
        `pm-c-scrollable-area--${scrollbarSize}`,
        fullwidth && 'width-full'
      )}
    >
      <div
        className={classNames('pm-c-scrollable-area__content', className)}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollableArea;
