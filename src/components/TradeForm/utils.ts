import { newtonRaphson } from '@fvictorio/newton-raphson-method';
import Big from 'big.js';
import { roundNumber } from 'helpers/math';
import { Market, Outcome } from 'models/market';
import { TradeDetails } from 'redux/ducks/trade';

function formatMiniTableItems(
  action,
  ticker,
  market,
  predictions,
  selectedPredictionId,
  selectedMarketId,
  shares,
  price,
  maxROI,
  totalStake,
  fee
) {
  const selectedPredictionObj = predictions.find(
    prediction =>
      prediction.id === selectedPredictionId &&
      prediction.marketId === selectedMarketId
  );

  const items = [
    {
      key: 'prediction',
      title: 'Prediction',
      value: selectedPredictionObj?.title || ''
    },
    {
      key: 'pricePerFraction',
      title: 'Price per share',
      // eslint-disable-next-line prettier/prettier
      value: `${roundNumber(
        price || selectedPredictionObj?.price || 0,
        3
      )} ${ticker}`
    },
    {
      key: 'shares',
      title: action === 'buy' ? 'Est. Shares bought' : 'Shares sold',
      value: roundNumber(shares, 3)
    },
    {
      key: 'fee',
      title: `Fee (${roundNumber(
        (market.fee + market.treasuryFee) * 100,
        0
      )}%)`,
      value: roundNumber(fee, 3)
    }
  ];

  if (action === 'sell') return items;

  // adding ROI + stake items to buy action

  return [
    ...items,
    {
      key: 'roi',
      title: 'Maximum ROI',
      value: `${roundNumber(maxROI, 3)}%`
    },
    {
      key: 'stake',
      title: 'Total stake',
      value: `${roundNumber(totalStake, 3)} ${ticker}`
    }
  ];
}

function calculateSharesBought(
  market: Market,
  outcome: Outcome,
  ethAmount: number
): TradeDetails {
  // TODO: move formulas to polkamarketsjs

  // taking fee of ethAmount
  const fee = (market.fee + market.treasuryFee) * ethAmount;
  const amount = ethAmount - fee;

  // calculating product of all other outcome shares + amount
  const product = market.outcomes.reduce((acc, cur) => {
    if (cur.id === outcome.id) return acc;

    return acc * (cur.shares + amount);
  }, 1);

  // calculating liquidity from n-root of product of all outcome shares
  // eslint-disable-next-line no-restricted-properties
  const liquidity = Math.pow(
    market.outcomes.reduce((acc, cur) => {
      return acc * cur.shares;
    }, 1),
    1 / market.outcomes.length
  );

  const newOutcomeShares = liquidity ** market.outcomes.length / product;

  const shares = outcome.shares - newOutcomeShares + amount || 0;
  const price = amount / shares || 0;
  const maxROI = shares > 1e-6 ? (1 / price - 1) * 100 : 0;
  const totalStake = ethAmount;
  const maxStake = shares - amount;

  return {
    price,
    shares,
    maxROI,
    totalStake,
    maxStake,
    fee
  };
}

function calculateEthAmountSold(
  market: Market,
  outcome: Outcome,
  shares: number
): TradeDetails {
  const sharesBig = new Big(shares.toString()).mul(100);

  const outcomeSharesBig = new Big(outcome.shares.toString()).mul(100);
  const otherOutcomeSharesBig = [] as any;

  market.outcomes.forEach(marketOutcome => {
    if (marketOutcome.id !== outcome.id) {
      otherOutcomeSharesBig.push(
        new Big(marketOutcome.shares.toString()).mul(100)
      );
    }
  });

  // Credit to Omen team for this formula
  // https://github.com/protofire/omen-exchange/blob/29d0ab16bdafa5cc0d37933c1c7608a055400c73/app/src/util/tools/fpmm/trading/index.ts#L110
  const totalStakeFunction = (f: Big) => {
    // For three outcomes, where the first outcome is the one being sold, the formula is:
    // f(r) = ((y - R) * (z - R)) * (x  + a - R) - x*y*z
    // where:
    //   `R` is r / (1 - fee)
    //   `x`, `y`, `z` are the market maker holdings for each outcome
    //   `a` is the amount of outcomes that are being sold
    //   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
    // multiplying all terms by 100 to avoid floating point errors

    const F = f.mul(100);
    const firstTerm = otherOutcomeSharesBig
      .map(h => h.minus(F))
      .reduce((a, b) => a.mul(b));
    const secondTerm = outcomeSharesBig.plus(sharesBig).minus(F);
    const thirdTerm = otherOutcomeSharesBig.reduce(
      (a, b) => a.mul(b),
      outcomeSharesBig
    );

    return firstTerm.mul(secondTerm).minus(thirdTerm).div(100);
  };

  const totalStakeBig = newtonRaphson(totalStakeFunction, 0, {
    maxIterations: 100
  });
  // flooring totalStake to  avoid floating point errors
  const totalStake = Number(totalStakeBig) * 0.999999999;

  const price = shares > 0 ? totalStake / shares : outcome.price;

  // ROI is not relevant on sell
  const maxROI = 1;
  const maxStake = 0;
  const fee = totalStake * (market.fee + market.treasuryFee);

  return {
    price,
    shares,
    maxROI,
    totalStake,
    maxStake,
    fee
  };
}

function calculateTradeDetails(action, market, outcome, amount): TradeDetails {
  if (action === 'sell') {
    return calculateEthAmountSold(market, outcome, amount);
  }

  return calculateSharesBought(market, outcome, amount);
}

export { formatMiniTableItems, calculateTradeDetails };
