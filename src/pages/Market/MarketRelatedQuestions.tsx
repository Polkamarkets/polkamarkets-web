import { useMemo } from 'react';

import isEmpty from 'lodash/isEmpty';
import type { Market } from 'models/market';
import {
  getCurrencyByTicker,
  getNetworkById,
  getTokenByTicker
} from 'redux/ducks/market';

import { InfoIcon } from 'assets/icons';

import { Text, PredictionCard } from 'components';

import styles from './Market.module.scss';

type MarketRelatedQuestionsProps = {
  markets?: Market[];
};

function MarketRelatedQuestions({ markets }: MarketRelatedQuestionsProps) {
  const relatedQuestions = useMemo(
    () =>
      markets?.map((market: Market) => {
        const network = getNetworkById(market.networkId);
        const ticker = market.token.wrapped
          ? network.currency.ticker
          : market.token.symbol;

        const tokenByTicker = getTokenByTicker(ticker);
        const currencyByTicker = getCurrencyByTicker(ticker);

        return {
          ...market,
          network,
          currency: network.currency,
          token: {
            ...market.token,
            ticker,
            iconName: (tokenByTicker || currencyByTicker).iconName
          },
          outcomes: market.outcomes.map(outcome => ({
            ...outcome,
            price: Number(outcome.price.toFixed(3))
          }))
        } as Market;
      }),
    [markets]
  );

  return (
    <div className={styles.relatedQuestions}>
      {isEmpty(relatedQuestions) ? (
        <div className="pm-c-market-list__empty-state">
          <div className="pm-c-market-list__empty-state__body">
            <InfoIcon />
            <Text
              as="p"
              scale="tiny"
              fontWeight="semibold"
              className="pm-c-market-list__empty-state__body-description"
            >
              There are no related questions at the moment.
            </Text>
          </div>
        </div>
      ) : (
        relatedQuestions?.map((market, index) => (
          <PredictionCard
            key={market.slug}
            market={market}
            className={
              relatedQuestions && index !== relatedQuestions.length - 1
                ? styles.relatedQuestionsItem
                : undefined
            }
            showCategory={false}
            readonly
          />
        ))
      )}
    </div>
  );
}

export default MarketRelatedQuestions;
