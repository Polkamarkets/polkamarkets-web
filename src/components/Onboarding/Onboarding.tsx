import { useCallback, useState } from 'react';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar } from 'ui';

import { Button } from 'components/Button';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderHide from 'components/ModalHeaderHide';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';

import { useLocalStorage } from 'hooks';

import styles from './Onboarding.module.scss';
import type { OnboardingProps } from './Onboarding.type';
import {
  ARIA,
  getSwipePower,
  swipeThreshold,
  variants,
  wrap
} from './Onboarding.utils';

function Onboarding({ steps }: OnboardingProps) {
  const [onboarding, setOnboarding] = useLocalStorage<boolean>(
    'onboardingCompleted',
    false
  );

  const [[step, direction], setStep] = useState([0, 0]);

  const isLastStep = steps.length - 1 === step;
  const imageIndex = wrap(0, steps.length, step);

  const handleHide = useCallback(() => {
    setOnboarding(true);
    setStep([0, 0]);
  }, [setOnboarding]);
  const handleStep = useCallback(
    (newDirection: number) => {
      if (isLastStep) handleHide();
      else setStep([step + newDirection, newDirection]);
    },
    [handleHide, isLastStep, step]
  );

  return (
    <Modal show={!onboarding} centered size="sm" onHide={handleHide}>
      <ModalContent className={styles.content}>
        <ModalHeader>
          <ModalHeaderHide onClick={handleHide} />
        </ModalHeader>
        <AnimatePresence>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: 'spring',
                stiffness: 300,
                damping: 30
              },
              opacity: {
                duration: 0.2
              }
            }}
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0
            }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = getSwipePower(offset.x, velocity.x);

              if (swipe < -swipeThreshold) {
                handleStep(1);
              } else if (swipe > swipeThreshold) {
                handleStep(-1);
              }
            }}
          >
            <div className={styles.header}>
              {steps[imageIndex].imageUrl && (
                <Avatar
                  $size="md"
                  $radius="lg"
                  src={steps[imageIndex].imageUrl}
                  alt={steps[imageIndex].title}
                />
              )}
            </div>
            <ModalHeaderTitle
              id={ARIA['aria-labelledby']}
              className={classNames(styles.title, 'pm-c-modal__header-title')}
            >
              {steps[imageIndex].title}
            </ModalHeaderTitle>
            <ModalSection>
              <ModalSectionText
                id={ARIA['aria-describedby']}
                className={classNames(
                  styles.description,
                  'pm-c-modal__section-description'
                )}
              >
                {steps[imageIndex].description}
              </ModalSectionText>
            </ModalSection>
          </motion.div>
        </AnimatePresence>
        <ModalFooter className={styles.footer}>
          {steps.length >= 2 && (
            <ul className={styles.steps}>
              {steps.map((item, index) => (
                <li key={item.title} className={styles.stepsItem}>
                  <button
                    type="button"
                    aria-label={`Go to step ${index + 1}`}
                    className={classNames(styles.stepsItemButton, {
                      [styles.stepsItemButtonActive]: index === step
                    })}
                    onClick={() => {
                      handleStep(index > step ? 1 : -1);
                      /*  if (index > step) {
                          handleStep(1); 
                        } else if (index < step) {
                          handleStep(-1);
                        } */
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
          <Button
            size="sm"
            color="primary"
            fullwidth
            onClick={() => {
              handleStep(1);
            }}
          >
            {isLastStep ? "Let's Go" : 'Next'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Onboarding;
