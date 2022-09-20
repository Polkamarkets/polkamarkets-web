import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkConfig } from 'config/environment';
import { PolkamarketsService } from 'services';

export type Action = {
  action: string;
  marketId: number;
  outcomeId: number;
  shares: number;
  value: number;
  timestamp: number;
  transactionHash: string;
};

export type PolkamarketsInitialState = {
  isLoggedIn: boolean;
  networkId: string;
  ethAddress: string;
  ethBalance: number;
  polkBalance: number;
  polkApproved: boolean;
  portfolio: any;
  actions: Action[];
  marketsWithActions: string[];
  bonds: any;
  marketsWithBonds: string[];
  bondActions: any[];
  isLoading: {
    portfolio: boolean;
    bonds: boolean;
    actions: boolean;
  };
};

const initialState: PolkamarketsInitialState = {
  isLoggedIn: false,
  networkId: '',
  ethAddress: '',
  ethBalance: 0,
  polkBalance: 0,
  polkApproved: false,
  portfolio: {},
  actions: [],
  marketsWithActions: [],
  bonds: {},
  marketsWithBonds: [],
  bondActions: [],
  isLoading: {
    portfolio: false,
    bonds: false,
    actions: false
  }
};

const polkamarketsSlice = createSlice({
  name: 'polkamarkets',
  initialState,
  reducers: {
    changeIsLoggedIn: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoggedIn: action.payload
    }),
    changeNetworkId: (state, action: PayloadAction<string>) => ({
      ...state,
      networkId: action.payload
    }),
    changeEthAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      ethAddress: action.payload
    }),
    changeEthBalance: (state, action: PayloadAction<number>) => ({
      ...state,
      ethBalance: action.payload
    }),
    changePolkBalance: (state, action: PayloadAction<number>) => ({
      ...state,
      polkBalance: action.payload
    }),
    changePolkApproved: (state, action: PayloadAction<boolean>) => ({
      ...state,
      polkApproved: action.payload
    }),
    changePortfolio: (state, action: PayloadAction<Object>) => ({
      ...state,
      portfolio: action.payload
    }),
    changeActions: (state, action: PayloadAction<Action[]>) => ({
      ...state,
      actions: action.payload
    }),
    changeMarketsWithActions: {
      reducer: (state, action: PayloadAction<string[]>) => ({
        ...state,
        marketsWithActions: action.payload
      }),
      prepare: (actions: Action[]) => {
        return {
          payload: actions.map(action => action.marketId.toString())
        };
      }
    },
    changeBonds: (state, action: PayloadAction<Object>) => ({
      ...state,
      bonds: action.payload
    }),
    changeMarketsWithBonds: (state, action: PayloadAction<string[]>) => ({
      ...state,
      marketsWithBonds: action.payload
    }),
    changeBondActions: (state, action: PayloadAction<any>) => ({
      ...state,
      bondActions: action.payload
    }),
    changeLoading: (
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        [action.payload.key]: action.payload.value
      }
    })
  }
});

export default polkamarketsSlice.reducer;

const {
  changeIsLoggedIn,
  changeNetworkId,
  changeEthAddress,
  changeEthBalance,
  changePolkBalance,
  changePolkApproved,
  changePortfolio,
  changeActions,
  changeMarketsWithActions,
  changeBonds,
  changeMarketsWithBonds,
  changeBondActions,
  changeLoading
} = polkamarketsSlice.actions;

// fetching initial wallet details
function login(networkConfig: NetworkConfig) {
  return async dispatch => {
    const polkamarketsService = new PolkamarketsService(networkConfig);

    const isLoggedIn = await polkamarketsService.isLoggedIn();
    dispatch(changeIsLoggedIn(isLoggedIn));

    if (isLoggedIn) {
      await polkamarketsService.login();

      const address = await polkamarketsService.getAddress();
      dispatch(changeEthAddress(address));

      const balance = await polkamarketsService.getBalance();
      dispatch(changeEthBalance(balance));

      const polkBalance = await polkamarketsService.getERC20Balance();
      dispatch(changePolkBalance(polkBalance));

      const polkApproved = await polkamarketsService.isRealitioERC20Approved();
      dispatch(changePolkApproved(polkApproved));
    }
  };
}

function fetchAditionalData(networkConfig: NetworkConfig) {
  return async dispatch => {
    const polkamarketsService = new PolkamarketsService(networkConfig);
    const isLoggedIn = await polkamarketsService.isLoggedIn();

    if (isLoggedIn) {
      await polkamarketsService.login();

      dispatch(
        changeLoading({
          key: 'portfolio',
          value: true
        })
      );

      dispatch(
        changeLoading({
          key: 'bonds',
          value: true
        })
      );

      dispatch(
        changeLoading({
          key: 'actions',
          value: true
        })
      );

      const portfolio = await polkamarketsService.getPortfolio();
      dispatch(changePortfolio(portfolio));

      const bonds = await polkamarketsService.getBonds();
      dispatch(changeBonds(bonds));

      const bondMarketIds = await polkamarketsService.getBondMarketIds();
      dispatch(changeMarketsWithBonds(bondMarketIds));

      dispatch(
        changeLoading({
          key: 'portfolio',
          value: false
        })
      );

      dispatch(
        changeLoading({
          key: 'bonds',
          value: false
        })
      );

      const actions = (await polkamarketsService.getActions()) as Action[];
      dispatch(changeActions(actions));
      dispatch(changeMarketsWithActions(actions));

      dispatch(
        changeLoading({
          key: 'actions',
          value: false
        })
      );

      const bondActions = await polkamarketsService.getBondActions();
      dispatch(changeBondActions(bondActions));
    }
  };
}

export {
  changeIsLoggedIn,
  changeNetworkId,
  changeEthAddress,
  changeEthBalance,
  changePolkBalance,
  changePolkApproved,
  changePortfolio,
  changeActions,
  changeBonds,
  changeBondActions,
  login,
  fetchAditionalData
};
