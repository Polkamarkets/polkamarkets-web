import { environment } from 'config';
import { Tournament } from 'types/tournament';

/* eslint-disable import/prefer-default-export */
function tournamentRewardPlaceString(from: number, to?: number) {
  const language = environment.DEFAULT_LANGUAGE || 'en';

  if (to) {
    switch (language) {
      case 'pt':
        return `${from}º a ${to}º Lugar`;
      default:
        return `#${from} to #${to} Place`;
    }
  }

  switch (language) {
    case 'pt':
      return `${from}º Lugar`;
    default:
      return `#${from} Place`;
  }
}

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
        ? tournamentRewardPlaceString(reward.from)
        : tournamentRewardPlaceString(reward.from, reward.to),
    description: shortDescription
      ? reward.rewardShort || reward.reward
      : reward.reward
  }));
}

export { tournamentRewards };
