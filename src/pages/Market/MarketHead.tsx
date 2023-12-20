import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import isNull from 'lodash/isNull';
import { Avatar, Container, useTheme } from 'ui';

import {
  Button,
  Icon,
  MarketAvatar,
  MarketCategory,
  Share,
  Text
} from 'components';
import FavoriteMarket from 'components/FavoriteMarket';
import MarketFooter from 'components/Market/MarketFooter';

import { useAppSelector } from 'hooks';

import marketClasses from './Market.module.scss';
import styles from './MarketHead.module.scss';

export default function MarketHead() {
  const market = useAppSelector(state => state.market.market);
  const theme = useTheme();
  const location = useLocation<{ from?: string }>();

  const marketTournament = useMemo(() => {
    if (!market.tournaments) {
      return undefined;
    }

    if (market.tournaments.length === 0) {
      return undefined;
    }

    if (market.tournaments.length === 1) {
      return market.tournaments[0];
    }

    if (market.tournaments.length > 1) {
      if (location.state && location.state.from) {
        const tournament = market.tournaments.find(({ slug }) =>
          location.state.from?.includes(slug)
        );

        return tournament;
      }
    }

    return undefined;
  }, [location.state, market.tournaments]);

  return (
    <Container className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerNavigation}>
          <Link
            to={
              marketTournament ? `/tournaments/${marketTournament.slug}` : '/'
            }
          >
            <Button className={styles.headerNavigationButton}>
              <Icon
                name="Arrow"
                title={`Back to ${marketTournament ? `Tournament` : 'Home'}`}
              />
            </Button>
          </Link>
          {marketTournament ? (
            <h4 className={styles.headerNavigationText}>
              {marketTournament.title}
            </h4>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <Share id={market.slug} className={styles.headerActionsButton} />
          <FavoriteMarket
            market={market}
            className={styles.headerActionsButton}
          />
        </div>
      </div>
      <div className={marketClasses.hero}>
        <Container
          $enableGutters={!theme.device.isDesktop}
          className={marketClasses.heroInfo}
        >
          {!isNull(market.imageUrl) && theme.device.isDesktop && (
            <MarketAvatar
              $radius={theme.device.isDesktop ? 'md' : 'sm'}
              $size={theme.device.isDesktop ? 'lg' : 'md'}
              imageUrl={market.imageUrl}
              verified={!theme.device.isDesktop && market.verified}
            />
          )}
          <div>
            {marketTournament ? (
              <div className={styles.heroTournament}>
                {marketTournament.imageUrl ? (
                  <Avatar
                    $radius="lg"
                    src={marketTournament.imageUrl}
                    alt={marketTournament.title}
                    className={styles.heroTournamentAvatar}
                  />
                ) : null}
                <h4 className={styles.heroTournamentName}>
                  {marketTournament.title}
                </h4>
              </div>
            ) : (
              <MarketCategory
                category={market.category}
                subcategory={market.subcategory}
                verified={theme.device.isDesktop && market.verified}
              />
            )}
            <Text
              as="h2"
              fontWeight={theme.device.isDesktop ? 'bold' : 'medium'}
              scale={theme.device.isDesktop ? 'heading-large' : 'body'}
              className={marketClasses.heroInfoTitle}
            >
              {market.title}
            </Text>
          </div>
        </Container>
      </div>
      <Container className={marketClasses.heroStats}>
        <MarketFooter market={market} showStateOnMobile />
      </Container>
    </Container>
  );
}
