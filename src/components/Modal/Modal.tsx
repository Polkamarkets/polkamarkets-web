import React, { useEffect, useRef } from 'react';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import {
  useClickaway,
  usePortal,
  usePrevious,
  useFocustrap,
  useMount,
  useTimeoutEffect
} from 'hooks';

import ModalClasses from './Modal.module.scss';
import type { ModalProps } from './Modal.type';
import { modalTrappersId } from './Modal.util';

export default function Modal({
  onHide,
  show,
  className,
  backdrop,
  centered,
  size,
  ...props
}: ModalProps) {
  const { current: didMount } = useMount();
  const { current: showPrev } = usePrevious(show);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutEffect = useTimeoutEffect();
  const Portal = usePortal({
    root: document.body,
    onEffect() {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.removeAttribute('style');
      };
    }
  });

  useEffect(() => {
    if (showPrev && !show) {
      if (didMount) timeoutEffect(Portal.unmount, 300);
    } else {
      Portal.mount(show);
    }
  }, [Portal, didMount, show, showPrev, timeoutEffect]);
  useClickaway(ref, () => onHide?.(), [!!showPrev, show]);
  useFocustrap(
    ref,
    ['a[href]', 'button:not([disabled])', 'textarea', 'input', 'select'],
    modalTrappersId
  );

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') onHide?.();
  }

  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            className={cn(
              ModalClasses.root,
              {
                [ModalClasses.backdrop]: backdrop,
                [ModalClasses.flex]: centered
              },
              className?.root
            )}
            onKeyDown={handleKeyDown}
          >
            <motion.div
              ref={ref}
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              exit={{ y: 8 }}
              role="dialog"
              aria-modal="true"
              className={cn(
                ModalClasses.dialog,
                {
                  [ModalClasses.center]: centered,
                  [ModalClasses.sm]: size === 'sm',
                  [ModalClasses.md]: size === 'md',
                  [ModalClasses.lg]: size === 'lg'
                },
                className?.dialog
              )}
              {...props}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
