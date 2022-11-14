import cn from 'classnames';

import DividerClasses from './Divider.module.scss';

export default function Divider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'hr'>) {
  return <hr className={cn(DividerClasses.root, className)} {...props} />;
}
