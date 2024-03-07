import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import classNames from 'classnames';
import { features } from 'config';
import sortOutcomes from 'helpers/sortOutcomes';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import type { Market } from 'models/market';
import { marketSelected } from 'redux/ducks/market';
import { reset, selectOutcome } from 'redux/ducks/trade';
import { closeTradeForm, openReportForm, openTradeForm } from 'redux/ducks/ui';
import { useTheme } from 'ui';

import {
  useAppDispatch,
  useAppSelector,
  useExpandableOutcomes,
  useOperation
} from 'hooks';

import Modal from '../Modal';
import ModalContent from '../ModalContent';
import ModalHeader from '../ModalHeader';
import ModalHeaderHide from '../ModalHeaderHide';
import ModalHeaderTitle from '../ModalHeaderTitle';
import OutcomeItem, { OutcomeProps } from '../OutcomeItem';
import Trade from '../Trade';
import { calculateEthAmountSold } from '../TradeForm/utils';
import styles from './MarketOutcomes.module.scss';

type MarketOutcomesProps = {
  market: Market;
  readonly?: boolean;
  compact?: boolean;
};

export default function MarketOutcomes({
  market,
  readonly = false,
  compact = false
}: MarketOutcomesProps) {
  // Hooks
  const history = useHistory();
  const location = useLocation();

  // Custom hooks
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const operation = useOperation(market);
  const { getOutcomeStatus, getMultipleOutcomesStatus } = operation;

  // Redux selectors
  const trade = useAppSelector(state => state.trade);
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);

  // Loading state
  const { portfolio: isLoadingPortfolio } = useAppSelector(
    state => state.polkamarkets.isLoading
  );

  // Local state
  const [tradeVisible, setTradeVisible] = useState(false);

  // Derived state
  const sortedOutcomes = useMemo(
    () =>
      sortOutcomes({
        outcomes: market.outcomes,
        timeframe: '7d',
        predictedOutcome:
          market.outcomes.length > 3 && operation.predictedOutcome
            ? { id: operation.predictedOutcome.id, newIndex: 1 }
            : undefined
      }),
    [market.outcomes, operation.predictedOutcome]
  );

  const expandableOutcomes = useExpandableOutcomes({
    outcomes: sortedOutcomes,
    max: theme.device.isDesktop && !compact ? 2 : 1
  });

  const needExpandOutcomes =
    sortedOutcomes.length > (theme.device.isDesktop && !compact ? 3 : 2);

  const outcomesWithShares = useMemo(() => {
    if (isLoadingPortfolio) return [];

    const marketShares = portfolio[market.id];

    if (!marketShares) return [];

    const sharesByOutcome = market.outcomes.map(outcome => {
      const outcomeShares = marketShares.outcomes[outcome.id];

      return {
        id: outcome.id.toString(),
        title: outcome.title,
        imageUrl: outcome.imageUrl,
        shares: outcomeShares ? outcomeShares.shares : 0,
        buyValue: outcomeShares
          ? outcomeShares.shares * outcomeShares.price
          : 0,
        value:
          outcomeShares && outcomeShares.shares > 0
            ? calculateEthAmountSold(market, outcome, outcomeShares.shares)
                .totalStake
            : 0
      };
    });

    return sharesByOutcome.filter(outcome => outcome.shares > 1e-5);
  }, [isLoadingPortfolio, portfolio, market]);

  const getOutcomeActive = useCallback(
    (id: string | number) =>
      market.id === trade.selectedMarketId &&
      id === +trade.selectedOutcomeId &&
      market.networkId === trade.selectedMarketNetworkId,
    [
      market.id,
      market.networkId,
      trade.selectedMarketId,
      trade.selectedMarketNetworkId,
      trade.selectedOutcomeId
    ]
  );

  const setOutcome = useCallback(
    async (outcomeId: string) => {
      dispatch(marketSelected(market));
      dispatch(selectOutcome(market.id, market.networkId, outcomeId));
    },
    [dispatch, market]
  );

  const handleOutcomeClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (readonly) {
        history.push(`/markets/${market.slug}`, { from: location.pathname });
        window.location.reload();
      } else {
        const { value } = event.currentTarget;

        const isOutcomeActive = getOutcomeActive(value);

        setOutcome(isOutcomeActive ? '' : value);

        if (features.fantasy.enabled) {
          setTradeVisible(true);
        } else {
          if (market.state === 'closed') {
            dispatch(openReportForm());
          } else {
            dispatch(openTradeForm());
          }
          if (isOutcomeActive) {
            dispatch(closeTradeForm());
          }
          history.push(`/markets/${market.slug}`, { from: location.pathname });
        }
      }
    },
    [
      readonly,
      getOutcomeActive,
      setOutcome,
      history,
      market.slug,
      market.state,
      location.pathname,
      dispatch
    ]
  );

  const handleCloseTrade = useCallback(async () => {
    dispatch(reset());
    setTradeVisible(false);

    try {
      if ('SELECTED_OUTCOME' in localStorage)
        localStorage.removeItem('SELECTED_OUTCOME');
    } catch (error) {
      // unsupported
    }
  }, [dispatch]);

  useEffect(() => {
    (async function getOutcomeSelected() {
      try {
        if ('SELECTED_OUTCOME' in localStorage && features.fantasy.enabled) {
          const selectedOutcome =
            localStorage.getItem('SELECTED_OUTCOME') || '{}';
          const persistIds = JSON.parse(selectedOutcome) as Record<
            'market' | 'network' | 'outcome',
            string
          >;
          const isOutcomeActive = getOutcomeActive(persistIds.outcome);

          if (
            persistIds.market === market.id &&
            persistIds.network === market.networkId
          ) {
            setOutcome(isOutcomeActive ? '' : persistIds.outcome);
            setTradeVisible(true);
            // clean local storage after modal is opened
            localStorage.removeItem('SELECTED_OUTCOME');
          }
        }
      } catch (error) {
        // unsupported
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outcomesData = useMemo(() => {
    return (
      needExpandOutcomes ? expandableOutcomes.onseted : sortedOutcomes
    ).map(outcome => {
      const $state = getOutcomeStatus(+outcome.id);
      const isActive = getOutcomeActive(outcome.id);
      const resolved = (() => {
        if (market.voided) return 'voided';
        if (market.resolvedOutcomeId === outcome.id) return 'won';
        if (market.state === 'resolved') return 'lost';
        return undefined;
      })();

      return {
        id: outcome.id,
        $size: 'sm',
        image: outcome.imageUrl,
        value: outcome.id,
        data: outcome.data,
        primary: outcome.title,
        $state,
        token: market.token,
        outcomesWithShares,
        isActive,
        onClick: handleOutcomeClick,
        secondary: {
          price:
            market.state === 'resolved' && !isUndefined(outcome.closingPrice)
              ? +outcome.closingPrice.toFixed(3)
              : outcome.price,
          ticker: market.token.ticker,
          isPriceUp: outcome.isPriceUp
        },
        resolved
      } as { id: string } & OutcomeProps;
    });
  }, [
    expandableOutcomes.onseted,
    getOutcomeActive,
    getOutcomeStatus,
    handleOutcomeClick,
    market.resolvedOutcomeId,
    market.state,
    market.token,
    market.voided,
    needExpandOutcomes,
    outcomesWithShares,
    sortedOutcomes
  ]);

  const expandableOutcomesData = useMemo(() => {
    const $state = getMultipleOutcomesStatus(
      expandableOutcomes.off.map(outcome => +outcome.id)
    );

    return {
      $size: 'sm',
      $variant: 'dashed',
      $state,
      value: expandableOutcomes.onseted[0].id,
      token: market.token,
      outcomesWithShares,
      onClick: handleOutcomeClick,
      ...expandableOutcomes.offseted
    } as { value: string } & OutcomeProps;
  }, [
    expandableOutcomes.off,
    expandableOutcomes.offseted,
    expandableOutcomes.onseted,
    getMultipleOutcomesStatus,
    handleOutcomeClick,
    market.token,
    outcomesWithShares
  ]);

  return (
    <ul
      className={classNames('pm-c-market-outcomes', styles.root, {
        [styles.rootHasPrediction]: !isEmpty(outcomesWithShares)
      })}
    >
      <Modal
        show={tradeVisible}
        onHide={handleCloseTrade}
        {...(theme.device.isDesktop
          ? { centered: true }
          : {
              fullWidth: true,
              initial: { bottom: '-100%' },
              animate: { left: 0, bottom: 0 },
              exit: { bottom: '-100%' },
              className: {
                dialog: styles.tradeModalDialog
              }
            })}
      >
        <ModalContent className={styles.tradeModalContent}>
          <ModalHeader className={styles.tradeModalHeader}>
            <ModalHeaderHide onClick={handleCloseTrade} />
            <ModalHeaderTitle className={styles.tradeModalHeaderTitle}>
              Make your prediction
            </ModalHeaderTitle>
          </ModalHeader>
          <Trade view="modal" onTradeFinished={handleCloseTrade} />
        </ModalContent>
      </Modal>
      {outcomesData.map(outcome => (
        <li key={outcome.id}>
          <OutcomeItem {...outcome} />
        </li>
      ))}
      {needExpandOutcomes && !expandableOutcomes.isExpanded && (
        <li>
          <OutcomeItem {...expandableOutcomesData} />
        </li>
      )}
    </ul>
  );
}
