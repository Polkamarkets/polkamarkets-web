import ProfileSignin from 'components/Header/ProfileSignin';
import Icon from 'components/Icon';

import Text from '../../Text';
import ProfileMenu from '../ProfileMenu/ProfileMenu';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Profile({ isLoggedIn }: ProfileProps) {
  if (isLoggedIn) return <ProfileMenu />;
  return (
    <ProfileSignin variant="normal" color="primary" size="xs">
      <Icon name="Profile" size="md" />
      <Text as="span" scale="caption">
        Sign In
      </Text>
    </ProfileSignin>
  );
}
