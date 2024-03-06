import { Suspense, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { pages, ui, environment } from 'config';
import { Spinner } from 'ui';

import { Layout } from 'components';

import { useWhitelist } from 'contexts/whitelist';

import { useAppSelector, useCookie } from 'hooks';

export default function AppRoutes() {
  const { isEnabled } = useWhitelist();

  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const isLoadingLogin = useAppSelector(
    state => state.polkamarkets.isLoading.login
  );

  const [_loggedInCookie, setLoggedInCookie] = useCookie(
    'isLoggedIn',
    isLoggedIn ? 'true' : 'false'
  );

  useEffect(() => {
    if (!isLoadingLogin) {
      setLoggedInCookie(isLoggedIn ? 'true' : 'false');
    }
  }, [isLoadingLogin, isLoggedIn, setLoggedInCookie]);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {/* <Route
          exact={pages.embed.exact}
          path={pages.embed.pathname}
          component={pages.embed.Component}
        /> */}
        {isEnabled ? (
          <Route
            exact={pages.whitelist.exact}
            path={pages.whitelist.pathname}
            component={pages.whitelist.Component}
          />
        ) : null}
        <Route
          exact={pages.restrictedCountry.exact}
          path={pages.restrictedCountry.pathname}
          component={pages.restrictedCountry.Component}
        />
        {environment.HOMEPAGE_URL && (
          <Route exact path="/">
            {/* removing the trailing slash, if existent */}
            <Redirect to={environment.HOMEPAGE_URL.replace(/\/$/, '')} />
          </Route>
        )}
        <Route
          path="/"
          render={() => (
            <Layout>
              <Switch>
                {Object.values(pages)
                  .filter(page => page.enabled)
                  .map(page => (
                    <Route
                      key={page.name}
                      exact={page.exact}
                      path={page.pathname}
                      component={page.Component}
                    />
                  ))}
                {ui.clubs.enabled && (
                  <Redirect from="/leaderboard/:slug" to="/clubs/:slug" />
                )}
                <Redirect from="/lands/:slug" to="/:slug" />
                <Route
                  exact={pages.error404.exact}
                  path={pages.error404.pathname}
                  component={pages.error404.Component}
                />
              </Switch>
            </Layout>
          )}
        />
      </Switch>
    </Suspense>
  );
}
