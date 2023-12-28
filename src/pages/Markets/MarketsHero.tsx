import { features, ui } from 'config';
import { Container, Hero } from 'ui';

import { Button, ProfileSignin, Text } from 'components';

import useAppSelector from 'hooks/useAppSelector';

import styles from './Markets.module.scss';

export default function MarketsHero() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const hasCta = ui.hero.action.title && ui.hero.action.url;

  return (
    <Container className={styles.header}>
      <Hero
        $backdrop="main"
        $rounded
        $image={ui.hero.image}
        className={`pm-p-home__hero ${styles.headerHero}`}
        {...(ui.hero.image_url && {
          $as: 'a',
          href: ui.hero.image_url,
          target: '_blank',
          rel: 'noopener',
          'aria-label': ui.hero.action.title || 'Learn More'
        })}
      >
        <div className="pm-p-home__hero__content">
          <div className="pm-p-home__hero__breadcrumb">
            {ui.hero.header ? (
              <Text
                as="span"
                scale="tiny-uppercase"
                fontWeight="semibold"
                color="white-50"
              >
                {ui.hero.header}
              </Text>
            ) : null}
          </div>
          {ui.hero.title ? (
            <Text
              as="h2"
              fontWeight="bold"
              scale="heading-large"
              color="light"
              className="pm-p-home__hero__heading"
            >
              {ui.hero.title}
            </Text>
          ) : null}
          {hasCta && (
            <Button
              variant="normal"
              color="primary"
              size="sm"
              onClick={() => window.open(ui.hero.action.url, '_blank')}
            >
              {ui.hero.action.title}
            </Button>
          )}
          {!hasCta && features.fantasy.enabled && !isLoggedIn && (
            <ProfileSignin variant="normal" color="primary">
              Login
            </ProfileSignin>
          )}
        </div>
      </Hero>
    </Container>
  );
}
