import { useMemo } from 'react';

import { Button } from 'components/Button';
import Icon from 'components/Icon';

import { useDrawer, useUserOperations } from 'hooks';

import styles from './TransactionsButton.module.scss';

type TransactionsButtonProps = {
  className?: string;
  onClick?: () => void;
};

export default function TransactionsButton({
  ...props
}: TransactionsButtonProps) {
  const openDrawer = useDrawer(state => state.open);
  const { data: userOperations, isLoading } = useUserOperations();

  const openTransactions = useMemo(() => {
    if (isLoading || !userOperations) return 0;

    return userOperations.filter(operation =>
      ['pending', 'failed'].includes(operation.status)
    ).length;
  }, [isLoading, userOperations]);

  return (
    <Button onClick={openDrawer} {...props} variant="ghost">
      <div className={styles.wrapper}>
        <Icon name="Transactions" size="lg" />
        {openTransactions > 0 && (
          <div className={styles.badge}>{openTransactions}</div>
        )}
      </div>
    </Button>
  );
}
