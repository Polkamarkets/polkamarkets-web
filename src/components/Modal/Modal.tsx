import React, { useEffect, useRef } from 'react';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import { RemoveOutlinedIcon } from 'assets/icons';

import { Button } from 'components/Button';
import Text, { TextProps } from 'components/Text';

import { useClickaway, usePortal, usePrevious, useTrapfocus } from 'hooks';

import {
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalSectionProps
} from './Modal.type';
import { modalData, ModalContext, useModalContext } from './Modal.util';

function Modal({ children, onHide, show, name }: ModalProps) {
  const { current: showPrev } = usePrevious(show);
  const ref = useRef<HTMLDivElement>(null);
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
      setTimeout(Portal.unmount, 300);
    } else {
      Portal.mount(show);
    }
  }, [Portal, show, showPrev]);
  useClickaway(ref, () => onHide?.(), [showPrev, show]);
  useTrapfocus(ref);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') onHide?.();
  }

  return (
    <Portal>
      <ModalContext.Provider value={{ name, onHide }}>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="presentation"
              className="pm-c-modal__overlay"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                ref={ref}
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                exit={{ y: 16 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${name}-${modalData.title}`}
                aria-describedby={`${name}-${modalData.description}`}
                className="pm-c-modal"
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalContext.Provider>
    </Portal>
  );
}
function Header({ className, children, ...props }: ModalHeaderProps) {
  const { onHide } = useModalContext();

  return (
    <header className={cn('pm-c-modal__header', className)} {...props}>
      {children}
      {onHide && (
        <Button
          variant="ghost"
          onClick={onHide}
          className="pm-c-modal__header-hide"
          aria-label="Hide"
        >
          <RemoveOutlinedIcon />
        </Button>
      )}
    </header>
  );
}
function HeaderTitle({ className, ...props }: TextProps) {
  const { name } = useModalContext();

  return (
    <Text
      as="h2"
      fontWeight="medium"
      className={cn('pm-c-modal__header-title', className)}
      scale="heading"
      id={`${name}-${modalData.title}`}
      {...props}
    />
  );
}
function Section({ className, ...props }: ModalSectionProps) {
  return (
    <section className={cn('pm-c-modal__section', className)} {...props} />
  );
}
function SectionText({ className, ...props }: TextProps) {
  const { name } = useModalContext();

  return (
    <Text
      className={cn('pm-c-modal__section-text', className)}
      scale="caption"
      id={`${name}-${modalData.description}`}
      {...props}
    />
  );
}
function Footer({ className, ...props }: ModalFooterProps) {
  return <footer className={cn('pm-c-modal__footer', className)} {...props} />;
}

export default Object.assign(Modal, {
  Header,
  HeaderTitle,
  Section,
  SectionText,
  Footer
});
