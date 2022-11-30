import { useEffect, memo, useCallback } from 'react';

import isEmpty from 'lodash/isEmpty';
import { Market } from 'models/market';
import { useAppDispatch } from 'redux/store';
import { Hero, useMedia } from 'ui';

import { InfoIcon } from 'assets/icons';

import { useAppSelector, useFooterVisibility } from 'hooks';

import Breadcrumb from '../Breadcrumb';
import { Button } from '../Button';
import Icon from '../Icon';
import PredictionCard from '../PredictionCard';
import Text from '../Text';
import VirtualizedList from '../VirtualizedList';

function MarketListHeader() {
  return (
    <Hero
      className="pm-p-home__hero"
      image="https://polkamarkets.infura-ipfs.io/ipfs/QmVk9KtoD8bhGCcviDYLjeVth9JBbjYpzSbyoVrg4j89FZ"
    >
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

type MarketListAsyncProps = {
  id: string;
  asyncAction: any;
  filterBy: any;
  markets: Market[];
};

const MarketListAsync = ({
  id,
  asyncAction,
  filterBy,
  markets
}: MarketListAsyncProps) => {
  const dispatch = useAppDispatch();
  const isDesktop = useMedia('(min-width: 1024px)');

  const { show, hide } = useFooterVisibility();
  const { isLoading, error } = useAppSelector(state => state.markets);

  useEffect(() => {
    if (!isEmpty(filterBy)) {
      dispatch(asyncAction(filterBy));
    }
  }, [dispatch, asyncAction, filterBy]);

  useEffect(() => {
    if (!isEmpty(markets)) {
      hide();
    }
    return () => show();
  }, [dispatch, markets, hide, show]);

  const refreshMarkets = useCallback(() => {
    if (!isEmpty(filterBy)) {
      dispatch(asyncAction(filterBy));
    }
  }, [asyncAction, dispatch, filterBy]);

  const setFooterVisibility = useCallback(
    (atBottom: boolean) => (atBottom ? show() : hide()),
    [hide, show]
  );

  if (isLoading[id])
    return (
      <div className="pm-c-market-list__empty-state">
        <div className="pm-c-market-list__empty-state__body">
          <span className="spinner--primary" />
        </div>
      </div>
    );

  if (error[id] && error[id].message !== 'canceled') {
    return (
      <div className="pm-c-market-list__error">
        <div className="pm-c-market-list__error__body">
          <InfoIcon />
          <Text
            as="p"
            scale="tiny"
            fontWeight="semibold"
            className="pm-c-market-list__empty-state__body-description"
          >
            Error fetching markets
          </Text>
        </div>
        <div className="pm-c-market-list__error__actions">
          <Button color="primary" size="sm" onClick={refreshMarkets}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (isEmpty(markets)) {
    return (
      <div className="pm-c-market-list__empty-state">
        <div className="pm-c-market-list__empty-state__body">
          <InfoIcon />
          <Text
            as="p"
            scale="tiny"
            fontWeight="semibold"
            className="pm-c-market-list__empty-state__body-description"
          >
            There are no available markets for this category.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-c-market-list">
      <VirtualizedList
        components={{ Header: isDesktop ? MarketListHeader : undefined }}
        height="100%"
        data={markets}
        itemContent={(_index, market) => (
          <div className="pm-c-market-list__item">
            <PredictionCard market={market} />
          </div>
        )}
        atBottom={atBottom => setFooterVisibility(atBottom)}
      />
    </div>
  );
};

export default memo(MarketListAsync);
