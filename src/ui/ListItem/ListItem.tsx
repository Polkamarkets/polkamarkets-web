import React from 'react';

import cn from 'classnames';

import ListItemClasses from './ListItem.module.scss';

export default function ListItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'>) {
  return <li className={cn(ListItemClasses.root, className)} {...props} />;
}
