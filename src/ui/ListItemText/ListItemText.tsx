import React from 'react';

import cn from 'classnames';

import ListItemTextClasses from './ListItemText.module.scss';

export default function ListItemText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span className={cn(ListItemTextClasses.root, className)} {...props} />
  );
}
