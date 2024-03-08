import { forwardRef } from 'react';

import classNames from 'classnames';
import ButtonBase, { ButtonBaseProps } from 'ui/ButtonBase';

import styles from './Button.module.scss';

export type ButtonProps = ButtonBaseProps & {
  color?: 'primary';
  variant?: 'filled';
};

function Button(
  {
    className: { root: rootClassName, ...className } = {},
    color = 'primary',
    variant = 'filled',
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <ButtonBase
      ref={ref}
      className={{
        root: classNames(
          styles.root,
          {
            [styles.primaryFilled]: color === 'primary' && variant === 'filled'
          },
          rootClassName
        ),
        ...className
      }}
      {...props}
    />
  );
}

export default forwardRef(Button);
