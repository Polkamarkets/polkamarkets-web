import cn from 'classnames';

import dividerClasses from './Divider.module.scss';

interface DividerProps
  extends Pick<React.ComponentPropsWithoutRef<'hr'>, 'className'> {
  enableGutters?: boolean;
}

export default function Divider({
  className,
  enableGutters,
  ...props
}: DividerProps) {
  return (
    <hr
      className={cn(
        dividerClasses.root,
        {
          [dividerClasses.gutters]: enableGutters
        },
        className
      )}
      {...props}
    />
  );
}
