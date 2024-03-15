import classNames from 'classnames';

import { Button, ButtonProps } from 'components/Button';

import profileSigninEmailClasses from './ProfileSigninEmail.module.scss';

type ProfileSigninEmailProps = Pick<
  React.ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> &
  Omit<ButtonProps, 'onSubmit'>;

export default function ProfileSigninEmail({
  onSubmit,
  ...props
}: ProfileSigninEmailProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={classNames(profileSigninEmailClasses.root, {
        [profileSigninEmailClasses.disabled]: props.disabled
      })}
    >
      <input
        type="email"
        placeholder="Login with your e-mail"
        className={profileSigninEmailClasses.input}
        disabled={props.disabled}
      />
      <Button
        type="submit"
        variant="normal"
        size="xs"
        className={profileSigninEmailClasses.email}
        {...props}
      />
    </form>
  );
}
