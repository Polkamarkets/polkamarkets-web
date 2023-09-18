import { Fragment } from 'react';

import { fromTimestampToCustomFormatDate } from 'helpers/date';
import { Avatar, Skeleton } from 'ui';

import { ShareIcon } from 'assets/icons';

import { AlertMini, Tooltip, Feature } from 'components';
import { Text } from 'components/new';

import profileClasses from './Profile.module.scss';
import type { ProfileSummaryProps } from './types';

function ProfileSummaryGroup(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  return <div className={profileClasses.summaryGroup} {...props} />;
}
function ProfileSummaryInfo(
  props: React.PropsWithChildren<Record<string, unknown>>
) {
  return <div className="pm-p-profile-summary__details" {...props} />;
}
export default function ProfileSummary({
  address,
  isLoading,
  data,
  network,
  username,
  avatar
}: ProfileSummaryProps) {
  const ProfileSummaryGroupComponent = avatar ? ProfileSummaryGroup : Fragment;
  const ProfileSummaryInfoComponent = avatar ? ProfileSummaryInfo : Fragment;

  return (
    <div className="pm-p-profile-summary__details">
      {(() => {
        if (isLoading)
          return (
            <>
              <div className="pm-p-profile-summary__address-group">
                <Skeleton style={{ height: 32 }} />
              </div>
              <div className="pm-p-profile-summary__history">
                <Skeleton style={{ width: 400, height: 16 }} />
              </div>
            </>
          );
        if (!data)
          return (
            <AlertMini
              variant="default"
              description="No summary data available."
            />
          );
        return (
          <ProfileSummaryGroupComponent>
            {avatar && (
              <Avatar
                $radius="lg"
                $size="sm"
                alt="avatar"
                src={avatar}
                className={profileClasses.summaryAvatar}
              />
            )}
            <ProfileSummaryInfoComponent>
              <Text
                className="pm-p-profile-summary__address"
                as="h2"
                fontSize="heading-2"
                fontWeight="bold"
                color="1"
              >
                {username || address}
                <Feature name="regular">
                  <Tooltip position="bottom-start" text="View on Explorer">
                    <a
                      target="_blank"
                      href={`${network.explorerURL}/address/${address}`}
                      rel="noreferrer"
                    >
                      <ShareIcon className="pm-p-profile-summary__explorer-icon" />
                    </a>
                  </Tooltip>
                </Feature>
              </Text>
              <Text
                fontSize="body-4"
                fontWeight="semibold"
                color="3"
                transform="uppercase"
                className="pm-p-profile-summary__history"
              >
                {!!data?.firstPositionAt && (
                  <>
                    First prediction:{' '}
                    <span className="pm-p-profile-summary__history-accent notranslate">
                      {fromTimestampToCustomFormatDate(
                        data.firstPositionAt * 1000,
                        'MMMM DD, YYYY'
                      )}
                    </span>
                    <span className="pm-c-divider--circle" />
                  </>
                )}
                Total predictions:{' '}
                <span className="pm-p-profile-summary__history-accent">
                  {data.totalPositions}
                </span>
              </Text>
            </ProfileSummaryInfoComponent>
          </ProfileSummaryGroupComponent>
        );
      })()}
    </div>
  );
}
