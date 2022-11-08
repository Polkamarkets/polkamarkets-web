import type React from 'react';

import cn from 'classnames';

import AdornmentClasses from './Adornment.module.scss';

export default function Adornment({
  edge,
  children
}: React.PropsWithChildren<
  Partial<{
    edge: 'start' | 'end';
  }>
>) {
  return (
    <span
      className={cn({
        [AdornmentClasses.start]: edge === 'start',
        [AdornmentClasses.end]: edge === 'end'
      })}
    >
      {children}
    </span>
  );
}
