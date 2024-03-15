import { useState } from 'react';
import { Link } from 'react-router-dom';

import * as Popover from '@radix-ui/react-popover';

import Icon from 'components/Icon';

import styles from './ExploreMenu.module.scss';

export const ExploreMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className={styles.trigger}>
          Explore
          <Icon name="Chevron" dir={open ? 'up' : 'down'} size="lg" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          onOpenAutoFocus={e => e.preventDefault()}
          align="start"
          sideOffset={12}
          onClick={() => setOpen(false)}
        >
          <div className={styles.menuBackground}>
            <Link to="/lands" className={styles.menuItem}>
              <Icon name="UserCommunities" />
              Lands
            </Link>
            <Link to="/contests" className={styles.menuItem}>
              <Icon name="Cup" />
              Contests
            </Link>
            <Link to="/questions" className={styles.menuItem}>
              <Icon name="Layers" />
              Questions
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ExploreMenu;
