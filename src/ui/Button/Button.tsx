import { forwardRef, ComponentPropsWithRef } from 'react';

import cn from 'classnames';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'light';

type ButtonSize = 'md' | 'sm' | 'lg';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  danger?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      type = 'button',
      variant = 'primary',
      size = 'md',
      children,
      className,
      danger = false,
      ...props
    }: ButtonProps,
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          styles.button,
          styles[`button-${variant}`],
          styles[`button-${size}`],
          danger && styles['button-danger'],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
