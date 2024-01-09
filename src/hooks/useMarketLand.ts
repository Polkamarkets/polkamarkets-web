import { environment } from 'config';
import { isEmpty, uniqBy } from 'lodash';
import { useGetLandsQuery } from 'services/Polkamarkets';

export default function useMarketLand(id: string) {
  const lands = useGetLandsQuery({
    token: environment.FEATURE_FANTASY_TOKEN_TICKER
  });

  if (lands.isFetching || lands.isLoading || !lands.data || isEmpty(lands.data))
    return null;

  const marketsIdsByLand = lands.data.map(land => ({
    land,
    markets: uniqBy(
      land.tournaments.map(tournament => tournament.markets || []).flat(),
      'slug'
    ).map(market => market.id)
  }));

  const marketLand = marketsIdsByLand.find(({ markets }) =>
    markets.includes(id)
  );

  if (!marketLand) return null;

  return marketLand.land;
}
