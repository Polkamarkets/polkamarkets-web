import cn from 'classnames';

import skeletonClasses from './Skeleton.module.scss';

interface SkeletonProps
  extends Pick<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  radius?: 'full';
}

export default function Skeleton({
  className,
  radius,
  ...props
}: SkeletonProps) {
  return (
    <span
      role="alert"
      aria-busy
      className={cn(
        skeletonClasses.root,
        {
          [skeletonClasses.radiusFull]: radius === 'full',
          [skeletonClasses.radiusDefault]: !radius
        },
        className
      )}
      {...props}
    />
  );
}
