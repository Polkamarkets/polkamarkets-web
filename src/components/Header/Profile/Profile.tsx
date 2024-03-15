import ProfileSignin from 'components/Header/ProfileSignin';

import Text from '../../Text';
import ProfileMenu from '../ProfileMenu/ProfileMenu';

type ProfileProps = {
  isLoggedIn: boolean;
};

export default function Profile({ isLoggedIn }: ProfileProps) {
  return (
    <>
      {!isLoggedIn && (
        <ProfileSignin variant="normal" color="primary" size="xs">
          <Text as="span" scale="caption">
            Connect
          </Text>
        </ProfileSignin>
      )}
      <ProfileMenu />
    </>
  );
}
