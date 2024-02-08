import { useCallback } from 'react';

import classNames from 'classnames';
import { Image, useTheme } from 'ui';

import { Button } from 'components';

import { useAppSelector, useOperation, useTrade } from 'hooks';

import styles from './MarketTransactions.module.scss';

function MarketTransactions() {
  const theme = useTheme();
  const trade = useTrade();
  const market = useAppSelector(state => state.market.market);

  const operation = useOperation(market);
  const operationStatus = operation.getMarketStatus();

  const pendingTransaction =
    operationStatus === 'pending' ? operation.data : null;
  const failedTransaction =
    operationStatus === 'failed' ? operation.data : null;

  const handleTryAgain = useCallback(() => {
    trade?.set({
      status: 'retry',
      trade: {
        ...trade.trade,
        market: `${market.id}`,
        outcome: `${failedTransaction?.outcomeId}`,
        network: `${failedTransaction?.networkId}`,
        location: `/markets/${failedTransaction?.marketSlug}`
      }
    });
  }, [failedTransaction, market.id, trade]);

  if (pendingTransaction)
    return (
      <div className={classNames(styles.root, styles.rootPending)}>
        <div className={styles.rootItem}>
          <p className={`${styles.rootItemDescription} notranslate`}>
            <>
              You have a pending prediction of{' '}
              <strong>
                {pendingTransaction.value?.toFixed(1)}{' '}
                {pendingTransaction.ticker}{' '}
              </strong>
              of{' '}
              <div className={styles.rootItemTitleGroup}>
                {pendingTransaction.imageUrl ? (
                  <Image
                    className={styles.rootItemTitleGroupImage}
                    $radius="xs"
                    alt={pendingTransaction.outcomeTitle || ''}
                    $size="x2s"
                    src={pendingTransaction.imageUrl}
                  />
                ) : null}
                <strong>{pendingTransaction.outcomeTitle}</strong>
              </div>
            </>
          </p>
        </div>
      </div>
    );

  if (failedTransaction)
    return (
      <div className={classNames(styles.root, styles.rootFailed)}>
        <div className={styles.rootItem}>
          <p className={`${styles.rootItemDescription} notranslate`}>
            <>
              Your have a failed prediction of{' '}
              <strong>
                {failedTransaction.value?.toFixed(1)} {failedTransaction.ticker}{' '}
              </strong>
              of{' '}
              <div className={styles.rootItemTitleGroup}>
                {failedTransaction.imageUrl ? (
                  <Image
                    className={styles.rootItemTitleGroupImage}
                    $radius="xs"
                    alt={failedTransaction.outcomeTitle || ''}
                    $size="x2s"
                    src={failedTransaction.imageUrl}
                  />
                ) : null}
                <strong>{failedTransaction.outcomeTitle}</strong>
              </div>
            </>
          </p>
          <Button
            size="sm"
            color="danger"
            fullwidth={!theme.device.isTablet}
            className={styles.rootItemButton}
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
        </div>
      </div>
    );

  return null;
}

export default MarketTransactions;
