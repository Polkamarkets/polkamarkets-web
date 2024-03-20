import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import * as Menu from 'ui/Menu/Menu';

import Icon from 'components/Icon';

import styles from './ExploreMenu.module.scss';

export const ExploreMenu = () => {
  const history = useHistory();

  const [open, setOpen] = useState(false);
  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger asChild>
        <div className={styles.trigger}>
          Explore
          <Icon name="Chevron" dir={open ? 'up' : 'down'} size="lg" />
        </div>
      </Menu.Trigger>
      <Menu.Content align="start" sideOffset={12}>
        <Menu.Item onClick={() => history.push('/lands')}>
          <Icon name="UserCommunities" color="#528BFF" />
          Lands
        </Menu.Item>
        <Menu.Item onClick={() => history.push('/contests')}>
          <Icon name="Cup" />
          Contests
        </Menu.Item>
        <Menu.Item onClick={() => history.push('/questions')}>
          <Icon name="Layers" />
          Questions
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};

export default ExploreMenu;
