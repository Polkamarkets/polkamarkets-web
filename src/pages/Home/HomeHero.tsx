import { Hero } from 'ui';

import { Breadcrumb, Button, Icon, Text } from 'components';

export default function HomeHero() {
  return (
    <Hero image="https://polkamarkets.infura-ipfs.io/ipfs/QmVk9KtoD8bhGCcviDYLjeVth9JBbjYpzSbyoVrg4j89FZ">
      <div className="pm-p-home__hero__breadcrumb">
        <Icon name="Moonriver" />
        <Text
          as="span"
          scale="tiny-uppercase"
          fontWeight="semibold"
          style={{
            color: '#F4B731'
          }}
        >
          DAI
        </Text>
        <span className="pm-c-divider--circle" />
        <Breadcrumb>
          <Breadcrumb.Item>Sports</Breadcrumb.Item>
          <Breadcrumb.Item>Soccer</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Text
        as="h2"
        fontWeight="bold"
        scale="heading-large"
        color="light"
        className="pm-p-home__hero__heading"
      >
        What will be the result of Man. Utd vs Man. City on 21st December 2021
      </Text>
      <Button size="sm">View Market</Button>
    </Hero>
  );
}
