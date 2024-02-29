import { Logos, Text } from 'components';

import profileClasses from './Profile.module.scss';

type ProfileErrorProps = {
  username?: string;
};

export default function ProfileError({ username = '' }: ProfileErrorProps) {
  return (
    <div className={profileClasses.container}>
      <Logos size="lg" standard="mono" />
      <Text color="gray" scale="body" fontWeight="semibold">
        User <code>{username}</code> not found!
      </Text>
    </div>
  );
}
