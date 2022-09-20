import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { closeRightSidebar } from 'redux/ducks/ui';

import { useAppDispatch, useAppSelector, useWindowDimensions } from 'hooks';

import ProfileAchievements from './ProfileAchievements';
import ProfileActivities from './ProfileActivities';
import ProfileSummary from './ProfileSummary';
import ProfileYourStats from './ProfileYourStats';

type ProfileUrlParams = {
  address: string;
};

function Profile() {
  // Redux selectors
  const rightSidebarIsVisible = useAppSelector(
    state => state.ui.rightSidebar.visible
  );

  // Hooks
  const dispatch = useAppDispatch();
  const { address } = useParams<ProfileUrlParams>();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (rightSidebarIsVisible) {
      dispatch(closeRightSidebar());
    }
  }, [rightSidebarIsVisible, dispatch]);

  const listHeight = Math.min(Math.ceil(height * 0.5), 700);

  return (
    <div className="pm-p-profile">
      <ProfileSummary address={address} />
      <ProfileYourStats address={address} />
      <div className="pm-p-profile-lists margin-top-6">
        <ProfileAchievements address={address} listHeight={listHeight} />
        <ProfileActivities address={address} listHeight={listHeight} />
      </div>
    </div>
  );
}

export default Profile;
