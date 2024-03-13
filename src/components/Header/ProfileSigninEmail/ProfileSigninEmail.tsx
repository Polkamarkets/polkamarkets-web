import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button } from 'ui/Button';

import { Input } from 'components/Input';

import styles from './ProfileSigninEmail.module.scss';

type ProfileSigninEmailProps = Omit<
  React.ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> & {
  onSubmit: (values: { email: string; password: string }) => void;
};

export default function ProfileSigninEmail({
  onSubmit
}: ProfileSigninEmailProps) {
  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form className={classNames(styles.root)}>
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
          Forgot<a href="/forgot-password"> password?</a>
        </div>
        <Button variant="primary" size="lg" className={styles.email}>
          Log in
        </Button>
      </Form>
    </Formik>
  );
}
