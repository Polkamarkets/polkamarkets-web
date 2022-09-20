import { roundNumber } from 'helpers/math';
import { Market } from 'models/market';
import { LiquidityDetails } from 'redux/ducks/liquidity';

function formatMiniTableItems(
  action,
  ticker,
  predictions,
  selectedPredictionId,
  selectedMarketId,
  shares,
  price,
  maxROI,
  totalStake
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

function calculateLiquidityAdded(
  market: Market,
  ethAmount: number
): LiquidityDetails {
  // TODO: move formulas to polkamarketsjs
  const minOutcome = market.outcomes.reduce((prev, curr) => {
    return prev.shares < curr.shares ? prev : curr;
  });

  const liquidityRatio = (minOutcome.shares * ethAmount) / market.liquidity;

  const liquidityShares = liquidityRatio;
  const liquidityStake = liquidityRatio * market.liquidityPrice;
  const totalStake = ethAmount;

  const outcomeStake = ethAmount - liquidityStake;
  const outcomeDetails = [
    {
      outcome: minOutcome,
      stake: outcomeStake,
      shares: outcomeStake / minOutcome.price
    }
  ];

  return {
    liquidityShares,
    liquidityStake,
    totalStake,
    outcomeDetails
  };
}

function calculateLiquidityRemoved(
  market: Market,
  sharesAmount: number
): LiquidityDetails {
  // TODO: move formulas to polkamarketsjs
  const maxOutcome = market.outcomes.reduce((prev, curr) => {
    return prev.shares > curr.shares ? prev : curr;
  });

  const liquidityShares = sharesAmount;
  const liquidityStake = (market.liquidity / maxOutcome.shares) * sharesAmount;

  const totalStake = sharesAmount * market.liquidityPrice;

  const outcomeStake = totalStake - liquidityStake;
  const outcomeDetails = [
    {
      outcome: maxOutcome,
      stake: outcomeStake,
      shares: outcomeStake / maxOutcome.price
    }
  ];

  return {
    liquidityShares,
    liquidityStake,
    totalStake,
    outcomeDetails
  };
}

function calculateLiquidityDetails(action, market, amount): LiquidityDetails {
  // balanced (50-50 prices) market
  if (market.liquidityPrice === 1) {
    return {
      liquidityShares: amount,
      liquidityStake: amount,
      totalStake: amount,
      outcomeDetails: []
    };
  }

  if (action === 'add') {
    return calculateLiquidityAdded(market, amount);
  }

  return calculateLiquidityRemoved(market, amount);
}

export { formatMiniTableItems, calculateLiquidityDetails };
