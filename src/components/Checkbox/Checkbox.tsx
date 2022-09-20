import React, { ReactNode } from 'react';

type CheckboxProps = {
  /**
   * The label property of input[type="checkbox"]
   */
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
};

/**
 *
 *  Used for selecting multiple values from several options
 */
function Checkbox({
  label,
  children,
  ...props
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="pm-c-checkbox caption medium" htmlFor={label}>
      <input id={label} type="checkbox" {...props} />
      {children || label}
      <span className="pm-c-checkbox__checkmark" />
    </label>
  );
}

Checkbox.displayName = 'Checkbox';

export default Checkbox;
