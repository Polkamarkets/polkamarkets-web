import cn from 'classnames';

import * as Svgs from './__svgs__';
import IconClasses from './Icon.module.scss';

export type IconNames = keyof typeof Svgs;

export interface IconProps extends React.ComponentPropsWithRef<'svg'> {
  dir?: 'left' | 'up' | 'right' | 'down';
  name: IconNames;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

function Icon({
  size = 'md',
  name,
  dir,
  className,
  fill,
  ...props
}: IconProps) {
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
          [IconClasses.xl]: size === 'xl',
          [IconClasses.left]: dir === 'left',
          [IconClasses.up]: dir === 'up',
          [IconClasses.right]: dir === 'right',
          [IconClasses.down]: dir === 'down',
          [IconClasses.currentColor]: !fill
        },
        className
      )}
      {...(!title && {
        'aria-hidden': 'true'
      })}
      fill={fill}
      {...props}
    />
  );
}

Icon.displayName = 'Icon';

export default Icon;
