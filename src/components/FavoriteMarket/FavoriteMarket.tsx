import { useCallback } from 'react';

import cn from 'classnames';
import type { Market } from 'models/market';

import Icon from 'components/Icon';

import { useFavoriteMarkets } from 'hooks';

export default function FavoriteMarket({
  market,
  className
}: {
  market: Market;
  className?: string;
}) {
  const favoriteMarkets = useFavoriteMarkets();
  const isFavoriteMarket = favoriteMarkets.favoriteMarkets[
    `${market.networkId}`
  ]?.includes(market.id);
  const handleFavClick = useCallback(
    () =>
      favoriteMarkets[
        isFavoriteMarket ? 'removeFavoriteMarket' : 'addFavoriteMarket'
      ](market.networkId, market.id),
    [favoriteMarkets, isFavoriteMarket, market.id, market.networkId]
  );

  return (
    <button
      type="button"
      onClick={handleFavClick}
      className={cn(
        'pm-c-market-footer__actions-button',
        {
          'pm-c-market-footer__actions-favorite--active': isFavoriteMarket
        },
        className,
        'button-favorite'
      )}
    >
      <Icon name="Star" title="Bookmark market" />
    </button>
  );
}
