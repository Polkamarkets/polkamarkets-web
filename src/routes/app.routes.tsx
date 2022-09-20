import { useEffect, useState, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import { environment } from 'config';
import { getUserCountry } from 'helpers/location';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { fetchAditionalData } from 'redux/ducks/polkamarkets';

import { Layout } from 'components';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';

const Home = lazy(() => import('pages/Home'));
const Market = lazy(() => import('pages/Market'));
const Portfolio = lazy(() => import('pages/Portfolio'));
const WrongNetwork = lazy(() => import('pages/WrongNetwork'));
const CreateMarket = lazy(() => import('pages/CreateMarket'));
const RestrictedCountry = lazy(() => import('pages/RestrictedCountry'));
const Achievements = lazy(() => import('pages/Achievements'));
const Leaderboard = lazy(() => import('pages/Leaderboard'));
const Profile = lazy(() => import('pages/Profile'));

const { REACT_APP_RESTRICTED_COUNTRIES } = process.env;

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const walletConnected = useAppSelector(
    state => state.polkamarkets.isLoggedIn
  );
  const { network, networkConfig } = useNetwork();

  const isAllowedNetwork =
    !walletConnected || Object.keys(environment.NETWORKS).includes(network.id);

  const restrictedCountries = REACT_APP_RESTRICTED_COUNTRIES?.split(',');
  const [isAllowedCountry, setIsAllowedCountry] = useState(true);

  useEffect(() => {
    if (isAllowedNetwork && walletConnected) {
      dispatch(fetchAditionalData(networkConfig));
    }
  }, [dispatch, isAllowedNetwork, networkConfig, walletConnected]);

  useEffect(() => {
    async function fetchUserCountry() {
      if (!isUndefined(restrictedCountries) && !isEmpty(restrictedCountries)) {
        const userCountry = await getUserCountry();

        setIsAllowedCountry(
          !restrictedCountries.includes(userCountry.countryCode)
        );
      }
    }
    fetchUserCountry();
  }, [restrictedCountries]);

  if (!isAllowedCountry)
    return (
      <Suspense fallback={null}>
        <RestrictedCountry />
      </Suspense>
    );

  if (!isAllowedNetwork)
    return (
      <Suspense fallback={null}>
        <WrongNetwork />
      </Suspense>
    );

  return (
    <Layout>
      <Suspense fallback={null}>
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Market} path="/markets" />
          <Route component={Portfolio} path="/portfolio" />
          <Route component={CreateMarket} path="/market/create" />
          <Route component={Achievements} path="/achievements" />
          <Route component={Leaderboard} path="/leaderboard" />
          <Route component={Profile} path="/user/:address" />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;
