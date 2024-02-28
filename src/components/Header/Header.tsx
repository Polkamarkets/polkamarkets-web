import cn from 'classnames';
import { Container } from 'ui';
import type { ContainerProps } from 'ui';

import headerClasses from './Header.module.scss';
import HeaderActions from './HeaderActions/HeaderActions';
import HeaderNav from './HeaderNav/HeaderNav';

export interface HeaderProps
  extends Pick<ContainerProps<'header'>, 'className'> {}

export default function Header({ className }: HeaderProps) {
  return (
    <Container
      $as="header"
      className={cn(headerClasses.root, headerClasses.container, className)}
    >
      <HeaderNav />
      <HeaderActions />
    </Container>
  );
}
