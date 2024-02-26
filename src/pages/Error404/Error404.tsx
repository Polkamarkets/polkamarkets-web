import { Link, useLocation } from 'react-router-dom';

import Icon from 'components/Icon';

import classes from './Error404.module.scss';

export default function Error404() {
  const location = useLocation();

  return (
    <section className={classes.root}>
      <h2 className={classes.header}>Ooops!</h2>
      <p className={classes.description}>
        Page <code>{location.pathname}</code> not found.
      </p>
      <Link className="pm-c-button-outline--default pm-c-button--sm" to="/">
        <Icon name="Arrow" size="md" />
        Back to Home
      </Link>
    </section>
  );
}
