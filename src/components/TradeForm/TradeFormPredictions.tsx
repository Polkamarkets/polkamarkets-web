import { useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

import cn from 'classnames';
import getMarketColors from 'helpers/getMarketColors';
import { roundNumber } from 'helpers/math';
import sortOutcomes from 'helpers/sortOutcomes';
import { selectOutcome } from 'redux/ducks/trade';
import { useTheme } from 'ui';

import OutcomeItem from 'components/OutcomeItem';

import { useAppDispatch, useAppSelector, useExpandableOutcomes } from 'hooks';

import tradeFormClasses from './TradeForm.module.scss';

export default function TradeFormPredictions() {
  const dispatch = useAppDispatch();
  const trade = useAppSelector(state => state.trade);
  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const market = useAppSelector(state => state.market.market);
  const theme = useTheme();
  const sortedOutcomes = sortOutcomes({
    outcomes: market.outcomes,
    timeframe: '7d'
  });
  const expandableOutcomes = useExpandableOutcomes({
    outcomes: sortedOutcomes
  });
  const handleOutcomeClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      dispatch(
        selectOutcome(
          trade.selectedMarketId,
          trade.selectedMarketNetworkId,
          +event.currentTarget.value
        )
      );
    },
    [dispatch, trade.selectedMarketId, trade.selectedMarketNetworkId]
  );
  const Footer = useCallback(
    () => (
      <OutcomeItem
        $size="md"
        $variant="dashed"
        onClick={expandableOutcomes.expand}
        primary={expandableOutcomes.offseted.primary}
        secondary={expandableOutcomes.offseted.secondary}
        token={market.token}
      />
    ),
    [
      expandableOutcomes.expand,
      expandableOutcomes.offseted.primary,
      expandableOutcomes.offseted.secondary,
      market
    ]
  );
  const marketColors = getMarketColors({
    network: market.network.id,
    market: market.id
  });
  const needExpandOutcomes = sortedOutcomes.length > 3;
  const outcomes =
    theme.device.isDesktop && needExpandOutcomes
      ? expandableOutcomes.onseted
      : sortedOutcomes;

  return (
    <div className="pm-c-trade-form-predictions">
      {theme.device.isDesktop ? (
        <Virtuoso
          height="100%"
          data={outcomes}
          components={{
            Footer:
              needExpandOutcomes && !expandableOutcomes.isExpanded
                ? Footer
                : undefined
          }}
          itemContent={(index, outcome) => (
            <OutcomeItem
              $size="md"
              image={outcome.imageUrl}
              value={outcome.id}
              data={outcome.data}
              token={market.token}
              primary={outcome.title}
              activeColor={marketColors.outcome(outcome.id)}
              onClick={handleOutcomeClick}
              secondary={{
                price: outcome.price,
                ticker: market.token.ticker,
                isPriceUp: outcome.isPriceUp
              }}
              isActive={
                outcome.id === +trade.selectedOutcomeId &&
                outcome.marketId === +trade.selectedMarketId
              }
              invested={roundNumber(
                portfolio[trade.selectedMarketId]?.outcomes[outcome.id]?.shares,
                3
              )}
              className={cn({
                [tradeFormClasses.gutterOutcome]:
                  !expandableOutcomes.isExpanded ||
                  index !== expandableOutcomes.onseted.length - 1
              })}
            />
          )}
        />
      ) : (
        <ul className={tradeFormClasses.horizontal}>
          {outcomes.map(outcome => (
            <li key={outcome.title} className={tradeFormClasses.horizontalItem}>
              <OutcomeItem
                $size="md"
                image={outcome.imageUrl}
                value={outcome.id}
                token={market.token}
                onClick={handleOutcomeClick}
                activeColor={marketColors.outcome(+outcome.id)}
                primary={outcome.title}
                secondary={{
                  price: outcome.price,
                  ticker: market.token.ticker,
                  isPriceUp: outcome.isPriceUp
                }}
                isActive={
                  outcome.id === +trade.selectedOutcomeId &&
                  outcome.marketId === +trade.selectedMarketId
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
