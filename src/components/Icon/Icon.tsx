import { memo } from 'react';

import cn from 'classnames';

import * as Svgs from './__svgs__';
import IconClasses from './Icon.module.scss';
import type { IconProps } from './Icon.type';

function Icon({ size = 'md', name, dir, className, ...props }: IconProps) {
  const { title } = props;
  const Svg = Svgs[name];

  return (
    <Svg
      focusable="false"
      className={cn(
        IconClasses.root,
        {
          [IconClasses.sm]: size === 'sm',
          [IconClasses.md]: size === 'md',
          [IconClasses.lg]: size === 'lg',
          [IconClasses.left]: dir === 'left',
          [IconClasses.up]: dir === 'up',
          [IconClasses.right]: dir === 'right',
          [IconClasses.down]: dir === 'down'
        },
        className
      )}
      {...(!title && {
        'aria-hidden': 'true'
      })}
      {...props}
    />
  );
}

Icon.displayName = 'Icon';

export default memo(Icon, Object.is);
