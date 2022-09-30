import cn from 'classnames';

import ModalHeaderStyles from './ModalHeader.module.scss';
import type { ModalHeaderProps } from './ModalHeader.type';

export default function ModalHeader({ className, ...props }: ModalHeaderProps) {
  return (
    <header className={cn(ModalHeaderStyles.root, className)} {...props} />
  );
}
