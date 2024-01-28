import { PropsWithChildren } from 'react';

import RCDrawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';

import { useDrawer } from 'hooks';

import { Button } from '../Button';
import Icon from '../Icon';
import styles from './Drawer.module.scss';
import motionProps from './motion';

type DrawerProps = PropsWithChildren<{
  title?: string;
}>;

function Drawer({ title, children }: DrawerProps) {
  const { isOpen, close } = useDrawer(state => state);

  return (
    <RCDrawer
      open={isOpen}
      onClose={close}
      classNames={{ wrapper: styles.wrapper, content: styles.content }}
      placement="right"
      {...motionProps}
    >
      <div className={styles.header}>
        {title && <h1 className={styles.title}>{title}</h1>}
        <Button
          variant="ghost"
          className={styles.headerClose}
          aria-label="Hide"
          onClick={close}
        >
          <Icon name="Arrow" dir="right" />
        </Button>
      </div>

      {children}
    </RCDrawer>
  );
}

export default Drawer;
