import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { features } from 'config';
import sortOutcomes from 'helpers/sortOutcomes';
import type { Market } from 'models/market';
import { reset } from 'redux/ducks/trade';
import { useTheme } from 'ui';

import OutcomeItem from 'components/OutcomeItem';

import {
  useAppDispatch,
  useAppSelector,
  useExpandableOutcomes,
  useTrade
} from 'hooks';

import Modal from '../Modal';
import ModalContent from '../ModalContent';
import ModalHeader from '../ModalHeader';
import ModalHeaderHide from '../ModalHeaderHide';
import ModalHeaderTitle from '../ModalHeaderTitle';
import Trade from '../Trade';
import styles from './MarketOutcomes.module.scss';

type MarketOutcomesProps = {
  market: Market;
  readonly?: boolean;
};

export default function MarketOutcomes({
  market,
  readonly = false
}: MarketOutcomesProps) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const trade = useAppSelector(state => state.trade);
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const theme = useTheme();
  const { trade: tradeState, status } = useTrade();

  const isPredictedOutcome = useCallback(
    (outcomeId: string | number) =>
      portfolio[market.id]?.outcomes[outcomeId]?.shares >= 0.0005,
    [market.id, portfolio]
  );

  const [tradeVisible, setTradeVisible] = useState(false);

  const sortedOutcomes = sortOutcomes({
    outcomes: market.outcomes,
    timeframe: '7d'
  });
  const expandableOutcomes = useExpandableOutcomes({
    outcomes: sortedOutcomes,
    max: theme.device.isDesktop ? 2 : 1
  });
  const needExpandOutcomes =
    sortedOutcomes.length > (theme.device.isDesktop ? 3 : 2);
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
      const { marketSelected } = await import('redux/ducks/market');
      const { selectOutcome } = await import('redux/ducks/trade');

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
            const { openReportForm } = await import('redux/ducks/ui');

            dispatch(openReportForm());
          } else {
            const { openTradeForm } = await import('redux/ducks/ui');

            dispatch(openTradeForm());
          }
          if (isOutcomeActive) {
            const { closeTradeForm } = await import('redux/ducks/ui');

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
            try {
              if ('SELECTED_OUTCOME' in localStorage)
                localStorage.removeItem('SELECTED_OUTCOME');
            } catch (error) {
              // unsupported
            }
          }
        }
      } catch (error) {
        // unsupported
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      status === 'error' &&
      tradeState.market === market.id &&
      tradeState.network === market.networkId
    ) {
      setOutcome(tradeState.outcome.toString());
      setTradeVisible(true);
    }
  }, [
    market.id,
    market.networkId,
    setOutcome,
    status,
    tradeState.market,
    tradeState.network,
    tradeState.outcome
  ]);

  return (
    <ul className="pm-c-market-outcomes">
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
      {(needExpandOutcomes ? expandableOutcomes.onseted : sortedOutcomes).map(
        outcome => (
          <li key={outcome.id}>
            <OutcomeItem
              $size="sm"
              image={outcome.imageUrl}
              value={outcome.id}
              data={outcome.data}
              primary={outcome.title}
              isPredicted={isPredictedOutcome(outcome.id)}
              isActive={getOutcomeActive(outcome.id)}
              onClick={handleOutcomeClick}
              secondary={{
                price: outcome.price,
                ticker: market.token.ticker,
                isPriceUp: outcome.isPriceUp
              }}
              resolved={(() => {
                if (market.voided) return 'voided';
                if (market.resolvedOutcomeId === outcome.id) return 'won';
                if (market.state === 'resolved') return 'lost';
                return undefined;
              })()}
            />
          </li>
        )
      )}
      {needExpandOutcomes && !expandableOutcomes.isExpanded && (
        <li>
          <OutcomeItem
            $size="sm"
            $variant="dashed"
            isPredicted={expandableOutcomes.off.some(outcome =>
              isPredictedOutcome(outcome.id)
            )}
            value={expandableOutcomes.onseted[0].id}
            onClick={handleOutcomeClick}
            {...expandableOutcomes.offseted}
          />
        </li>
      )}
    </ul>
  );
}
