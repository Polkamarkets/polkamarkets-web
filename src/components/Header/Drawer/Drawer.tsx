/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { createPortal } from 'react-dom';

import cn from 'classnames';

import { Icon } from 'components';

import styles from './Drawer.module.scss';

const DrawerContext = createContext<{
  open: boolean;
  setOpen: (currentState: boolean) => void;
}>({
  open: false,
  setOpen: () => {}
});

export const Trigger = ({ children }) => {
  const { open, setOpen } = useContext(DrawerContext);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
};

export const Content: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  const { setOpen } = useContext(DrawerContext);

  return (
    <div onClick={() => setOpen(false)} className={cn(className)}>
      {children}
    </div>
  );
};

export const Header: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  const { setOpen } = useContext(DrawerContext);
  return (
    <div className={cn(styles.header, className)}>
      <Icon
        name="Arrow"
        dir="left"
        size="md"
        title="Close Menu"
        onClick={() => setOpen(false)}
        className={styles.headerBack}
      />
      {children}
    </div>
  );
};

export const Item: React.FC<{ className?: string; onClick?: () => void }> = ({
  children,
  onClick,
  className
}) => {
  return (
    <div className={cn(styles.item, className)} onClick={onClick}>
      {children}
    </div>
  );
};

export const Separator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn(styles.separator, className)} />;
};

export const Footer: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  return <div className={cn(styles.footer, className)}>{children}</div>;
};

export const Root: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  const [open, setOpen] = useState(false);

  const setOpenMemo = useCallback((newState: boolean) => {
    if (newState === true) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
    setOpen(newState);
  }, []);

  const contextValue = useMemo(
    () => ({ open, setOpen: setOpenMemo }),
    [open, setOpenMemo]
  );

  let content: ReactNode;
  let trigger: ReactNode;
  let header: ReactNode;
  let footer: ReactNode;

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;
    if (child.type === Content) {
      content = child;
    } else if (child.type === Header) {
      header = child;
    } else if (child.type === Footer) {
      footer = child;
    } else if (child.type === Trigger) {
      trigger = child;
    }
  });

  return (
    <DrawerContext.Provider value={contextValue}>
      {trigger}

      {createPortal(
        <div
          className={cn(styles.root, className, {
            [styles.open]: open,
            [styles.closed]: !open
          })}
        >
          {header}
          {content}
          {footer}
        </div>,
        document.body
      )}
    </DrawerContext.Provider>
  );
};
