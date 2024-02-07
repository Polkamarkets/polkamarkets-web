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
  getButtonValue,
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

  const stepIndex = wrap(0, steps.length, step);
  const stepsLenght = steps.length - 1;
  const isLastStep = stepsLenght === step;

  const handleHide = useCallback(() => {
    setOnboarding(true);
    setStep([0, 0]);
  }, [setOnboarding]);
  const handleStep = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const newDirection = +event.currentTarget.value;

      setStep(([prevStep]) => [prevStep + newDirection, newDirection]);
    },
    []
  );
  const handleDragEnd = useCallback(
    (_, info: PanInfo) => {
      const swipe = getSwipePower(info.offset.x, info.velocity.x);

      if (swipe < -swipeThreshold)
        handleStep(getButtonValue(step === stepsLenght ? '0' : '1'));
      else if (swipe > swipeThreshold)
        handleStep(getButtonValue(step === 0 ? '0' : '-1'));
    },
    [handleStep, step, stepsLenght]
  );

  return (
    <Modal
      centered
      show={!onboarding}
      onHide={handleHide}
      className={{
        dialog: styles.dialog
      }}
    >
      <ModalContent className={styles.content}>
        <ModalHeader>
          <ModalHeaderHide onClick={handleHide} />
        </ModalHeader>
        <AnimatePresence>
          <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragElastic={1}
            key={step}
            custom={direction}
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
            <div className={styles.header}>
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
                    aria-label={`Go to step ${index + 1}`}
                    className={classNames(styles.stepsItemButton, {
                      [styles.stepsItemButtonActive]: index === step
                    })}
                    value={index - step}
                    onClick={handleStep}
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
