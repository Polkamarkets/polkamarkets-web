import Icon from 'components/Icon';
import ProfileSignin from 'components/ProfileSignin';
import ProfileSignout from 'components/ProfileSignout';

import Text from '../Text';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Profile({ isLoggedIn }: ProfileProps) {
  if (isLoggedIn) return <ProfileSignout />;
  return (
    <ProfileSignin variant="normal" color="primary" size="xs">
      <Icon name="Profile" size="md" />
      <Text as="span" scale="caption">
        Sign In
      </Text>
    </ProfileSignin>
  );
}
