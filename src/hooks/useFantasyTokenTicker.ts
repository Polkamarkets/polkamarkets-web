import { environment } from 'config';

function useFantasyTokenTicker() {
  if (environment.FEATURE_FANTASY_TOKEN_TICKER) {
    return environment.FEATURE_FANTASY_TOKEN_TICKER;
  }

  return undefined;
}

export default useFantasyTokenTicker;
