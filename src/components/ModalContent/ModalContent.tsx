import type React from 'react';

import cn from 'classnames';

import ModalContentClasses from './ModalContent.module.scss';

export default function ModalDialog({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(ModalContentClasses.root, className)} {...props} />;
}
