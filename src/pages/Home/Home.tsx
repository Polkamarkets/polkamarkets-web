import { useCallback, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { pages, ui } from 'config';
import { Container, useRect, useTheme } from 'ui';

import { MarketList } from 'components';

import homeClasses from './Home.module.scss';
import HomeFilter from './HomeFilter';
import HomeHero from './HomeHero';
import HomeNav from './HomeNav';

export default function Home() {
  const routeMatch = useRouteMatch();
  const theme = useTheme();
  const [ref, rect] = useRect();
  const [show, setShow] = useState(false);
  const handleShow = useCallback(() => setShow(true), []);
  const handleHide = useCallback(() => setShow(false), []);
  const handleToggle = useCallback(() => setShow(prevShow => !prevShow), []);

  return (
    <Switch>
      <Route exact path={routeMatch.path}>
        {ui.hero.enabled && theme.device.type.isDesktop && <HomeHero />}
        <Container ref={ref} $enableGutters className={homeClasses.nav}>
          <HomeNav
            onFilterClick={
              theme.device.type.isDesktop ? handleToggle : handleShow
            }
          />
        </Container>
        <div className={homeClasses.root}>
          <HomeFilter onFilterHide={handleHide} rect={rect} show={show} />
          <MarketList />
        </div>
      </Route>
      {Object.values(pages.home.pages).map(page => (
        <Route
          key={page.name}
          exact={page.exact}
          path={page.pathname}
          component={page.Component}
        />
      ))}
    </Switch>
  );
}
