import dayjs from 'dayjs';
import { roundNumber } from 'helpers/math';
import { Market, Outcome } from 'models/market';
import { Portfolio } from 'models/portfolio';
import { Action } from 'redux/ducks/polkamarkets';
import { GetMarketsByIdsData } from 'services/Polkamarkets/types';

function generateRandomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

function generateChartRandomData(reverse = false) {
  let currentIndex = 0;

  let values = [3, 4, 4.5, 6, 8, 8.1, 10, 11, 12, 13.5, 14].map(
    x => x * generateRandomNumberBetween(2, 12)
  );

  if (reverse) {
    values = values
      .reverse()
      .map(x => x / generateRandomNumberBetween(2, values.length));
  }

  const data = values.map(value => {
    const currentTime = dayjs().add(currentIndex, 'minute');

    const currentEvent = {
      x: currentTime,
      y: value / 10
    };
    currentIndex += 1;

    return currentEvent;
  });

  return data;
}

function formatMarketPositions(
  portfolio: Object,
  actions: Action[],
  markets?: GetMarketsByIdsData
) {
  const headers = [
    {
      title: 'Market',
      key: 'market',
      align: 'left',
      sortBy: 'market.title'
    },
    {
      title: 'Outcome',
      key: 'outcome',
      align: 'left',
      sortBy: 'outcome.title'
    },
    {
      title: 'Price (24h)',
      key: 'price',
      align: 'right',
      sortBy: 'price.value'
    },
    {
      title: 'Profit/Loss',
      key: 'profit',
      align: 'right',
      sortBy: 'profit.value'
    },
    {
      title: 'Shares',
      key: 'shares',
      align: 'center',
      sortBy: 'shares'
    },
    { title: 'Value', key: 'value', align: 'right', sortBy: 'value' },
    {
      title: 'Max. Payout',
      key: 'maxPayout',
      align: 'right',
      sortBy: 'maxPayout'
    },
    {
      title: 'Status',
      key: 'result',
      align: 'right',
      sortBy: 'result.type'
    }
  ];

  const rows: any[] = [];

  // looping through outcomes array and showing positions where user holds shares
  markets?.forEach(market => {
    market.outcomes.forEach((outcome: Outcome) => {
      // ignoring zero balances
      if (portfolio[market.id]?.outcomes[outcome.id]?.shares >= 0.0005) {
        const shares = portfolio[market.id]?.outcomes[outcome.id]?.shares;
        const price = {
          value: outcome.price,
          change: {
            type: outcome.priceChange24h > 0 ? 'up' : 'down',
            value: roundNumber(Math.abs(outcome.priceChange24h) * 100, 2)
          }
        };
        const buyPrice = portfolio[market.id]?.outcomes[outcome.id]?.price;
        const profit = {
          value: (outcome.price - buyPrice) * shares,
          change: {
            type: buyPrice <= outcome.price ? 'up' : 'down',
            // eslint-disable-next-line prettier/prettier
            value: roundNumber(
              (Math.abs(outcome.price - buyPrice) / buyPrice) * 100,
              2
            )
          }
        };
        const value =
          portfolio[market.id]?.outcomes[outcome.id]?.shares * outcome.price;
        const maxPayout = portfolio[market.id]?.outcomes[outcome.id]?.shares;
        let result = { type: 'pending' };
        if (market.state === 'closed') {
          result = { type: 'awaiting_resolution' };
        } else if (
          // user holds shares of voided outcome
          market.voided === true &&
          actions.find(
            action =>
              action.action === 'Claim Voided' &&
              action.outcomeId === outcome.id &&
              action.marketId.toString() === market.id
          )
        ) {
          result = { type: 'claimed_voided' };
        } else if (
          // user already claimed winnings of voided outcome
          market.voided === true
        ) {
          result = { type: 'awaiting_claim_voided' };
        } else if (
          // user holds shares of winning outcome
          market.state === 'resolved' &&
          portfolio[market.id]?.claimStatus.winningsToClaim &&
          !portfolio[market.id]?.claimStatus.winningsClaimed &&
          outcome.id === market.resolvedOutcomeId
        ) {
          // user already claimed winnings of winning outcome
          result = { type: 'awaiting_claim' };
        } else if (
          // user holds shares of winning outcome
          market.state === 'resolved' &&
          portfolio[market.id]?.claimStatus.winningsClaimed &&
          outcome.id === market.resolvedOutcomeId
        ) {
          result = { type: 'claimed' };
        } else if (
          // user holds shares of losing outcome
          market.state === 'resolved' &&
          outcome.id !== market.resolvedOutcomeId
        ) {
          result = { type: 'lost' };
        }

        rows.push({
          market,
          outcome,
          price,
          value,
          profit,
          shares,
          maxPayout,
          result
        });
      }
    });
  });

  return { headers, rows };
}

