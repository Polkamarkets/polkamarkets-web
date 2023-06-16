import { useCallback, useReducer } from 'react';
import { useLocation } from 'react-router-dom';

import cn from 'classnames';
import { Market } from 'models/market';
import { changeVotes } from 'redux/ducks/market';
import { changeMarketVotesById } from 'redux/ducks/markets';
import { changeVoteByMarketId } from 'redux/ducks/polkamarkets';
import { PolkamarketsApiService, PolkamarketsService } from 'services';

import { TwarningIcon, VerifiedIcon } from 'assets/icons';
import { ArrowDown, ArrowUp } from 'assets/icons/components/vote';

import { Button } from 'components/Button';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';
import ModalFooter from 'components/ModalFooter';
import ModalHeader from 'components/ModalHeader';
import ModalHeaderHide from 'components/ModalHeaderHide';
import ModalHeaderTitle from 'components/ModalHeaderTitle';
import ModalSection from 'components/ModalSection';
import ModalSectionText from 'components/ModalSectionText';
import NetworkSwitch from 'components/Networks/NetworkSwitch';
import Toast from 'components/Toast';
import ToastNotification from 'components/ToastNotification';

import { useVote } from 'contexts/vote';

import { useAppDispatch } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import Feature from '../Feature';
import Link from '../Link';
import Text from '../new/Text';
import VoteModalClasses from './VoteModal.module.scss';
import voteArrowsReducer, {
  downvote,
  removeDownvote,
  removeUpvote,
  upvote,
  VoteArrowsState
} from './VoteModal.reducer';
import { VoteArrowsSentiment } from './VoteModal.type';
import { voteModalProps } from './VoteModal.util';

type VoteModalProps = {
  show: boolean;
  onHide: () => void;
  marketId: Market['id'];
  marketSlug: Market['slug'];
  marketNetworkId: Market['networkId'];
  userVote: { upvoted: boolean; downvoted: boolean };
  initialCounter: { up: number; down: number };
  initialSentiment: VoteArrowsSentiment;
};

