import cn from 'classnames';

import ListClasses from './List.module.scss';

interface ListProps extends React.ComponentPropsWithoutRef<'ul'> {
  $rounded?: boolean;
}

export default function List({ className, $rounded, ...props }: ListProps) {
  return (
    <ul
      role="listbox"
      className={cn(
        ListClasses.root,
        {
          [ListClasses.rounded]: $rounded
        },
        className
      )}
      {...props}
    />
  );
}
