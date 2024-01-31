import { useMemo } from 'react';

import cn from 'classnames';

import Icon from 'components/Icon';

import { useDrawer, useUserOperations } from 'hooks';

import styles from './TransactionsButton.module.scss';

interface TransactionsButtonProps
  extends Pick<
    React.ComponentPropsWithoutRef<'button'>,
    'className' | 'onClick'
  > {
  $fullWidth?: boolean;
  $outline?: boolean;
}

export default function TransactionsButton({
  className,
  $fullWidth,
  $outline,
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
    <button
      type="button"
      className={cn(
        'pm-c-button--sm',
        styles.root,
        {
          'pm-c-button-ghost--default': !$outline,
          'pm-c-button-outline--primary': $outline,
          'pm-c-button--fullwidth': $fullWidth
        },
        className
      )}
      onClick={openDrawer}
      {...props}
    >
      <Icon name="Transactions" size="lg" className={styles.icon} />
      {openTransactions}
    </button>
  );
}
