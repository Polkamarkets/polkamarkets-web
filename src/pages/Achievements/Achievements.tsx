/* eslint-disable react/jsx-indent */
import { useEffect, useState, useMemo, useCallback } from 'react';

import isEmpty from 'lodash/isEmpty';
import { PolkamarketsService } from 'services';
import { useGetAchievementsQuery } from 'services/Polkamarkets';
import { Container } from 'ui';

import { Button, Toast, ToastNotification, Feature } from 'components';
import {
  Achievement,
  AchievementFilter,
  Item
} from 'components/pages/achievements';

import { useNetwork } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import AchievementsEmpty from './AchievementsEmpty';
import AchievementsLoading from './AchievementsLoading';

const achievementFilters: Item[] = [
  {
    id: 'all',
    name: 'ALL',
    value: 'all'
  },
  {
    id: 'claimed',
    name: 'CLAIMED',
    value: 'claimed'
  },
  {
    id: 'unlocked',
    name: 'UNLOCKED',
    value: 'unlocked'
  },
  {
    id: 'locked',
    name: 'LOCKED',
    value: 'locked'
  }
];

const filters = {
  all: item => item,
  claimed: item => item.status === 'claimed',
  unlocked: item => item.status === 'unlocked',
  locked: item => item.status === 'locked'
};

function Achievements() {
  // Custom Hooks
  const { network, networkConfig } = useNetwork();
  const { show, close } = useToastNotification();

  // Redux toolkit queries
  const {
    data: achievements,
    isFetching,
    isLoading,
    refetch
  } = useGetAchievementsQuery({
    networkId: network.id
  });

  // Local state
  const [filter, setFilter] = useState(achievementFilters[0].value);
  const [userAchievements, setUserAchievements] = useState({});
  const [claimedAchievement, setClaimedAchievement] = useState<{
    id: number | undefined;
    status: boolean;
    transactionHash: string | undefined;
  }>({ id: undefined, status: false, transactionHash: undefined });

  // Memoized callbacks
  const getUserAchievements = useCallback(async () => {
    const polkamarketsService = new PolkamarketsService(networkConfig);
    await polkamarketsService.login();

    const response = await polkamarketsService.getAchievements();
    setUserAchievements(response);
  }, [networkConfig]);

  const handleClaimCompleted = useCallback(
    async (id: number, status: boolean, transactionHash: string) => {
      setClaimedAchievement({
        id,
        status,
        transactionHash
      });

      await getUserAchievements();
      show(`claimNFT-${id}`);
      await refetch();
    },
    [getUserAchievements, refetch, show]
  );

  useEffect(() => {
    getUserAchievements();
  }, [getUserAchievements, network]);

  // Derivated state
  const achievementsWithStatus = useMemo(() => {
    return (
      achievements?.map(achievement => {
        // fetching status
        let status = 'locked';
        if (userAchievements[achievement.id]?.claimed) {
          status = 'claimed';
        } else if (userAchievements[achievement.id]?.canClaim) {
          status = 'unlocked';
        }

        // fetching image, if claimed
        let { imageUrl } = achievement;
        if (userAchievements[achievement.id]?.token?.data?.image) {
          imageUrl = userAchievements[achievement.id]?.token?.data?.image;
        }

        return { ...achievement, status, imageUrl };
      }) || []
    );
  }, [achievements, userAchievements]);

  const achievementsByFilter = achievementsWithStatus.filter(filters[filter]);
  const loading = isFetching || isLoading;
  const empty = isEmpty(achievementsByFilter);

  return (
    <Container className="pm-p-achievements flex-column gap-4 max-width-screen-xl">
      <div className="flex-row wrap justify-space-between align-center gap-6 padding-bottom-3">
        <h1 className="pm-p-achievements__title heading semibold">
          Achievements
        </h1>
        <AchievementFilter
          items={achievementFilters}
          defaultItemId={achievementFilters[0].id}
          onChangeItem={(_item, value) => setFilter(value)}
        />
      </div>

      {loading ? <AchievementsLoading /> : null}
      {!loading && empty ? <AchievementsEmpty /> : null}
      {!loading && !empty ? (
        <ul className="pm-p-achievements__list">
          {achievementsByFilter.map(achievement => {
            return (
              <li key={achievement.id} className="pm-p-achievements__list-item">
                <Achievement
                  {...achievement}
                  onClaimCompleted={handleClaimCompleted}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
      {claimedAchievement.id &&
      claimedAchievement.status &&
      claimedAchievement.transactionHash ? (
        <ToastNotification
          id={`claimNFT-${claimedAchievement.id}`}
          duration={10000}
        >
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <Feature name="regular">
                <a
                  target="_blank"
                  href={`${network.explorerURL}/tx/${claimedAchievement.transactionHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
              </Feature>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => close(`claimNFT-${claimedAchievement.id}`)}
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
    </Container>
  );
}

export default Achievements;
