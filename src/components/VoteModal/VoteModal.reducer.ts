import { Market } from 'models/market';
import { PolkamarketsApiService, PolkamarketsService } from 'services';

import { VoteArrowsSentiment } from './VoteModal.type';

export enum VoteArrowsActions {
  UPVOTE_REQUEST = 'UPVOTE_REQUEST',
  UPVOTE_SUCCESS = 'UPVOTE_SUCCESS',
  UPVOTE_FAILURE = 'UPVOTE_FAILURE',
  DOWNVOTE_REQUEST = 'DOWNVOTE_REQUEST',
  DOWNVOTE_SUCCESS = 'DOWNVOTE_SUCCESS',
  DOWNVOTE_FAILURE = 'DOWNVOTE_FAILURE',
  REMOVE_UPVOTE_REQUEST = 'REMOVE_UPVOTE_REQUEST',
  REMOVE_UPVOTE_SUCCESS = 'REMOVE_UPVOTE_SUCCESS',
  REMOVE_UPVOTE_FAILURE = 'REMOVE_UPVOTE_FAILURE',
  REMOVE_DOWNVOTE_REQUEST = 'REMOVE_DOWNVOTE_REQUEST',
  REMOVE_DOWNVOTE_SUCCESS = 'REMOVE_DOWNVOTE_SUCCESS',
  REMOVE_DOWNVOTE_FAILURE = 'REMOVE_DOWNVOTE_FAILURE',
  RESET = 'RESET'
}

type VoteArrowsAction = {
  type: VoteArrowsActions;
  payload?: any;
};

type VoteArrowsCounter = {
  up: number;
  down: number;
};

type UserVote = {
  upvoted: boolean;
  downvoted: boolean;
};

type Transaction = {
  state: 'not_started' | 'request' | 'success' | 'failure';
  successHash: string | null;
};

export type VoteArrowsState = {
  initialCounter: VoteArrowsCounter;
  counter: VoteArrowsCounter;
  initialSentiment: VoteArrowsSentiment;
  sentiment: VoteArrowsSentiment;
  userVote: UserVote;
  transaction: Transaction;
  isLoading: boolean;
};

function voteArrowsReducer(
  state: VoteArrowsState,
  action: VoteArrowsAction
): VoteArrowsState {
  const { type, payload } = action;

  switch (type) {
    case VoteArrowsActions.UPVOTE_REQUEST:
      return {
        ...state,
        counter:
          state.sentiment === 'neutral'
            ? {
                ...state.initialCounter,
                up: state.initialCounter.up + 1
              }
            : {
                up: state.initialCounter.up + 1,
                down: state.initialCounter.down - 1
              },
        sentiment: 'positive',
        transaction: {
          state: 'request',
          successHash: null
        },
        isLoading: true
      };
    case VoteArrowsActions.UPVOTE_SUCCESS:
      return {
        ...state,
        userVote: { upvoted: true, downvoted: false },
        transaction: {
          state: 'success',
          successHash: payload.successHash
        },
        isLoading: false
      };
    case VoteArrowsActions.UPVOTE_FAILURE:
      return {
        ...state,
        counter: state.initialCounter,
        sentiment: state.initialSentiment,
        transaction: {
          state: 'failure',
          successHash: null
        },
        isLoading: false
      };
    case VoteArrowsActions.DOWNVOTE_REQUEST:
      return {
        ...state,
        counter:
          state.sentiment === 'neutral'
            ? { ...state.initialCounter, down: state.initialCounter.down + 1 }
            : {
                up: state.initialCounter.up - 1,
                down: state.initialCounter.down + 1
              },
        sentiment: 'negative',
        transaction: {
          state: 'request',
          successHash: null
        },
        isLoading: true
      };
    case VoteArrowsActions.DOWNVOTE_SUCCESS:
      return {
        ...state,
        userVote: { upvoted: false, downvoted: true },
        transaction: {
          state: 'success',
          successHash: payload.successHash
        },
        isLoading: false
      };
    case VoteArrowsActions.DOWNVOTE_FAILURE:
      return {
        ...state,
        counter: state.initialCounter,
        sentiment: state.initialSentiment,
        transaction: {
          state: 'failure',
          successHash: null
        },
        isLoading: false
      };
    case VoteArrowsActions.REMOVE_UPVOTE_REQUEST:
      return {
        ...state,
        counter: { ...state.initialCounter, up: state.initialCounter.up - 1 },
        sentiment: 'neutral',
        transaction: {
          state: 'request',
          successHash: null
        },
        isLoading: true
      };
    case VoteArrowsActions.REMOVE_UPVOTE_SUCCESS:
      return {
        ...state,
        userVote: { upvoted: false, downvoted: false },
        transaction: {
          state: 'success',
          successHash: payload.successHash
        },
        isLoading: false
      };
    case VoteArrowsActions.REMOVE_UPVOTE_FAILURE:
      return {
        ...state,
        counter: state.initialCounter,
        sentiment: state.initialSentiment,
        transaction: {
          state: 'failure',
          successHash: null
        },
        isLoading: false
      };
    case VoteArrowsActions.REMOVE_DOWNVOTE_REQUEST:
      return {
        ...state,
        counter: {
          ...state.initialCounter,
          down: state.initialCounter.down - 1
        },
        sentiment: 'neutral',
        transaction: {
          state: 'request',
          successHash: null
        },
        isLoading: true
      };
    case VoteArrowsActions.REMOVE_DOWNVOTE_SUCCESS:
      return {
        ...state,
        userVote: { upvoted: false, downvoted: false },
        transaction: {
          state: 'success',
          successHash: payload.successHash
        },
        isLoading: false
      };
    case VoteArrowsActions.REMOVE_DOWNVOTE_FAILURE:
      return {
        ...state,
        counter: state.initialCounter,
        sentiment: state.initialSentiment,
        transaction: {
          state: 'failure',
          successHash: null
        },
        isLoading: false
      };
    case VoteArrowsActions.RESET:
      return {
        ...state,
        initialCounter: state.counter,
        initialSentiment: state.sentiment,
        isLoading: false
      };
    default:
      return state;
  }
}

