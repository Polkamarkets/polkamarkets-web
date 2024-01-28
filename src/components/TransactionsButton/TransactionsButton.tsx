import { useMemo } from 'react';

import cn from 'classnames';
import { useGetUserOperationsByAddressQuery } from 'services/Polkamarkets';

import Icon from 'components/Icon';

import { useAppSelector, useDrawer } from 'hooks';

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

  const { login: isLoadingLogin } = useAppSelector(
    state => state.polkamarkets.isLoading
  );

  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const userAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const {
    data: userOperations,
    isLoading: isLoadingUserOperations,
    isFetching: isFetchingUserOperations
  } = useGetUserOperationsByAddressQuery(
    { address: userAddress },
    { skip: !isLoggedIn || isLoadingLogin }
  );

  const isLoading = isLoadingUserOperations || isFetchingUserOperations;

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
      {`(${openTransactions})`}
    </button>
  );
}
