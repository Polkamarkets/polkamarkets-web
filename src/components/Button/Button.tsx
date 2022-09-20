/* eslint-disable react/button-has-type */
import React, { useRef, useState } from 'react';

import classNames from 'classnames';

export type ButtonVariant = 'normal' | 'outline' | 'subtle' | 'ghost';

export type ButtonColor =
  | 'base'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'noborder';

type ButtonSize = 'normal' | 'sm' | 'xs';

type ButtonProps = {
  /**
   * Variant to use
   * @default 'normal'
   */
  variant?: ButtonVariant;
  /**
   * Color of the component
   * @default 'default'
   */
  color?: ButtonColor;
  /**
   * Size of the component
   * @default 'normal'
   */
  size?: ButtonSize;
  /**
   * Fill available width
   * @default 'false'
   */
  fullwidth?: boolean;
  /**
   * Disable hover actions
   * @default 'false'
   */
  noHover?: boolean;
  /**
   * Truncate text inside of button
   * @default 'false'
   */
  truncated?: boolean;
  /**
   * Loading state
   * @default 'false'
   */
  loading?: boolean;
};

/**
 * Button to trigger an operation
 */
function Button({
  type = 'button',
  variant = 'normal',
  color = 'default',
  size = 'normal',
  fullwidth = false,
  noHover = false,
  truncated = false,
  loading = false,
  children,
  onClick,
  className,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  React.useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    if (ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [children]);

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        {
          [`pm-c-button-${variant}--${color}`]: variant && color,
          [`pm-c-button--${size}`]: size,
          'pm-c-button--fullwidth': fullwidth,
          'pm-c-button--no-hover': noHover,
          'pm-c-button--truncated': truncated
        },
        className
      )}
      style={
        loading
          ? {
              width: `${width}px`,
              height: `${height}px`
            }
          : {}
      }
      onClick={onClick}
      {...props}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}

export default Button;
