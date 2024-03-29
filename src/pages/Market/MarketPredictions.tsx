import { useCallback, useEffect, useState } from 'react';

import { reset, selectOutcome } from 'redux/ducks/trade';
import { useTheme } from 'ui';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalHeaderHide,
  ModalHeaderTitle,
  Trade
} from 'components';
import { TradePredictions } from 'components/Trade';

import { useAppDispatch, useAppSelector, useTrade } from 'hooks';

import styles from './Market.module.scss';
import MarketShares from './MarketShares';
import MarketTransactions from './MarketTransactions';

function MarketPredictions() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { trade, status } = useTrade();

  const marketId = useAppSelector(state => state.market.market.id);
  const marketNetworkId = useAppSelector(
    state => state.market.market.networkId
  );

  const [tradeVisible, setTradeVisible] = useState(false);

  useEffect(() => {
    if (
      status === 'retry' &&
      trade.market.toString() === marketId.toString() &&
      trade.network.toString() === marketNetworkId.toString()
    ) {
      dispatch(selectOutcome(trade.market, trade.network, trade.outcome));
      setTradeVisible(true);
    }
  }, [
    dispatch,
    marketId,
    marketNetworkId,
    status,
    trade.market,
    trade.network,
    trade.outcome
  ]);

  const handleCloseTrade = useCallback(() => {
    dispatch(reset());
    setTradeVisible(false);
  }, [dispatch]);

  const handlePredictionSelected = useCallback(() => {
    if (tradeVisible) return;
    setTradeVisible(true);
  }, [tradeVisible]);

  return (
    <>
      <MarketTransactions />
      <MarketShares onSellSelected={handlePredictionSelected} />
      <div className={styles.predictions}>
        <p className={styles.predictionsTitle}>
          Select your prediction{' '}
          <span className={styles.predictionsTitleCaption}>
            Probability (%)
          </span>
        </p>
        <TradePredictions
          view="default"
          size={theme.device.isDesktop ? 'lg' : 'md'}
          onPredictionSelected={handlePredictionSelected}
        />
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
                  dialog: styles.sidebarDialog
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
      </div>
    </>
  );
}

export default MarketPredictions;
