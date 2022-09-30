import type { HTMLMotionProps } from 'framer-motion';

type ModalComponents = 'root' | 'dialog' | 'hide';

export interface ModalProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  onHide?(): void;
  show: boolean;
  className?: Partial<Record<ModalComponents, string>>;
}
