/* eslint-disable react/button-has-type */
import { forwardRef } from 'react';

import classNames from 'classnames';

import styles from './ButtonBase.module.scss';

export type ButtonBaseProps = Pick<
  React.ComponentPropsWithoutRef<'button'>,
  'type' | 'name' | 'onClick' | 'children'
> & {
  size?: 'md' | 'lg';
  className?: Partial<Record<'root', string>>;
  fullWidth?: boolean;
};

function ButtonBase(
  {
    type = 'button',
    size = 'md',
    className,
    fullWidth,
    children,
    ...props
  }: ButtonBaseProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        styles.root,
        {
          [styles.md]: size === 'md',
          [styles.lg]: size === 'lg'
        },
        {
          [styles.fullWidth]: fullWidth
        },
        className?.root
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default forwardRef(ButtonBase);
