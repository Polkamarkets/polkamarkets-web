import AuthModal from 'components/AuthModal';
import Icon from 'components/Icon';

import { ProfileMenu } from '../ProfileMenu/ProfileMenu';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Profile({ isLoggedIn }: ProfileProps) {
  return (
    <>
      {!isLoggedIn && (
        <AuthModal size="md">
          <Icon name="Profile" size="md" />
          Sign In
        </AuthModal>
      )}

      <ProfileMenu />
    </>
  );
}
