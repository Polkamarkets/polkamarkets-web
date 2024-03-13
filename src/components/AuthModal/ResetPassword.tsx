import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { Button } from 'ui/Button';

import { Input, ModalHeader, ModalHeaderTitle, ModalSection } from 'components';

import stylesAuth from './AuthModal.module.scss';
import styles from './SignIn.module.scss';

export const ResetPassword = () => {
  const handleSubmit = (_values: { email: string }) => {
    // TODO: implement forgot password
  };
  return (
    <>
      <ModalHeader>
        <ModalHeaderTitle className={stylesAuth.headerTitle}>
          Reset your password
        </ModalHeaderTitle>
      </ModalHeader>
      <ModalSection className={stylesAuth.content}>
        <div className={stylesAuth.subtitle}>
          Enter your email and we&apos;ll email you with instructions on how to
          reset your password.
        </div>
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

            <Button variant="primary" size="lg" className={styles.resetButton}>
              Reset password
            </Button>
          </Form>
        </Formik>
      </ModalSection>
    </>
  );
};

export default ResetPassword;
