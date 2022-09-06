import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkConfig } from 'config/environment';
import { PolkamarketsService } from 'services';

const initialState = {
  isLoggedIn: false,
  networkId: '',
  ethAddress: '',
  ethBalance: 0,
  polkBalance: 0,
  polkApproved: false,
  portfolio: {},
  actions: [],
  bonds: {},
  bondActions: [],
  isLoading: {
    portfolio: false
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
    changeActions: (state, action: PayloadAction<any>) => ({
      ...state,
      actions: action.payload
    }),
    changeBonds: (state, action: PayloadAction<Object>) => ({
      ...state,
      bonds: action.payload
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
  changeBonds,
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

      const portfolio = await polkamarketsService.getPortfolio();
      dispatch(changePortfolio(portfolio));

      const bonds = await polkamarketsService.getBonds();
      dispatch(changeBonds(bonds));

      dispatch(
        changeLoading({
          key: 'portfolio',
          value: false
        })
      );

      const actions = await polkamarketsService.getActions();
      dispatch(changeActions(actions));

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