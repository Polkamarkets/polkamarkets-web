import AuthModal from 'components/AuthModal';
import Icon from 'components/Icon';

import Text from '../../Text';
import ProfileMenu from '../ProfileMenu/ProfileMenu';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Profile({ isLoggedIn }: ProfileProps) {
  return (
    <>
      {!isLoggedIn && (
        <AuthModal>
          <Icon name="Profile" size="md" />
          <Text as="span" scale="caption">
            Sign In
          </Text>
        </AuthModal>
      )}
      <ProfileMenu />
    </>
  );
}
