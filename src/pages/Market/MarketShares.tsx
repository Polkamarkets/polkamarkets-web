import { useCallback, useMemo } from 'react';

import { roundNumber } from 'helpers/math';
import isEmpty from 'lodash/isEmpty';
import { changeTradeType, selectOutcome } from 'redux/ducks/trade';
import { Image } from 'ui';

import { Button } from 'components';

import { useAppDispatch, useAppSelector, useLanguage, useNetwork } from 'hooks';

import { calculateTradeDetails } from '../../components/TradeForm/utils';
import styles from './MarketShares.module.scss';

type MarketSharesProps = {
  onSellSelected?: () => void;
};

function MarketShares({ onSellSelected }: MarketSharesProps) {
  const dispatch = useAppDispatch();
  const { network } = useNetwork();
  const { type } = useAppSelector(state => state.trade);
  const { market } = useAppSelector(state => state.market);
  const { id, outcomes, networkId, token } = useAppSelector(
    state => state.market.market
  );
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const { portfolio: isLoadingPortfolio } = useAppSelector(
    state => state.polkamarkets.isLoading
  );

  const language = useLanguage();

  const handleSell = useCallback(
    (outcomeId: string) => {
      if (onSellSelected) {
        onSellSelected();
      }

      if (type !== 'sell') {
        dispatch(changeTradeType('sell'));
      }

      dispatch(selectOutcome(id, networkId, outcomeId));
    },
    [dispatch, id, networkId, onSellSelected, type]
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
        value:
          outcomeShares && outcomeShares.shares > 0
            ? calculateTradeDetails(
                'sell',
                market,
                outcome,
                outcomeShares.shares
              ).totalStake
            : 0
      };
    });

    return sharesByOutcome.filter(outcome => outcome.shares > 1e-5);
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
                adet
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
                </div>
                hissesine sahipsiniz ve bunun değeri{' '}
                <strong>
                  {outcome.value.toFixed(3)} {token.symbol}
                </strong>{' '}
                denk geliyor
              </>
            ) : (
              <>
                You currently hold{' '}
                <strong>{`${roundNumber(outcome.shares, 3)}`} Shares</strong> of
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
                </div>
                worth{' '}
                <strong>
                  {outcome.value.toFixed(3)} {token.symbol}
                </strong>
              </>
            )}
          </p>
          <Button size="sm" onClick={() => handleSell(outcome.id)}>
            Sell Shares
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default MarketShares;
