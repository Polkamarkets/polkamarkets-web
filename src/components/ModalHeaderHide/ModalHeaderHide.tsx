import { RemoveOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';

import ModalClasses from './ModalHeaderHide.module.scss';

export default function ModalHeaderHide(props) {
  return (
    <Button
      variant="ghost"
      className={ModalClasses.root}
      aria-label="Hide"
      {...props}
    >
      <RemoveOutlinedIcon />
    </Button>
  );
}
