import { forwardRef } from 'react';

import cn from 'classnames';

import { Button, ButtonProps } from './Button';
import styles from './ButtonIcon.module.scss';

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonIcon({ className, size = 'md', ...props }, ref) {
    return (
      <Button
        ref={ref}
        className={cn(
          styles.buttonIcon,
          {
            [styles[`buttonIcon-${size}`]]: size
          },
          className
        )}
        {...props}
        size={size}
      />
    );
  }
);

export default ButtonIcon;
