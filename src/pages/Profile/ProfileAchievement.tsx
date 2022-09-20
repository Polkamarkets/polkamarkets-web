import { Link } from 'react-router-dom';

import { LeaderboardAchievement } from 'types/leaderboard';

import { MedalIcon } from 'assets/icons';

import { Divider } from 'components';

type ProfileAchievementProps = {
  achievement: LeaderboardAchievement;
  backgroundColor: '2' | '3';
};

function ProfileAchievement({
  achievement,
  backgroundColor
}: ProfileAchievementProps) {
  const { image, name, description, actionTitle, tokenCount, rarity } =
    achievement;

  return (
    <Link
      className={`pm-c-profile-achievement bg-${backgroundColor}`}
      to="/achievements"
    >
      <img src={image} alt={name} width={104} height={104} />
      <div className="flex-column gap-3 width-full">
        <h4 className="pm-c-achievement__award-title heading-large bold">
          {name}
        </h4>
        <p className="pm-c-achievement__award-description pm-c-profile-achievement__description caption medium">
          {description}
        </p>
        <div className="pm-c-profile-achievement__stats">
          <div className="flex-row justify-start align-center gap-3">
            <MedalIcon className="pm-c-achievement__medal-icon--unlocked" />
            <h1 className="pm-c-achievement__title--unlocked tiny-uppercase semibold whitespace-nowrap">
              {actionTitle}
            </h1>
          </div>
          <div className="flex-row align-center gap-3">
            <span className="pm-c-achievement__claim-count tiny-uppercase semibold">
              {`${tokenCount} claimed`}
            </span>
            <Divider variant="circle" />
            <span
              className={`pm-c-achievement__rarity--${rarity} tiny-uppercase semibold`}
            >
              {rarity}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProfileAchievement;
