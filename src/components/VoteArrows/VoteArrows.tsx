import { useCallback, useMemo, useState } from 'react';

import cn from 'classnames';
import { Market } from 'models/market';

import { ArrowDown, ArrowUp } from 'assets/icons/components/vote';

import VoteModal from 'components/VoteModal';
import { VoteArrowsSentiment } from 'components/VoteModal/VoteModal.type';

import { useVote } from 'contexts/vote';

import Text from '../new/Text';
import VoteArrowsClasses from './VoteArrows.module.scss';

type VoteArrowsProps = {
  size?: 'sm' | 'md';
  marketId: Market['id'];
  marketSlug: Market['slug'];
  marketNetworkId: Market['networkId'];
  votes: Market['votes'];
};

function VoteArrows({
  size = 'sm',
  marketId,
  marketSlug,
  marketNetworkId,
  votes
}: VoteArrowsProps) {
  // Custom hooks
  const { network, userVotes } = useVote();

  // Local state
  const [show, setShow] = useState(false);

  // Derivated state
  const isAMarketFromCurrentNetwork = `${marketNetworkId}` === network.id;
  const userHasVotedInCurrentMarket = Object.keys(userVotes).includes(
    marketId.toString()
  );

  const userVoteInCurrentMarket = useMemo(
    () =>
      isAMarketFromCurrentNetwork && userHasVotedInCurrentMarket
        ? userVotes[marketId]
        : { downvoted: false, upvoted: false },
    [
      isAMarketFromCurrentNetwork,
      marketId,
      userHasVotedInCurrentMarket,
      userVotes
    ]
  );

  const isNeutral =
    !userVoteInCurrentMarket.upvoted && !userVoteInCurrentMarket.downvoted;
  const isPositive = userVoteInCurrentMarket.upvoted;

  const counter = { up: votes.up, down: votes.down };

  let sentiment: VoteArrowsSentiment;
  if (isNeutral) {
    sentiment = 'neutral';
  } else if (isPositive) {
    sentiment = 'positive';
  } else {
    sentiment = 'negative';
  }

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  const handleHide = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <>
      <VoteModal
        key={marketSlug}
        show={show}
        onHide={handleHide}
        marketId={marketId}
        marketNetworkId={marketNetworkId}
        marketSlug={marketSlug}
        userVote={userVoteInCurrentMarket}
        initialCounter={counter}
        initialSentiment={sentiment}
      />
      <div
        role="button"
        tabIndex={0}
        className={cn(VoteArrowsClasses.root, {
          [VoteArrowsClasses.sm]: size === 'sm',
          [VoteArrowsClasses.md]: size === 'md',
          [VoteArrowsClasses.neutral]: sentiment === 'neutral',
          [VoteArrowsClasses.positive]: sentiment === 'positive',
          [VoteArrowsClasses.negative]: sentiment === 'negative'
        })}
        onClick={handleShow}
        onKeyPress={handleShow}
      >
        <button type="button" className={VoteArrowsClasses.button}>
          <ArrowDown className={VoteArrowsClasses.down} />
        </button>
        <Text
          className={VoteArrowsClasses.counter}
          as="span"
          fontWeight="extrabold"
          color="2"
        >
          {counter.up - counter.down}
        </Text>
        <button type="button" className={VoteArrowsClasses.button}>
          <ArrowUp className={VoteArrowsClasses.up} />
        </button>
      </div>
    </>
  );
}

export default VoteArrows;
