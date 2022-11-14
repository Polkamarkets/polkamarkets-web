interface ToggleSwitchProps extends React.ComponentPropsWithoutRef<'input'> {
  name: string;
  checked?: boolean;
  disabled?: boolean;
}

const ToggleSwitch = ({
  name,
  checked,
  disabled = false,
  ...props
}: ToggleSwitchProps) => {
  return (
    <label className="toggle-switch" htmlFor={name}>
      <input
        type="checkbox"
        id={name}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <span className="slider" />
    </label>
  );
};

ToggleSwitch.displayName = 'Toggle switch';

export default ToggleSwitch;
