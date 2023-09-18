import { ui } from 'config';
import { Container, Hero } from 'ui';

import { Button, Text } from 'components';

import HomeClasses from './Home.module.scss';

export default function HomeHero() {
  return (
    <Container className={HomeClasses.header}>
      <Hero
        $backdrop="main"
        $rounded
        $image={ui.hero.image}
        className={`pm-p-home__hero ${HomeClasses.headerHero}`}
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
          {ui.hero.action.title && ui.hero.action.url ? (
            <Button
              className="pm-c-button-normal--primary pm-c-button--sm"
              onClick={() => window.open(ui.hero.action.url, '_blank')}
            >
              {ui.hero.action.title}
            </Button>
          ) : null}
        </div>
      </Hero>
    </Container>
  );
}
