import type React from 'react';
import { forwardRef } from 'react';

import cn from 'classnames';

import ListClasses from './List.module.scss';

export default forwardRef<HTMLUListElement, React.ComponentPropsWithRef<'ul'>>(
  function List({ className, ...props }, ref) {
    return (
      <ul
        ref={ref}
        role="listbox"
        className={cn(ListClasses.root, className)}
        {...props}
      />
    );
  }
);
