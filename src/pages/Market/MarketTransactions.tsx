import { useCallback } from 'react';

import classNames from 'classnames';
import { Image, useTheme } from 'ui';

import { Button } from 'components';

import { useAppSelector, useTrade, useUserOperations } from 'hooks';

import styles from './MarketTransactions.module.scss';

function MarketTransactions() {
  const theme = useTheme();
  const userOperations = useUserOperations();
  const trade = useTrade();

  const marketId = useAppSelector(state => state.market.market.id).toString();
  const outcomesIds = useAppSelector(state => state.market.market.outcomes).map(
    outcome => outcome.id.toString()
  );

  const pendingTransaction = userOperations?.data
    ?.filter(operation => operation.status === 'pending')
    .find(
      operation =>
        operation.marketId.toString() === marketId &&
        outcomesIds.includes(operation.outcomeId.toString())
    );

  const failedTransaction = userOperations?.data
    ?.filter(operation => operation.status === 'failed')
    .find(
      operation =>
        operation.marketId.toString() === marketId &&
        outcomesIds.includes(operation.outcomeId.toString())
    );

  const handleTryAgain = useCallback(() => {
    trade?.set({
      status: 'retrying',
      trade: {
        ...trade.trade,
        market: `${marketId}`,
        outcome: `${failedTransaction?.outcomeId}`,
        network: `${failedTransaction?.networkId}`,
        location: `/markets/${failedTransaction?.marketSlug}`
      }
    });
  }, [
    failedTransaction?.marketSlug,
    failedTransaction?.networkId,
    failedTransaction?.outcomeId,
    marketId,
    trade
  ]);

  if (pendingTransaction)
    return (
      <div className={classNames(styles.root, styles.rootPending)}>
        <div className={styles.rootItem}>
          <p className={`${styles.rootItemDescription} notranslate`}>
            <>
              You have a pending prediction of{' '}
              <strong>
                {pendingTransaction.value.toFixed(1)}{' '}
                {pendingTransaction.ticker}{' '}
              </strong>
              of{' '}
              <div className={styles.rootItemTitleGroup}>
                {pendingTransaction.imageUrl ? (
                  <Image
                    className={styles.rootItemTitleGroupImage}
                    $radius="xs"
                    alt={pendingTransaction.outcomeTitle}
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
                {failedTransaction.value.toFixed(1)} {failedTransaction.ticker}{' '}
              </strong>
              of{' '}
              <div className={styles.rootItemTitleGroup}>
                {failedTransaction.imageUrl ? (
                  <Image
                    className={styles.rootItemTitleGroupImage}
                    $radius="xs"
                    alt={failedTransaction.outcomeTitle}
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
