import cn from 'classnames';

import adornmentClasses from './Adornment.module.scss';

export const adornmentProps = {
  $edge: ['start', 'end']
} as const;

export interface AdornmentProps
  extends Pick<
    React.ComponentPropsWithoutRef<'span'>,
    'children' | 'className'
  > {
  $edge: (typeof adornmentProps.$edge)[number];
  $size?: 'sm' | 'md';
}

export default function Adornment({
  $edge,
  $size = 'md',
  className,
  ...props
}: AdornmentProps) {
  return (
    <span
      className={cn(
        adornmentClasses.root,
        {
          [adornmentClasses.edgeStart]: $edge === 'start',
          [adornmentClasses.edgeEnd]: $edge === 'end',
          [adornmentClasses.sizeSm]: $size === 'sm',
          [adornmentClasses.sizeMd]: $size === 'md'
        },
        className
      )}
      {...props}
    />
  );
}
