import classNames from 'classnames';
import { Providers, ui } from 'config';
import { Form, Formik } from 'formik';
import { Button } from 'ui/Button';

import { ConnectMetamask, Input } from 'components';
import Icon, { IconNames } from 'components/Icon';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';

// import { useAppDispatch, usePolkamarketsService } from 'hooks';

import stylesAuth from './AuthModal.module.scss';
import styles from './SignIn.module.scss';

export type SignUpProps = { onSignIn: () => void };
export const SignUp: React.FC<SignUpProps> = ({ onSignIn }) => {
  //   const dispatch = useAppDispatch();
  //   const polkamarketsService = usePolkamarketsService();
  const handleClick = async (_event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: implement social login
  };

  const handleSubmit = (_event: { email: string }) => {
    // TODO: add email login here
  };

  const renderProviders = (provider: Providers) => {
    if (provider === 'MetaMask')
      return (
        <ConnectMetamask key={provider} className={stylesAuth.social}>
          <Icon size="lg" name={provider} /> Continue with {provider}
        </ConnectMetamask>
      );

    return (
      <Button
        variant="outlined"
        size="lg"
        key={provider}
        name={provider}
        className={stylesAuth.social}
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
          Create an account
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalSection className={stylesAuth.content}>
        <p className={stylesAuth.subtitle}>
          Already have an account?{' '}
          <a href="/#" onClick={onSignIn}>
            Log in
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
                email: ''
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
                  placeholder="Your email"
                  className={styles.input}
                />
                <div className={styles.terms}>
                  By continuing, you agree to our Terms of Service and
                  acknowledge you&apos;ve read our Privacy Policy.
                </div>
                <Button variant="primary" size="lg">
                  Sign up for free
                </Button>
              </Form>
            </Formik>
          </>
        )}
      </ModalSection>
    </>
  );
};

export default SignUp;
