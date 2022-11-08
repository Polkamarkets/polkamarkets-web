import { createContext, useContext, useEffect, useState } from 'react';

import { NetworkConfig } from 'config/environment';
import isEmpty from 'lodash/isEmpty';
import { Votes } from 'redux/ducks/polkamarkets';
import { PolkamarketsService } from 'services';

import { useAppSelector, useNetwork } from 'hooks';
import { Network } from 'hooks/useNetwork/networks';

export type VoteContextState = {
  userVotes: Votes;
  userPolkBalance: number;
  userRequiredPolkBalance: number;
  network: Network;
  networkConfig: NetworkConfig;
};

const VoteContext = createContext<VoteContextState>({} as VoteContextState);

function VoteProvider({ children }) {
  const { network, networkConfig } = useNetwork();

  const userVotes = useAppSelector(state => state.polkamarkets.votes);

  const userPolkBalance = useAppSelector(
    state => state.polkamarkets.polkBalance
  );

  const [userRequiredPolkBalance, setUserRequiredPolkBalance] = useState(0);

  useEffect(() => {
    async function getUserRequiredPolkBalance() {
      const polkamarketsService = new PolkamarketsService(networkConfig);

      const response =
        await polkamarketsService.getMinimumVotingRequiredBalance();
      setUserRequiredPolkBalance(response);
    }

    getUserRequiredPolkBalance();
  }, [networkConfig]);

  return (
    <VoteContext.Provider
      value={{
        userVotes,
        userPolkBalance,
        userRequiredPolkBalance,
        network,
        networkConfig
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}

function useVote() {
  const context = useContext(VoteContext);

  if (isEmpty(context)) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
}

export { VoteProvider, useVote };
