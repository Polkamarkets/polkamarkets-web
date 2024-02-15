import classNames from 'classnames';

import { RemoveOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import type { ButtonProps } from 'components/Button';

import modalHeaderClasses from './ModalHeaderHide.module.scss';

interface ModalHeaderHideProps
  extends Omit<ButtonProps, 'aria-label' | 'variant'> {
  $disableInset?: boolean;
}

export default function ModalHeaderHide({
  className,
  $disableInset,
  ...props
}: ModalHeaderHideProps) {
  return (
    <Button
      variant="ghost"
      className={classNames(
        modalHeaderClasses.root,
        {
          [modalHeaderClasses.inset]: !$disableInset,
          [modalHeaderClasses.itemEnd]: $disableInset
        },
        className
      )}
      aria-label="Hide"
      {...props}
    >
      <RemoveOutlinedIcon />
    </Button>
  );
}
