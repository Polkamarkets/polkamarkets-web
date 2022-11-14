import cn from 'classnames';

import { Icon } from 'components';

import ToggleClasses from './Toggle.module.scss';

type ReactInputProps = React.ComponentPropsWithoutRef<'input'>;
interface ToggleProps extends Omit<ReactInputProps, 'type'> {
  type: Extract<ReactInputProps['type'], 'radio' | 'checkbox'>;
}

export default function Toggle(props: ToggleProps) {
  const { checked, type } = props;
  const renderIcon = {
    checkbox: checked ? 'CheckboxFilled' : 'Checkbox',
    radio: checked ? 'RadioFilled' : 'Radio'
  } as const;

  return (
    <span
      className={cn(ToggleClasses.root, {
        [ToggleClasses.checked]: checked
      })}
    >
      <input className={ToggleClasses.input} {...props} />
      <Icon className={ToggleClasses.icon} name={renderIcon[type!]} />
    </span>
  );
}
