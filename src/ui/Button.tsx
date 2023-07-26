import classNames from 'classnames';

import buttonClasses from './Button.module.scss';

export interface ButtonProps
  extends React.PickFrom<
    'button',
    'aria-label' | 'className' | 'children' | 'onClick' | 'disabled'
  > {
  $variant?: 'fill' | 'outline' | 'text';
  $color?: 'warn' | 'text';
  $size?: 'sm' | 'md';
  $fill?: boolean;
}

export default function Button({
  className,
  $variant,
  $color,
  $size,
  $fill,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        buttonClasses.root,
        {
          [buttonClasses.variantOutline]: $variant === 'outline',
          [buttonClasses.variantFill]: $variant === 'fill',
          [buttonClasses.variantText]: $variant === 'text',
          [buttonClasses.colorWarn]: $color === 'warn',
          [buttonClasses.colorText]: $color === 'text',
          [buttonClasses.sizeSm]: $size === 'sm',
          [buttonClasses.sizeMd]: $size === 'md',
          [buttonClasses.fill]: $fill
        },
        className
      )}
      {...props}
    />
  );
}
