import cn from 'classnames';

import ModalSectionStyles from './ModalSection.module.scss';
import type { ModalSectionProps } from './ModalSection.type';

export default function ModalSection({
  className,
  ...props
}: ModalSectionProps) {
  return (
    <section className={cn(ModalSectionStyles.root, className)} {...props} />
  );
}
