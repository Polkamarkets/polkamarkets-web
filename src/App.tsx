import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import store from 'redux/store';
import Routes from 'routes';

import FavoriteMarketsProvider from 'contexts/favoriteMarkets';
import { FiltersProvider } from 'contexts/filters';
import { NetworksProvider } from 'contexts/networks';
import ThemeProvider from 'contexts/theme';
import { VoteProvider } from 'contexts/vote';

import { NetworkProvider } from 'hooks/useNetwork';
import { PolkamarketsServiceProvider } from 'hooks/usePolkamarketsService';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Provider store={store}>
          <Router>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <NetworkProvider>
                <PolkamarketsServiceProvider>
                  <NetworksProvider>
                    <FiltersProvider>
                      <FavoriteMarketsProvider>
                        <VoteProvider>
                          <Routes />
                        </VoteProvider>
                      </FavoriteMarketsProvider>
                    </FiltersProvider>
                  </NetworksProvider>
                </PolkamarketsServiceProvider>
              </NetworkProvider>
            </MuiPickersUtilsProvider>
          </Router>
        </Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
