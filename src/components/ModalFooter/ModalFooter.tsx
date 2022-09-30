import cn from 'classnames';

import ModalFooterStyles from './ModalFooter.module.scss';
import type { ModalFooterProps } from './ModalFooter.type';

export default function ModalFooter({ className, ...props }: ModalFooterProps) {
  return (
    <footer className={cn(ModalFooterStyles.root, className)} {...props} />
  );
}
