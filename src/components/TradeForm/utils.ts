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
      title: `Fee (${roundNumber(market.fee * 100, 0)}%)`,
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
  const fee = market.fee * ethAmount;
  const amount = ethAmount - fee;

  // calculating product of all other outcome shares + amount
  const product = market.outcomes.reduce((acc, cur) => {
    if (cur.id === outcome.id) return acc;

    return acc * (cur.shares + amount);
  }, 1);

  const newOutcomeShares = market.liquidity ** market.outcomes.length / product;

  const shares = outcome.shares - newOutcomeShares + amount || 0;
  const price = amount / shares || 0;
  const maxROI = shares > 0 ? (1 / price - 1) * 100 : 0;
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
  // TODO: move formulas to polkamarketsjs
  // x = 1/2 (-sqrt(a^2 - 2 a (y + z) + 4 b + (y + z)^2) + a + y + z)
  // x = ETH amount user will receive
  // y = # shares sold
  // z = # selling shares available
  // a = # opposite shares available
  // b = product balance
  const oppositeShares = market.liquidity ** 2 / outcome.shares;

  const totalStake =
    (1 / 2) *
    (-1 *
      Math.sqrt(
        oppositeShares ** 2 -
          2 * oppositeShares * (shares + outcome.shares) +
          4 * market.liquidity ** 2 +
          (shares + outcome.shares) ** 2
      ) +
      oppositeShares +
      shares +
      outcome.shares);
  const price = shares > 0 ? totalStake / shares : outcome.price;

  // ROI is not relevant on sell
  const maxROI = 1;
  const maxStake = 0;
  const fee = totalStake * market.fee;

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
