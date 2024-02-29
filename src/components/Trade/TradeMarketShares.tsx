/* eslint-disable no-nested-ternary */
import { useMemo } from 'react';

import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { Image } from 'ui';

import { useAppSelector, useLanguage, useNetwork } from 'hooks';

import { calculateEthAmountSold } from '../TradeForm/utils';
import styles from './TradeMarketShares.module.scss';

function TradeMarketShares() {
  const language = useLanguage();
  const { network } = useNetwork();

  const { market } = useAppSelector(state => state.market);
  const { id, outcomes, networkId, token } = useAppSelector(
    state => state.market.market
  );
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const { portfolio: isLoadingPortfolio } = useAppSelector(
    state => state.polkamarkets.isLoading
  );

  const outcomesWithShares = useMemo(() => {
    if (isLoadingPortfolio) return [];

    const marketShares = portfolio[id];

    if (!marketShares) return [];

    const sharesByOutcome = outcomes.map(outcome => {
      const outcomeShares = marketShares.outcomes[outcome.id];

      return {
        id: outcome.id.toString(),
        title: outcome.title,
        imageUrl: outcome.imageUrl,
        shares: outcomeShares ? outcomeShares.shares : 0,
        buyValue: outcomeShares
          ? outcomeShares.shares * outcomeShares.price
          : 0,
        value:
          outcomeShares && outcomeShares.shares > 0
            ? calculateEthAmountSold(market, outcome, outcomeShares.shares)
                .totalStake
            : 0
      };
    });

    return sharesByOutcome.filter(outcome => outcome.shares > 1e0);
  }, [id, isLoadingPortfolio, outcomes, portfolio, market]);

  const isWrongNetwork = network.id !== networkId.toString();

  if (isWrongNetwork || isEmpty(outcomesWithShares)) return null;

  return (
    <ul className={styles.root}>
      {outcomesWithShares.map(outcome => (
        <li key={outcome.id} className={styles.rootItem}>
          <p className={`${styles.rootItemDescription} notranslate`}>
            {language === 'tr' ? (
              <>
                Şu anda <strong>{`${roundNumber(outcome.shares, 3)}`}</strong>{' '}
                adet{' '}
                <div className={styles.rootItemTitleGroup}>
                  {outcome.imageUrl ? (
                    <Image
                      className={styles.rootItemTitleGroupImage}
                      $radius="lg"
                      alt={outcome.title}
                      $size="x2s"
                      src={outcome.imageUrl}
                    />
                  ) : null}
                  <strong>{outcome.title}</strong>
                </div>{' '}
                hissesine sahipsiniz ve bunun değeri{' '}
                <strong>
                  {outcome.value.toFixed(3)} {token.symbol}
                </strong>{' '}
                denk geliyor
              </>
            ) : language === 'pt' ? (
              <>
                Tens{' '}
                <strong>
                  {outcome.value.toFixed(1)} {token.symbol}{' '}
                </strong>
                de{' '}
                <div className={styles.rootItemTitleGroup}>
                  {outcome.imageUrl ? (
                    <Image
                      className={styles.rootItemTitleGroupImage}
                      $radius="xs"
                      alt={outcome.title}
                      $size="x2s"
                      src={outcome.imageUrl}
                    />
                  ) : null}
                  <strong>{outcome.title}</strong>
                </div>{' '}
                com um desempenho de{' '}
                <strong>
                  {outcome.value > outcome.buyValue ? '+' : ''}
                  {(outcome.value - outcome.buyValue).toFixed(1)} {token.symbol}{' '}
                </strong>
                ({outcome.value > outcome.buyValue ? '+' : ''}
                {(
                  ((outcome.value - outcome.buyValue) / outcome.buyValue) *
                  100
                ).toFixed(1)}
                %)
              </>
            ) : (
              <>
                You hold{' '}
                <strong>
                  {outcome.value.toFixed(1)} {token.symbol}{' '}
                </strong>
                of{' '}
                <div className={styles.rootItemTitleGroup}>
                  {outcome.imageUrl ? (
                    <Image
                      className={styles.rootItemTitleGroupImage}
                      $radius="xs"
                      alt={outcome.title}
                      $size="x2s"
                      src={outcome.imageUrl}
                    />
                  ) : null}
                  <strong>{outcome.title}</strong>
                </div>{' '}
                performing{' '}
                <strong>
                  {outcome.value > outcome.buyValue ? '+' : ''}
                  {(outcome.value - outcome.buyValue).toFixed(1)} {token.symbol}{' '}
                </strong>
                ({outcome.value > outcome.buyValue ? '+' : ''}
                {(
                  ((outcome.value - outcome.buyValue) / outcome.buyValue) *
                  100
                ).toFixed(1)}
                %)
              </>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default TradeMarketShares;
