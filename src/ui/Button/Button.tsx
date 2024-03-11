import { forwardRef } from 'react';

import classNames from 'classnames';
import ButtonBase, { ButtonBaseProps } from 'ui/ButtonBase';

import styles from './Button.module.scss';

export type ButtonProps = ButtonBaseProps & {
  color?: 'primary' | 'primary gray' | 'secondary gray';
  variant?: 'filled' | 'outlined';
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
          {
            [styles.primaryGrayOutlined]:
              color === 'primary gray' && variant === 'outlined'
          },
          {
            [styles.secondaryGrayFilled]:
              color === 'secondary gray' && variant === 'filled'
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