function VoteModal({
  show,
  onHide,
  marketId,
  marketSlug,
  marketNetworkId,
  userVote,
  initialCounter,
  initialSentiment
}: VoteModalProps) {
  // Custom hooks
  const { network, networkConfig, userPolkBalance, userRequiredPolkBalance } =
    useVote();
  const { buyEc20Url } = network;

  const appDispatch = useAppDispatch();
  const location = useLocation();
  const { show: showToastNotification, close: closeToastNotification } =
    useToastNotification();

  // Derivated state from props
  const isWrongNetwork = network.id !== `${marketNetworkId}`;
  const needsBuyPolk = userPolkBalance < userRequiredPolkBalance;
  const isMarketPage = location.pathname === `/markets/${marketSlug}`;

  const voteArrowsReducerInitalState: VoteArrowsState = {
    initialCounter,
    counter: initialCounter,
    initialSentiment,
    sentiment: initialSentiment,
    userVote,
    transaction: {
      state: 'not_started',
      successHash: null
    },
    isLoading: false
  };

  const [state, dispatch] = useReducer(
    voteArrowsReducer,
    voteArrowsReducerInitalState
  );

  const {
    counter,
    sentiment,
    userVote: currentUserVote,
    transaction,
    isLoading
  } = state;

  // Actions
  const updateUserVoteByMarketId = useCallback(() => {
    appDispatch(
      changeVoteByMarketId({
        marketId,
        vote: currentUserVote
      })
    );
  }, [appDispatch, currentUserVote, marketId]);

  const updateMarketVotes = useCallback(() => {
    if (isMarketPage) {
      appDispatch(changeVotes(counter));
    } else {
      appDispatch(changeMarketVotesById({ marketId, votes: counter }));
    }
  }, [appDispatch, counter, isMarketPage, marketId]);

  // Handlers
  const handleHide = useCallback(() => {
    if (!isLoading) {
      updateMarketVotes();
      updateUserVoteByMarketId();

      onHide();
    }
  }, [isLoading, onHide, updateMarketVotes, updateUserVoteByMarketId]);

  const handleUpvote = useCallback(async () => {
    const { upvoted } = currentUserVote;

    const polkamarketsService = new PolkamarketsService(networkConfig);
    const polkamarketsApiService = new PolkamarketsApiService();

    if (upvoted) {
      await removeUpvote({
        dispatch,
        polkamarketsService,
        marketId,
        polkamarketsApiService,
        marketSlug,
        showToastNotification
      });
    } else {
      await upvote({
        dispatch,
        polkamarketsService,
        marketId,
        polkamarketsApiService,
        marketSlug,
        showToastNotification
      });
    }
  }, [
    currentUserVote,
    marketId,
    marketSlug,
    networkConfig,
    showToastNotification
  ]);

  const handleDownvote = useCallback(async () => {
    const { downvoted } = currentUserVote;

    const polkamarketsService = new PolkamarketsService(networkConfig);
    const polkamarketsApiService = new PolkamarketsApiService();

    if (downvoted) {
      await removeDownvote({
        dispatch,
        polkamarketsService,
        marketId,
        polkamarketsApiService,
        marketSlug,
        showToastNotification
      });
    } else {
      await downvote({
        dispatch,
        polkamarketsService,
        marketId,
        polkamarketsApiService,
        marketSlug,
        showToastNotification
      });
    }
  }, [
    currentUserVote,
    marketId,
    marketSlug,
    networkConfig,
    showToastNotification
  ]);

  const handleBuyPolk = useCallback(async () => {
    window.open(buyEc20Url, '_blank');
  }, [buyEc20Url]);

  return (
    <>
      {transaction.state === 'success' ? (
        <ToastNotification id={`vote-${marketSlug}-success`} duration={10000}>
          <Toast
            variant="success"
            title="Success"
            description="Your transaction is completed!"
          >
            <Toast.Actions>
              <Feature name="regular">
                <a
                  target="_blank"
                  href={`${network.explorerURL}/tx/${transaction.successHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
              </Feature>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  closeToastNotification(`vote-${marketSlug}-success`)
                }
              >
                Dismiss
              </Button>
            </Toast.Actions>
          </Toast>
        </ToastNotification>
      ) : null}
      <Modal
        show={show}
        centered
        className={{ dialog: VoteModalClasses.dialog }}
        onHide={handleHide}
      >
        <ModalContent>
          <ModalHeader>
            <ModalHeaderHide onClick={handleHide} />
            <div className={VoteModalClasses.verifyMarket}>
              <VerifiedIcon size="sm" />
              <Text
                as="span"
                fontSize="body-4"
                fontWeight="semibold"
                transform="uppercase"
                color="violets-are-blue"
              >
                Market curation
              </Text>
            </div>
            <ModalHeaderTitle
              className={VoteModalClasses.headerTitle}
              id={voteModalProps['aria-labelledby']}
            >
              Upvote or downvote to curate markets
            </ModalHeaderTitle>
          </ModalHeader>
          <ModalSection className={VoteModalClasses.section}>
            <ModalSectionText id={voteModalProps['aria-describedby']}>
              {`Markets are curated by the POLK holder community. Markets with more upvotes than downvotes are marked as Verified. `}
              <Link
                title="Learn more"
                href="https://help.polkamarkets.com/en/articles/6686769-how-to-curate-prediction-markets"
                aria-label="Learn more"
                target="_blank"
                rel="noreferrer"
                variant="information"
              />
            </ModalSectionText>
          </ModalSection>
          <div className={VoteModalClasses.body}>
            <div
              className={cn(VoteModalClasses.arrows, {
                [VoteModalClasses.neutral]: sentiment === 'neutral',
                [VoteModalClasses.positive]: sentiment === 'positive',
                [VoteModalClasses.negative]: sentiment === 'negative',
                [VoteModalClasses.disabled]: isWrongNetwork || isLoading
              })}
            >
              <button
                type="button"
                className={VoteModalClasses.button}
                onClick={handleDownvote}
                disabled={isWrongNetwork || needsBuyPolk || isLoading}
              >
                <ArrowDown className={VoteModalClasses.down} />
              </button>
              {isLoading ? (
                <span className="spinner--primary" />
              ) : (
                <Text
                  className={VoteModalClasses.counter}
                  as="span"
                  fontWeight="extrabold"
                  color="2"
                >
                  {counter.up - counter.down}
                </Text>
              )}
              <button
                type="button"
                className={VoteModalClasses.button}
                onClick={handleUpvote}
                disabled={isWrongNetwork || needsBuyPolk || isLoading}
              >
                <ArrowUp className={VoteModalClasses.up} />
              </button>
            </div>
            {isWrongNetwork ? (
              <NetworkSwitch targetNetworkId={marketNetworkId} />
            ) : null}
          </div>
          <ModalFooter className={VoteModalClasses.footer}>
            <Text as="p" fontSize="body-2" fontWeight="medium" color="3">
              {`By clicking you’re agreeing to our `}
              <a
                className={cn(
                  'pm-c-link',
                  'text-body-2',
                  'font-medium',
                  'text-3'
                )}
                href="https://www.polkamarkets.com/legal/terms-conditions"
                target="_blank"
                rel="noreferrer"
              >
                Terms and Conditions
              </a>
              .
            </Text>
          </ModalFooter>
        </ModalContent>
        {needsBuyPolk ? (
          <ModalContent>
            <div className={VoteModalClasses.alertHeader}>
              <div className={VoteModalClasses.alertHeaderTitle}>
                <TwarningIcon
                  size={24}
                  className={VoteModalClasses.warningIcon}
                />
                <Text as="p" fontSize="body-2" fontWeight="semibold" color="1">
                  {`You need to have POLK in your wallet to curate markets. `}
                  <Link
                    title="Learn more"
                    href="https://help.polkamarkets.com/en/articles/6686769-how-to-curate-prediction-markets"
                    aria-label="Learn more"
                    target="_blank"
                    rel="noreferrer"
                    variant="information"
                  />
                </Text>
              </div>
              <Button size="xs" color="primary" onClick={handleBuyPolk}>
                Buy $POLK
              </Button>
            </div>
          </ModalContent>
        ) : null}
      </Modal>
    </>
  );
}

export default VoteModal;
