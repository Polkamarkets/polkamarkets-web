import { useCallback, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { pages, ui } from 'config';
import { Container, useRect, useTheme } from 'ui';

import { MarketList } from 'components';

import styles from './Markets.module.scss';
import MarketsFilter from './MarketsFilter';
import MarketsHero from './MarketsHero';
import MarketsNav from './MarketsNav';

export default function Markets() {
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
        <div className="max-width-screen-xl">
          {ui.hero.enabled && <MarketsHero />}
          <Container ref={ref} className={styles.nav}>
            <MarketsNav
              onFilterClick={theme.device.isDesktop ? handleToggle : handleShow}
            />
          </Container>
          <div className={styles.root}>
            <MarketsFilter
              onFilterHide={handleHide}
              rect={rect}
              show={show}
              resetStatesDropdown={!ui.filters.enabled}
            />
            <MarketList
              filtersVisible={show}
              classNames={{ root: styles.list }}
            />
          </div>
        </div>
      </Route>
      {Object.values(pages.markets.pages).map(page => (
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
