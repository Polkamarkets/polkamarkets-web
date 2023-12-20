import React from 'react';

import classNames from 'classnames';

type ButtonTextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark'
  | 'white'
  | 'white-50'
  | 'black'
  | 'gray'
  | 'lighter-gray'
  | 'light-gray'
  | 'dark-gray';

type ButtonTextSize = 'sm' | 'lg';

type ButtonTextProps = {
  /**
   * Color of the text
   * @default 'default'
   */
  color?: ButtonTextColor;
  /**
   * Size of the component
   * @default 'medium'
   */
  size?: ButtonTextSize;
  /**
   * Fill available width
   * @default 'false'
   */
  fullwidth?: boolean;
};

/**
 * Button to trigger an operation
 */
const ButtonText = React.forwardRef<
  HTMLButtonElement,
  ButtonTextProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    { color = 'default', size, fullwidth = false, children, onClick, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={classNames(
        `pm-c-button-text--${color}`,
        size && `pm-c-button--${size}`,
        fullwidth && 'pm-c-button--fullwidth'
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
);

ButtonText.displayName = 'ButtonText';

export default ButtonText;
