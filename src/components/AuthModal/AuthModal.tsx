import { useState } from 'react';

import type { ButtonProps } from 'ui/Button';
import { Button } from 'ui/Button';
import { ButtonIcon } from 'ui/Button/ButtonIcon';

import { RemoveOutlinedIcon } from 'assets/icons';

import { Icon } from 'components';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';

import styles from './AuthModal.module.scss';
import { ResetPassword } from './ResetPassword';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

const enum AuthModalPage {
  Signin = 'signin',
  Signup = 'signup',
  ForgotPassword = 'forgot-password'
}

export default function AuthModal({ onClick, ...props }: ButtonProps) {
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(AuthModalPage.Signin);

  const handleHide = () => {
    setPage(AuthModalPage.Signin);
    setShow(false);
  };

  return (
    <>
      <Modal show={show} centered onHide={handleHide} size="sm">
        <ModalContent>
          <div className={styles.closeWrapper}>
            {page === AuthModalPage.ForgotPassword && (
              <ButtonIcon
                variant="outlined"
                className={styles.backButton}
                aria-label="Back"
                onClick={() => setPage(AuthModalPage.Signin)}
              >
                <Icon name="Arrow" dir="left" />
              </ButtonIcon>
            )}
            <ButtonIcon
              variant="outlined"
              className={styles.closeButton}
              aria-label="Hide"
              onClick={handleHide}
            >
              <RemoveOutlinedIcon />
            </ButtonIcon>
          </div>
          <div className={styles.modalContent}>
            {page === AuthModalPage.Signin && (
              <SignIn
                onSignup={() => setPage(AuthModalPage.Signup)}
                onForgetPassword={() => setPage(AuthModalPage.ForgotPassword)}
              />
            )}
            {page === AuthModalPage.Signup && (
              <SignUp onSignIn={() => setPage(AuthModalPage.Signin)} />
            )}
            {page === AuthModalPage.ForgotPassword && <ResetPassword />}
          </div>
        </ModalContent>
      </Modal>

      <Button
        onClick={event => {
          onClick?.(event);
          setShow(true);
        }}
        className={styles.signin}
        {...props}
      />
    </>
  );
}
