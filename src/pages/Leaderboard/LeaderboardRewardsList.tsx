import { Text } from 'components';

import classes from './LeaderboardRewardsList.module.scss';

type LeaderboardRewardsProps = {
  rewards: Array<Record<'title' | 'description', string>>;
};

export default function LeaderboardRewardsList({
  rewards
}: LeaderboardRewardsProps) {
  return (
    <ul>
      {rewards.map(reward => (
        <li key={reward.title} className={classes.rewardsReward}>
          <Text
            scale="caption"
            fontWeight="medium"
            className={classes.rewardsRewardPrimary}
          >
            {reward.title}
          </Text>
          <Text scale="caption" color="lighter-gray">
            {reward.description}
          </Text>
        </li>
      ))}
    </ul>
  );
}
