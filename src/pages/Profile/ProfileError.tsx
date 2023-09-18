import { features } from 'config';

import { Button, Logos, Text } from 'components';

import profileClasses from './Profile.module.scss';

type ProfileErrorProps = {
  username?: string;
};

export default function ProfileError({ username = '' }: ProfileErrorProps) {
  return (
    <div className={profileClasses.container}>
      <Logos size="lg" standard="mono" />
      <Text color="gray" scale="body" fontWeight="semibold">
        {features.regular.enabled ? (
          'Something went wrong. Please, try again!'
        ) : (
          <>
            User <code>{username}</code> not found!
          </>
        )}
      </Text>
      {features.regular.enabled && (
        <Button
          size="xs"
          color="primary"
          className={profileClasses.containerButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
