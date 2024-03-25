import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { PrivyProvider } from '@privy-io/react-auth';
import { networks, ui } from 'config';
import store from 'redux/store';
import Routes from 'routes';
import { ThemeProvider } from 'ui';
import { gnosis } from 'viem/chains';

import { ExternalJS, SeoIcons } from 'components';

import FavoriteMarketsProvider from 'contexts/favoriteMarkets';
import { FiltersProvider } from 'contexts/filters';
import { NetworksProvider } from 'contexts/networks';
import { TradeProvider } from 'contexts/trade';
import { VoteProvider } from 'contexts/vote';
import { WhitelistProvider } from 'contexts/whitelist';

import { LanguageProvider } from 'hooks/useLanguage';
import { NetworkProvider } from 'hooks/useNetwork';
import { PolkamarketsServiceProvider } from 'hooks/usePolkamarketsService';

export default function App() {
  let defaultChain = gnosis;

  if (ui.socialLogin.enabled) {
    defaultChain =
      networks[`0x${Number(ui.socialLogin.networkId).toString(16)}`].viemChain!;
  }

  return (
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID || ''}
      config={{
        defaultChain,
        supportedChains: [defaultChain]
      }}
    >
      <ThemeProvider>
        <ExternalJS />
        <SeoIcons />
        <Provider store={store}>
          <Router>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <WhitelistProvider>
                <LanguageProvider>
                  <NetworkProvider>
                    <PolkamarketsServiceProvider>
                      <NetworksProvider>
                        <FiltersProvider>
                          <FavoriteMarketsProvider>
                            <VoteProvider>
                              <TradeProvider>
                                <Routes />
                              </TradeProvider>
                            </VoteProvider>
                          </FavoriteMarketsProvider>
                        </FiltersProvider>
                      </NetworksProvider>
                    </PolkamarketsServiceProvider>
                  </NetworkProvider>
                </LanguageProvider>
              </WhitelistProvider>
            </MuiPickersUtilsProvider>
          </Router>
        </Provider>
      </ThemeProvider>
    </PrivyProvider>
  );
}
