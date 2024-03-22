import * as Sentry from '@sentry/react';
import classNames from 'classnames';
import { Providers, ui } from 'config';
import { Form, Formik } from 'formik';
import { login } from 'redux/ducks/polkamarkets';
import { Button } from 'ui/Button';

import { ConnectMetamask, Input } from 'components';
import Icon, { IconNames } from 'components/Icon';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';

import { useAppDispatch, usePolkamarketsService } from 'hooks';

import stylesAuth from './AuthModal.module.scss';
import styles from './SignIn.module.scss';

export type SignInProps = {
  onSignup: () => void;
  onForgetPassword: () => void;
};
export const SignIn: React.FC<SignInProps> = ({
  onSignup,
  onForgetPassword
}) => {
  const dispatch = useAppDispatch();
  const polkamarketsService = usePolkamarketsService();
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.name as Exclude<Providers, 'Email'>;

    try {
      const success = await polkamarketsService[`socialLogin${name}`]();

      if (success) {
        dispatch(login(polkamarketsService));
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleSubmit = async (event: { email: string; password: string }) => {
    if (event.email) {
      try {
        const success = await polkamarketsService.socialLoginEmail(event.email);

        if (success) {
          dispatch(login(polkamarketsService));
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  };

  const renderProviders = (provider: Providers) => {
    if (provider === 'MetaMask')
      return (
        <ConnectMetamask key={provider}>
          <Icon size="lg" name={provider} /> Continue with {provider}
        </ConnectMetamask>
      );

    return (
      <Button
        variant="light"
        size="lg"
        key={provider}
        name={provider}
        onClick={handleClick}
      >
        <Icon size="lg" name={provider as IconNames} /> Continue with {provider}
      </Button>
    );
  };
  return (
    <>
      <ModalHeader>
        <ModalHeaderTitle className={stylesAuth.headerTitle}>
          Log in to Foreland
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalSection className={stylesAuth.content}>
        <p className={stylesAuth.subtitle}>
          Don&apos;t have an account?{' '}
          <a href="/#" onClick={onSignup}>
            Sign up for free
          </a>
        </p>
        <div className={stylesAuth.providers}>
          {ui.socialLogin.providers
            .filter(p => p !== 'Email')
            .map(renderProviders)}
        </div>
        {ui.socialLogin.providers.includes('Email') && (
          <>
            <span className={stylesAuth.or}>or</span>
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              <Form className={classNames(styles.formRoot)}>
                <Input
                  type="email"
                  name="email"
                  placeholder="Username or Email"
                  className={styles.input}
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input}
                />
                <div className={styles.forgotPassword}>
                  Forgot
                  <a href="/#" onClick={onForgetPassword}>
                    {' '}
                    password?
                  </a>
                </div>
                <Button variant="primary" size="lg">
                  Log in
                </Button>
              </Form>
            </Formik>
          </>
        )}
      </ModalSection>
    </>
  );
};

export default SignIn;