export default voteArrowsReducer;

type VoteArrowsActionArgs = {
  dispatch: (value: VoteArrowsAction) => void;
  polkamarketsService: PolkamarketsService;
  marketId: Market['id'];
  polkamarketsApiService: PolkamarketsApiService;
  marketSlug: Market['slug'];
  showToastNotification: (id: string) => void;
};

async function upvote({
  dispatch,
  polkamarketsService,
  marketId,
  polkamarketsApiService,
  marketSlug,
  showToastNotification
}: VoteArrowsActionArgs) {
  dispatch({ type: VoteArrowsActions.UPVOTE_REQUEST });

  try {
    const response = await polkamarketsService.upvoteItem(marketId);
    const { status, transactionHash } = response;

    if (status && transactionHash) {
      dispatch({
        type: VoteArrowsActions.UPVOTE_SUCCESS,
        payload: { successHash: transactionHash }
      });
      showToastNotification(`vote-${marketSlug}-success`);
      dispatch({ type: VoteArrowsActions.RESET });
    }

    polkamarketsApiService.reloadMarket(marketSlug);
  } catch (error) {
    dispatch({ type: VoteArrowsActions.UPVOTE_FAILURE });
  }
}

async function removeUpvote({
  dispatch,
  polkamarketsService,
  marketId,
  polkamarketsApiService,
  marketSlug,
  showToastNotification
}: VoteArrowsActionArgs) {
  dispatch({ type: VoteArrowsActions.REMOVE_UPVOTE_REQUEST });

  try {
    const response = await polkamarketsService.removeUpvoteItem(marketId);
    const { status, transactionHash } = response;

    if (status && transactionHash) {
      dispatch({
        type: VoteArrowsActions.REMOVE_UPVOTE_SUCCESS,
        payload: { successHash: transactionHash }
      });
      showToastNotification(`vote-${marketSlug}-success`);
      dispatch({ type: VoteArrowsActions.RESET });
    }

    polkamarketsApiService.reloadMarket(marketSlug);
  } catch (error) {
    dispatch({ type: VoteArrowsActions.REMOVE_UPVOTE_FAILURE });
  }
}

async function downvote({
  dispatch,
  polkamarketsService,
  marketId,
  polkamarketsApiService,
  marketSlug,
  showToastNotification
}: VoteArrowsActionArgs) {
  dispatch({ type: VoteArrowsActions.DOWNVOTE_REQUEST });

  try {
    const response = await polkamarketsService.downvoteItem(marketId);
    const { status, transactionHash } = response;

    if (status && transactionHash) {
      dispatch({
        type: VoteArrowsActions.DOWNVOTE_SUCCESS,
        payload: { successHash: transactionHash }
      });
      showToastNotification(`vote-${marketSlug}-success`);
      dispatch({ type: VoteArrowsActions.RESET });
    }

    polkamarketsApiService.reloadMarket(marketSlug);
  } catch (error) {
    dispatch({ type: VoteArrowsActions.DOWNVOTE_FAILURE });
  }
}

async function removeDownvote({
  dispatch,
  polkamarketsService,
  marketId,
  polkamarketsApiService,
  marketSlug,
  showToastNotification
}: VoteArrowsActionArgs) {
  dispatch({ type: VoteArrowsActions.REMOVE_DOWNVOTE_REQUEST });

  try {
    const response = await polkamarketsService.removeDownvoteItem(marketId);
    const { status, transactionHash } = response;

    if (status && transactionHash) {
      dispatch({
        type: VoteArrowsActions.REMOVE_DOWNVOTE_SUCCESS,
        payload: { successHash: transactionHash }
      });
      showToastNotification(`vote-${marketSlug}-success`);
      dispatch({ type: VoteArrowsActions.RESET });
    }

    polkamarketsApiService.reloadMarket(marketSlug);
  } catch (error) {
    dispatch({ type: VoteArrowsActions.REMOVE_DOWNVOTE_FAILURE });
  }
}

export { upvote, removeUpvote, downvote, removeDownvote };