function formatLiquidityPositions(
  portfolio: Object,
  markets?: GetMarketsByIdsData
) {
  const headers = [
    { title: 'Market', key: 'market', align: 'left', sortBy: 'market.id' },
    { title: 'Shares', key: 'shares', align: 'center', sortBy: 'shares' },
    { title: 'Value', key: 'value', align: 'right', sortBy: 'value.value' },
    {
      title: 'Pool Share',
      key: 'poolShare',
      align: 'right',
      sortBy: 'pollShare'
    },
    { title: 'Fees Earned', key: 'fees', align: 'right', sortBy: 'feesEarned' },
    { title: 'Status', key: 'status', align: 'right', sortBy: 'result.type' }
  ];

  const rows: any[] = [];

  // looping through outcomes array and showing positions where user holds shares
  markets?.forEach((market: Market) => {
    // ignoring zero balances
    if (portfolio[market.id]?.liquidity?.shares > 0.0005) {
      const shares = portfolio[market.id]?.liquidity?.shares;
      const buyPrice = portfolio[market.id]?.liquidity?.price;
      const poolShare = shares / market.liquidity;
      const feesEarned = portfolio[market.id]?.claimStatus.liquidityFees;
      let result = { type: 'pending' };
      const value = {
        value: shares * market.liquidityPrice,
        change: {
          type: buyPrice <= market.liquidityPrice ? 'up' : 'down',
          value: Math.abs(market.liquidityPrice - buyPrice) / buyPrice
        }
      };
      if (market.state === 'closed') {
        result = { type: 'awaiting_resolution' };
      } else if (
        // user holds shares of winning outcome
        market.state === 'resolved' &&
        portfolio[market.id]?.claimStatus.liquidityToClaim &&
        !portfolio[market.id]?.claimStatus.liquidityClaimed
      ) {
        // user already claimed winnings of winning outcome
        result = { type: 'awaiting_claim' };
      } else if (
        // user holds shares of winning outcome
        market.state === 'resolved' &&
        portfolio[market.id]?.claimStatus.liquidityClaimed
      ) {
        result = { type: 'claimed' };
      }

      rows.push({
        market,
        value,
        shares,
        poolShare,
        feesEarned,
        result
      });
    }
  });

  return { headers, rows };
}

function formatPortfolioAnalytics(portfolio: Portfolio, ticker: string) {
  return [
    {
      title: 'Total earnings',
      value: `${roundNumber(portfolio.closedMarketsProfit, 3)} ${ticker}`,
      change: {
        type: 'up',
        amount: 2.58
      },
      backgroundColor: 'yellow',
      chartData: generateChartRandomData()
    },
    {
      title: 'Open positions',
      value: portfolio.openPositions,
      change: {
        type: 'down',
        amount: 2.58
      },
      backgroundColor: 'blue',
      chartData: generateChartRandomData()
    },
    {
      title: 'Liquidity provided',
      value: `${roundNumber(portfolio.liquidityProvided, 3)} ${ticker}`,
      change: {
        type: 'up',
        amount: 2.58
      },
      backgroundColor: 'pink',
      chartData: generateChartRandomData()
    },
    {
      title: 'Liquidity earnings',
      value: `${roundNumber(portfolio.liquidityFeesEarned, 3)} ${ticker}`,
      change: {
        type: 'up',
        amount: 2.58
      },
      backgroundColor: 'orange',
      chartData: generateChartRandomData()
    }
  ];
}

function formatReportPositions(bonds: Object, markets?: GetMarketsByIdsData) {
  const headers = [
    { title: 'Market', key: 'market', align: 'left', sortBy: 'market.id' },
    { title: 'Reported', key: 'value', align: 'center', sortBy: 'value' },
    { title: 'Payout', key: 'payout', align: 'right', sortBy: 'maxPayout' },
    { title: 'Status', key: 'status', align: 'right', sortBy: 'result.type' }
  ];

  const rows: any[] = [];

  // looping through outcomes array and showing positions where user holds shares
  markets?.forEach((market: Market) => {
    // ignoring zero balances
    if (bonds[market.questionId]?.total > 0) {
      const value = bonds[market.questionId]?.total;
      const payout = bonds[market.questionId]?.claimed;
      let result = { type: 'awaiting_resolution' };

      // TODO calculate states with polkamarkets-js
      if (
        bonds[market.questionId]?.withdrawn ||
        (market.question.isClaimed && payout === 0)
      ) {
        result = { type: 'claimed' };
      } else if (market.question.isFinalized) {
        // user still has report tokens to claim
        result = { type: 'awaiting_claim' };
      }

      rows.push({
        market,
        value,
        payout,
        result
      });
    }
  });

  return { headers, rows };
}
export {
  formatMarketPositions,
  formatLiquidityPositions,
  formatReportPositions,
  formatPortfolioAnalytics,
  generateRandomNumberBetween,
  generateChartRandomData
};
