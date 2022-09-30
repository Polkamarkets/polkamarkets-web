import cn from 'classnames';

import Text from 'components/Text';

import ModalHeaderTitleStyles from './ModalHeaderTitle.module.scss';
import type { ModalHeaderTitleProps } from './ModalHeaderTitle.type';

export default function ModalHeaderTitle({
  className,
  ...props
}: ModalHeaderTitleProps) {
  return (
    <Text
      as="h2"
      fontWeight="medium"
      className={cn(ModalHeaderTitleStyles.root, className)}
      scale="heading"
      {...props}
    />
  );
}
