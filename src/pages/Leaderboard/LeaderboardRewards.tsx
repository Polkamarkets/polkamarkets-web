import { Text } from 'components';

import classes from './LeaderboardRewards.module.scss';

type LeaderboardRewardsProps = {
  rewards: Array<Record<'title' | 'description', string>>;
};

export default function LeaderboardRewards({
  rewards
}: LeaderboardRewardsProps) {
  return (
    <div className="pm-c-leaderboard-stats bg-3 border-radius-medium border-solid border-1">
      <h3 className="body semibold text-1">Rewards</h3>
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
    </div>
  );
}
