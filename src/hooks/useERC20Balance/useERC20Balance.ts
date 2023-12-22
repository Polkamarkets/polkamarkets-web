import { useEffect, useCallback } from 'react';

import { shallow } from 'zustand/shallow';

import usePolkamarketsService from '../usePolkamarketsService';
import useERC20BalanceStore from './useERC20Balance.store';

function useERC20Balance(erc20ContractAddress: string) {
  const polkamarketsService = usePolkamarketsService();

  const [balance, setBalance, isLoadingBalance, setIsLoadingBalance] =
    useERC20BalanceStore(
      state => [
        state.balance,
        state.setBalance,
        state.isLoadingBalance,
        state.setIsLoadingBalance
      ],
      shallow
    );

  const getERC20Balance = useCallback(async () => {
    if (erc20ContractAddress) {
      try {
        setIsLoadingBalance(true);
        const erc20Balance =
          await polkamarketsService.getERC20Balance(erc20ContractAddress);
        setBalance(erc20Balance);
        setIsLoadingBalance(false);
      } catch (error) {
        setIsLoadingBalance(false);
      }
    }
  }, [
    erc20ContractAddress,
    polkamarketsService,
    setBalance,
    setIsLoadingBalance
  ]);

  useEffect(() => {
    getERC20Balance();
  }, [getERC20Balance]);

  return { balance, isLoadingBalance, refreshBalance: getERC20Balance };
}

export default useERC20Balance;
