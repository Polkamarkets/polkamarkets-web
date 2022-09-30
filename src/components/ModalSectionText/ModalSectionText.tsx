import cn from 'classnames';

import Text from 'components/Text';

import ModalSectionTextStyles from './ModalSectionText.module.scss';
import type { ModalSectionTextProps } from './ModalSectionText.type';

export default function ModalSectionText({
  className,
  ...props
}: ModalSectionTextProps) {
  return (
    <Text
      className={cn(ModalSectionTextStyles.root, className)}
      scale="caption"
      {...props}
    />
  );
}
