import { Suspense, lazy } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { useAppSelector } from 'hooks';

const PrivateBeta = lazy(() => import('pages/PrivateBeta'));

const AuthRoutes = () => {
  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );

  return (
    <Suspense fallback={null}>
      <Switch>{walletConnected ? <Redirect to="/" /> : <PrivateBeta />}</Switch>
    </Suspense>
  );
};

export default AuthRoutes;
