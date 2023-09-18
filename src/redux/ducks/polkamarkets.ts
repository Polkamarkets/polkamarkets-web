import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PolkamarketsService } from 'services';
import { Currency } from 'types/currency';
import { Token } from 'types/token';

export type Action = {
  action: string;
  marketId: number;
  outcomeId: number;
  shares: number;
  value: number;
  timestamp: number;
  transactionHash: string;
};

export type Votes = { [key: string]: { upvoted: boolean; downvoted: boolean } };

export type PolkamarketsInitialState = {
  isLoggedIn: boolean;
  ethAddress: string;
  ethBalance: number;
  polkBalance: number;
  polkApproved: boolean;
  socialLoginInfo: any;
  polkClaimed: boolean;
  portfolio: any;
  actions: Action[];
  marketsWithActions: string[];
  bonds: any;
  marketsWithBonds: string[];
  bondActions: any[];
  votes: Votes;
  isLoading: {
    portfolio: boolean;
    bonds: boolean;
    actions: boolean;
    votes: boolean;
    login: boolean;
  };
  createMarketToken: Token | Currency | null;
};

const initialState: PolkamarketsInitialState = {
  isLoggedIn: false,
  ethAddress: '',
  ethBalance: 0,
  polkBalance: 0,
  polkApproved: false,
  socialLoginInfo: null,
  polkClaimed: false,
  portfolio: {},
  actions: [],
  marketsWithActions: [],
  bonds: {},
  marketsWithBonds: [],
  bondActions: [],
  votes: {},
  isLoading: {
    portfolio: false,
    bonds: false,
    actions: false,
    votes: false,
    login: true
  },
  createMarketToken: null
};

const polkamarketsSlice = createSlice({
  name: 'polkamarkets',
  initialState,
  reducers: {
    changeIsLoggedIn: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoggedIn: action.payload
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
    changeSocialLoginInfo: (state, action: PayloadAction<any>) => ({
      ...state,
      socialLoginInfo: action.payload
    }),
    changePolkClaimed: (state, action: PayloadAction<boolean>) => ({
      ...state,
      polkClaimed: action.payload
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
    changeVotes: (state, action: PayloadAction<Votes>) => ({
      ...state,
      votes: action.payload
    }),
    changeVoteByMarketId: (
      state,
      action: PayloadAction<{
        marketId: string;
        vote: { upvoted: boolean; downvoted: boolean };
      }>
    ) => {
      const { marketId, vote } = action.payload;
      return {
        ...state,
        votes: {
          ...state.votes,
          [marketId]: vote
        }
      };
    },
    changeCreateMarketToken: (
      state,
      action: PayloadAction<Token | Currency | null>
    ) => ({
      ...state,
      createMarketToken: action.payload
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
  changeEthAddress,
  changeEthBalance,
  changePolkBalance,
  changePolkApproved,
  changePolkClaimed,
  changeSocialLoginInfo,
  changePortfolio,
  changeActions,
  changeMarketsWithActions,
  changeBonds,
  changeMarketsWithBonds,
  changeBondActions,
  changeVotes,
  changeVoteByMarketId,
  changeCreateMarketToken,
  changeLoading
} = polkamarketsSlice.actions;

// fetching initial wallet details
function login(polkamarketsService: PolkamarketsService) {
  return async dispatch => {
    const isLoggedIn = await polkamarketsService.isLoggedIn();

    dispatch(
      changeLoading({
        key: 'login',
        value: true
      })
    );
    dispatch(changeIsLoggedIn(isLoggedIn));

    if (isLoggedIn) {
      await polkamarketsService.login();

      const address = await polkamarketsService.getAddress();
      dispatch(changeEthAddress(address));

      polkamarketsService
        .getBalance()
        .then(balance => {
          dispatch(changeEthBalance(balance));
        })
        .catch(() => {});

      polkamarketsService
        .getPolkBalance()
        .then(polkBalance => {
          dispatch(changePolkBalance(polkBalance));
        })
        .catch(() => {});

      polkamarketsService
        .isPolkClaimed()
        .then(polkClaimed => {
          if (!polkClaimed) {
            polkamarketsService
              .claimPolk()
              .then(_polkClaimed => {
                // balance is updated after claim
                polkamarketsService
                  .getPolkBalance()
                  .then(polkBalance => {
                    dispatch(changePolkBalance(polkBalance));
                  })
                  .catch(() => {});
              })
              .catch(() => {});
          }

          dispatch(changePolkClaimed(polkClaimed));
          dispatch(
            changeLoading({
              key: 'login',
              value: false
            })
          );
        })
        .catch(() => {});

      polkamarketsService
        .isRealitioERC20Approved()
        .then(polkApproved => {
          dispatch(changePolkApproved(polkApproved));
        })
        .catch(() => {});

      polkamarketsService
        .getSocialLoginUserInfo()
        .then(userInfo => {
          dispatch(changeSocialLoginInfo(userInfo));
        })
        .catch(() => {});
    } else {
      dispatch(
        changeLoading({
          key: 'login',
          value: false
        })
      );
    }
  };
}

function logout() {
  return async dispatch => {
    dispatch(changeIsLoggedIn(false));
    dispatch(changeEthAddress(''));
    dispatch(changeEthBalance(0));
    dispatch(changePolkBalance(0));
    dispatch(changePolkClaimed(false));
    dispatch(changePolkApproved(false));
    dispatch(changeSocialLoginInfo(null));
  };
}

function fetchAditionalData(polkamarketsService: PolkamarketsService) {
  return async dispatch => {
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

      dispatch(
        changeLoading({
          key: 'votes',
          value: true
        })
      );

      polkamarketsService
        .getPortfolio()
        .then(portfolio => {
          dispatch(changePortfolio(portfolio));
        })
        .catch(() => {})
        .finally(() => {
          dispatch(
            changeLoading({
              key: 'portfolio',
              value: false
            })
          );
        });

      polkamarketsService
        .getUserVotes()
        .then(votes => {
          dispatch(changeVotes(votes as Votes));
        })
        .catch(() => {})
        .finally(() => {
          dispatch(
            changeLoading({
              key: 'votes',
              value: false
            })
          );
        });

      polkamarketsService
        .getBonds()
        .then(bonds => {
          dispatch(changeBonds(bonds));
        })
        .catch(() => {})
        .finally(() => {
          dispatch(
            changeLoading({
              key: 'bonds',
              value: false
            })
          );
        });

      polkamarketsService.getBondMarketIds().then(bondMarketIds => {
        dispatch(changeMarketsWithBonds(bondMarketIds));
      });

      polkamarketsService
        .getActions()
        .then(actions => {
          dispatch(changeActions(actions as Action[]));
          dispatch(changeMarketsWithActions(actions as Action[]));
        })
        .catch(() => {})
        .finally(() => {
          dispatch(
            changeLoading({
              key: 'actions',
              value: false
            })
          );
        });

      polkamarketsService.getBondActions().then(bondActions => {
        dispatch(changeBondActions(bondActions));
      });
    }
  };
}

export {
  changeIsLoggedIn,
  changeEthAddress,
  changeEthBalance,
  changePolkBalance,
  changePolkApproved,
  changeSocialLoginInfo,
  changePolkClaimed,
  changePortfolio,
  changeActions,
  changeBonds,
  changeBondActions,
  changeVoteByMarketId,
  changeCreateMarketToken,
  login,
  logout,
  fetchAditionalData
};
