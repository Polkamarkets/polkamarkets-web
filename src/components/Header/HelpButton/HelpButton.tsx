import cn from 'classnames';

import Icon from 'components/Icon';

import helpButtonClasses from './HelpButton.module.scss';

interface HelpButtonProps
  extends Pick<
    React.ComponentPropsWithoutRef<'a'>,
    'href' | 'className' | 'onClick'
  > {
  $fullWidth?: boolean;
  $outline?: boolean;
}

export default function HelpButton({
  className,
  $fullWidth,
  $outline,
  ...props
}: HelpButtonProps) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(
        'pm-c-button--sm',
        helpButtonClasses.root,
        {
          'pm-c-button-ghost--default': !$outline,
          'pm-c-button-outline--primary': $outline,
          'pm-c-button--fullwidth': $fullWidth
        },
        className
      )}
      {...props}
    >
      <Icon name="Question" size="lg" className={helpButtonClasses.icon} />
      Help
    </a>
  );
}
