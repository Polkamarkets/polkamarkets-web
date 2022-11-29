import cn from 'classnames';

import ContainerClasses from './Container.module.scss';

type Elements = keyof JSX.IntrinsicElements;

export type ContainerProps<T extends Elements> = {
  as?: T;
} & React.ComponentPropsWithRef<T>;

export default function Container<T extends Elements = Elements>({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as || 'div';

  return (
    // @ts-ignore
    <Component className={cn(ContainerClasses.root, className)} {...props} />
  );
}
