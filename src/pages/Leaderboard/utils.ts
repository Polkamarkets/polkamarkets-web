import { Tournament } from 'types/tournament';

/* eslint-disable import/prefer-default-export */
function tournamentRewards(
  tournament: Tournament | undefined,
  shortDescription = false
) {
  if (!tournament || !tournament.rewards || tournament?.rewards.length === 0) {
    return [];
  }

  return tournament.rewards.map(reward => ({
    // cardinal numbering
    title:
      reward.from === reward.to
        ? `#${reward.from} Place`
        : `#${reward.from} to #${reward.to} Place`,
    description: shortDescription
      ? reward.rewardShort || reward.reward
      : reward.reward
  }));
}

export { tournamentRewards };
