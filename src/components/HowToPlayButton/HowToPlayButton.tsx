import cn from 'classnames';

import Icon from 'components/Icon';

import { useLocalStorage } from 'hooks';

import styles from './HowToPlayButton.module.scss';

interface HowToPlayButtonProps
  extends Pick<
    React.ComponentPropsWithoutRef<'button'>,
    'className' | 'onClick'
  > {
  $fullWidth?: boolean;
  $outline?: boolean;
}

export default function HowToPlayButton({
  className,
  $fullWidth,
  $outline,
  ...props
}: HowToPlayButtonProps) {
  const [_onboardingCompleted, setOnboardingCompleted] =
    useLocalStorage<boolean>('onboardingCompleted', false);

  return (
    <button
      type="button"
      className={cn(
        'pm-c-button--sm',
        styles.root,
        {
          'pm-c-button-ghost--default': !$outline,
          'pm-c-button-outline--primary': $outline,
          'pm-c-button--fullwidth': $fullWidth
        },
        className
      )}
      onClick={() => setOnboardingCompleted(false)}
      {...props}
    >
      <Icon name="Question" size="lg" className={styles.icon} />
      How To Play
    </button>
  );
}
