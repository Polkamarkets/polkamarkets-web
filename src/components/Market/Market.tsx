import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { features } from 'config';
import { isNull } from 'lodash';
import { Market as MarketInterface } from 'models/market';
import { Avatar, useTheme } from 'ui';

import MarketAvatar from 'components/MarketAvatar';
import MarketCategory from 'components/MarketCategory';
import Text from 'components/Text';

import { useAppDispatch } from 'hooks';

import styles from './Market.module.scss';
import MarketFooter from './MarketFooter';
import MarketOutcomes from './MarketOutcomes';

type MarketCardProps = {
  market: MarketInterface;
  showCategory?: boolean;
  showLand?: boolean;
};

function Market({
  market,
  showCategory = true,
  showLand = false
}: MarketCardProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const location = useLocation();

  const handleNavigation = useCallback(async () => {
    const { clearMarket } = await import('redux/ducks/market');
    const { openTradeForm } = await import('redux/ducks/ui');
    const { selectOutcome } = await import('redux/ducks/trade');

    if (features.regular.enabled) {
      dispatch(
        selectOutcome(market.id, market.networkId, market.outcomes[0].id)
      );
    }

    dispatch(clearMarket());

    if (features.regular.enabled) {
      dispatch(openTradeForm());
    }
  }, [dispatch, market.id, market.networkId, market.outcomes]);

  return (
    <Link
      className="pm-c-market__body"
      to={{
        pathname: `/markets/${market.slug}`,
        state: { from: location.pathname }
      }}
      onClick={handleNavigation}
    >
      {!isNull(market.imageUrl) && (
        <MarketAvatar
          $size="md"
          $radius="sm"
          imageUrl={market.imageUrl}
          verified={!theme.device.isDesktop && market.verified}
        />
      )}
      <div className="pm-c-market__body-details">
        {!showCategory && showLand && market.land ? (
          <div className={styles.bodyDetailsLand}>
            {market.land.imageUrl ? (
              <Avatar
                $radius="lg"
                src={market.land.imageUrl}
                alt={market.land.title}
                className={styles.bodyDetailsLandAvatar}
              />
            ) : null}
            <h4 className={styles.bodyDetailsLandTitle}>{market.land.title}</h4>
          </div>
        ) : null}
        {!showLand && showCategory ? (
          <MarketCategory
            category={market.category}
            subcategory={market.subcategory}
            verified={theme.device.isDesktop && market.verified}
          />
        ) : null}
        <Text as="p" scale="body" fontWeight="medium">
          {market.title}
        </Text>
      </div>
    </Link>
  );
}

Market.Outcomes = MarketOutcomes;
Market.Footer = MarketFooter;

export default Market;
