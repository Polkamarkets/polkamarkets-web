import { useCallback, useState } from 'react';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
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

import useLocalStorage from 'hooks/useLocalStorage';

import styles from './Onboarding.module.scss';
import type { OnboardingProps } from './Onboarding.type';
import {
  ARIA,
  defaultSwipe,
  getButtonValue,
  getSwipePower,
  swipeThreshold,
  variants,
  wrap
} from './Onboarding.utils';

function Onboarding({ steps }: OnboardingProps) {
  const [onboardingCompleted, setOnboardingCompleted] =
    useLocalStorage<boolean>('onboardingCompleted', false);

  // TODO: Compose useMotionSwipe
  const [swipe, setSwipe] = useState(defaultSwipe);

  const stepIndex = wrap(0, steps.length, swipe.step);
  const stepsLenght = steps.length - 1;
  const isLastStep = stepsLenght === swipe.step;

  const handleHide = useCallback(() => {
    setOnboardingCompleted(true);
    setSwipe(defaultSwipe);
  }, [setOnboardingCompleted]);
  const handleStep = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const value = +event.currentTarget.value;

      // TODO: fix flickering due to direction not waiting until new value updates
      setSwipe(prevSwipe => ({
        step: prevSwipe.step + value,
        direction: value
      }));
    },
    []
  );
  const handleDragEnd = useCallback(
    (_, info: PanInfo) => {
      const swipePower = getSwipePower(info.offset.x, info.velocity.x);

      if (swipePower < -swipeThreshold && swipe.step !== stepsLenght) {
        handleStep(getButtonValue('1'));
      } else if (swipePower > swipeThreshold && swipe.step !== 0) {
        handleStep(getButtonValue('-1'));
      }
    },
    [handleStep, stepsLenght, swipe.step]
  );

  return (
    <Modal
      centered
      show={!onboardingCompleted}
      onHide={handleHide}
      className={{
        dialog: styles.dialog
      }}
    >
      <ModalContent className={styles.content}>
        <ModalHeader>
          <ModalHeaderHide onClick={handleHide} />
        </ModalHeader>
        {/** TODO: Compose MotionSwipe */}
        <AnimatePresence>
          <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragElastic={1}
            key={swipe.step}
            custom={swipe.direction}
            variants={variants}
            className={styles.container}
            onDragEnd={handleDragEnd}
            dragConstraints={{
              left: 0,
              right: 0
            }}
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
          >
            <div
              className={classNames(styles.header, {
                [styles.headerWithAvatar]: steps.some(step => step.imageUrl)
              })}
            >
              {steps[stepIndex].imageUrl && (
                <Avatar
                  alt=""
                  $size="md"
                  $radius="lg"
                  src={steps[stepIndex].imageUrl}
                />
              )}
            </div>
            {steps[stepIndex].title && (
              <ModalHeaderTitle
                id={ARIA['aria-labelledby']}
                className={classNames(styles.title, 'pm-c-modal__header-title')}
              >
                {steps[stepIndex].title}
              </ModalHeaderTitle>
            )}
            <ModalSection>
              {steps[stepIndex].description && (
                <ModalSectionText
                  id={ARIA['aria-describedby']}
                  className={classNames(
                    styles.description,
                    'pm-c-modal__section-description'
                  )}
                >
                  {steps[stepIndex].description}
                </ModalSectionText>
              )}
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
                    aria-label={index === swipe.step ? undefined : item.title}
                    aria-hidden={index === swipe.step ? 'true' : undefined}
                    value={index - swipe.step}
                    onClick={handleStep}
                    className={classNames(styles.stepsItemButton, {
                      [styles.stepsItemButtonActive]: index === swipe.step
                    })}
                  />
                </li>
              ))}
            </ul>
          )}
          <Button
            size="sm"
            color="primary"
            value={1}
            fullwidth
            onClick={isLastStep ? handleHide : handleStep}
          >
            {isLastStep ? "Let's Go" : 'Next'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Onboarding;
